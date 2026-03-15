from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .services import SessionManager
import json
import pymysql
import bcrypt
from datetime import datetime


# ================= DB CONNECTION =================
def get_db_conn():
    return pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='eduyata_db',
        cursorclass=pymysql.cursors.Cursor,
        autocommit=False  # Changed to False for proper transaction control
    )


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


# ================= LOGIN HISTORY =================
def log_login_attempt(conn, user_id, user_type, login_status, request,
                      risk_score=0, risk_level="Low", action_taken="NONE"):

    # ✅ Fix ENUM safe values
    valid_login_status = ["success", "failed", "blocked", "locked"]
    valid_risk_levels = ["Low", "Medium", "High", "Critical"]
    valid_actions = ["ALLOW", "MFA_REQUIRED", "BLOCK", "NONE", "BLOCKED", "LOCKED"]

    if login_status not in valid_login_status:
        login_status = "failed"

    if risk_level not in valid_risk_levels:
        risk_level = "Low"

    if action_taken not in valid_actions:
        action_taken = "NONE"

    cursor = conn.cursor()
    ip = get_client_ip(request)
    ua = request.META.get("HTTP_USER_AGENT", "")

    cursor.execute("""
        INSERT INTO login_history
        (user_id, user_type, ip_address, user_agent, login_status, risk_score, risk_level, action_taken)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        str(user_id) if user_id else None,
        user_type,
        ip,
        ua,
        login_status,
        int(risk_score),
        risk_level,
        action_taken
    ))

    conn.commit()


# ================= FRAUD SCORE ✅✅✅ ADDED =================
def upsert_fraud_score(conn, entity_type, entity_id, score, risk_level):
    """
    ✅ Inserts/Updates fraud score for user/ip safely
    ✅ Fixes error: name 'upsert_fraud_score' is not defined
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id FROM fraud_scores
        WHERE entity_type=%s AND entity_id=%s
        LIMIT 1
    """, (entity_type, str(entity_id)))

    row = cursor.fetchone()

    if row:
        cursor.execute("""
            UPDATE fraud_scores
            SET score=%s,
                risk_level=%s,
                last_updated=NOW()
            WHERE entity_type=%s AND entity_id=%s
        """, (int(score), risk_level, entity_type, str(entity_id)))
    else:
        cursor.execute("""
            INSERT INTO fraud_scores (entity_type, entity_id, score, risk_level)
            VALUES (%s,%s,%s,%s)
        """, (entity_type, str(entity_id), int(score), risk_level))

    conn.commit()


# ================= FRAUD EVENTS =================
def insert_fraud_event(conn, user_id, user_type, ip, event_type,
                       rule_triggered, severity, description, action_taken):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO fraud_events
            (user_id, user_type, ip_address, event_type, rule_triggered,
             severity, description, action_taken)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            str(user_id) if user_id else None,
            user_type,
            ip,
            event_type,
            rule_triggered,
            severity,
            description,
            action_taken
        ))
        conn.commit()
    except Exception as e:
        print(f"Error inserting fraud event: {e}")
    finally:
        cursor.close()


# ================= BLOCKED ENTITIES =================
def block_entity(conn, entity_type, entity_id, reason, minutes=10):
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id FROM blocked_entities
        WHERE entity_type=%s AND entity_id=%s
        LIMIT 1
    """, (entity_type, str(entity_id)))

    existing = cursor.fetchone()

    if existing:
        cursor.execute("""
            UPDATE blocked_entities
            SET reason=%s,
                blocked_by='system',
                blocked_at=NOW(),
                expires_at=DATE_ADD(NOW(), INTERVAL %s MINUTE),
                is_active=1
            WHERE entity_type=%s AND entity_id=%s
        """, (reason, minutes, entity_type, str(entity_id)))
    else:
        cursor.execute("""
            INSERT INTO blocked_entities
            (entity_type, entity_id, reason, blocked_by, expires_at, is_active)
            VALUES (%s,%s,%s,'system', DATE_ADD(NOW(), INTERVAL %s MINUTE), 1)
        """, (entity_type, str(entity_id), reason, minutes))

    conn.commit()


def is_entity_blocked(conn, entity_type, entity_id):
    """
    ✅ Checks if user is blocked and still active
    ✅ Auto-deactivates expired blocks
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, expires_at, is_active
        FROM blocked_entities
        WHERE entity_type=%s AND entity_id=%s AND is_active=1
        ORDER BY id DESC
        LIMIT 1
    """, (entity_type, str(entity_id)))

    row = cursor.fetchone()
    if not row:
        return False

    block_id, expires_at, is_active = row

    # Permanent block
    if expires_at is None:
        return True

    # Expired -> deactivate
    if expires_at < datetime.now():
        cursor.execute("""
            UPDATE blocked_entities
            SET is_active=0
            WHERE id=%s
        """, (block_id,))
        conn.commit()
        return False

    return True


# ================= LOCKOUT =================
def get_lockout_status(conn, user_id, user_type):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT failed_attempts, is_locked, lockout_until
            FROM account_lockout
            WHERE user_id=%s AND user_type=%s
            ORDER BY id DESC LIMIT 1
        """, (str(user_id), user_type))

        row = cursor.fetchone()
        if not row:
            return {"failed_attempts": 0, "is_locked": 0, "lockout_until": None}

        return {
            "failed_attempts": int(row[0] or 0),
            "is_locked": int(row[1] or 0),
            "lockout_until": row[2]
        }
    finally:
        cursor.close()


def increase_failed_attempt(conn, user_id, user_type):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT id, failed_attempts FROM account_lockout
            WHERE user_id=%s AND user_type=%s
            ORDER BY id DESC LIMIT 1
        """, (str(user_id), user_type))

        row = cursor.fetchone()
        if row:
            lock_id, failed_attempts = row
            cursor.execute("""
                UPDATE account_lockout
                SET failed_attempts=failed_attempts+1, last_failed_attempt=NOW()
                WHERE id=%s
            """, (lock_id,))
            conn.commit()
            return int(failed_attempts or 0) + 1

        cursor.execute("""
            INSERT INTO account_lockout
            (user_id, user_type, failed_attempts, is_locked)
            VALUES (%s,%s,1,0)
        """, (str(user_id), user_type))
        conn.commit()
        return 1
    finally:
        cursor.close()


def lock_account(conn, user_id, user_type, minutes=10):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE account_lockout
            SET is_locked=1, lockout_until=DATE_ADD(NOW(), INTERVAL %s MINUTE)
            WHERE user_id=%s AND user_type=%s
        """, (minutes, str(user_id), user_type))
        conn.commit()
    finally:
        cursor.close()


def reset_lockout(conn, user_id, user_type):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE account_lockout
            SET failed_attempts=0, is_locked=0, lockout_until=NULL
            WHERE user_id=%s AND user_type=%s
        """, (str(user_id), user_type))
        conn.commit()
    finally:
        cursor.close()


def seconds_remaining(lockout_until):
    if not lockout_until:
        return 0
    return max(0, int((lockout_until - datetime.now()).total_seconds()))


# ================= PASSWORD =================
def bcrypt_check_password(raw_password, stored_hash):
    try:
        if not stored_hash:
            return False

        if isinstance(stored_hash, bytes):
            stored_hash = stored_hash.decode("utf-8", errors="ignore")

        stored_hash = stored_hash.strip()

        if stored_hash.startswith("$2y$"):
            stored_hash = "$2b$" + stored_hash[4:]

        if not stored_hash.startswith("$2a$") and not stored_hash.startswith("$2b$"):
            return False

        return bcrypt.checkpw(raw_password.encode(), stored_hash.encode())

    except Exception:
        return False


# ================= STUDENT LOGIN =================
@csrf_exempt
@require_http_methods(["POST"])
def student_login_with_session(request):
    conn = None
    try:
        data = json.loads(request.body)
        student_id = data.get("studentId")
        password = data.get("password")

        if not student_id or not password:
            return JsonResponse({"success": False, "message": "Student ID and password required"}, status=400)

        conn = get_db_conn()
        cursor = conn.cursor()
        ip = get_client_ip(request)

        cursor.execute("""
            SELECT id, password_hash FROM students WHERE student_id=%s
        """, (student_id,))
        row = cursor.fetchone()

        if not row:
            insert_fraud_event(conn, None, "student", ip,
                               "LOGIN_FAILED", "USER_NOT_FOUND",
                               "Medium", "Invalid student ID", "NONE")

            upsert_fraud_score(conn, "ip", ip, 50, "Medium")
            log_login_attempt(conn, None, "student", "failed", request, 50, "Medium", "NONE")

            return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

        user_id, password_hash = row

        if is_entity_blocked(conn, "user", user_id):
            insert_fraud_event(conn, user_id, "student", ip,
                               "LOGIN_BLOCKED", "USER_BLOCKED",
                               "High", "Blocked student tried login", "BLOCKED")

            log_login_attempt(conn, user_id, "student", "blocked", request, 90, "Critical", "BLOCKED")
            return JsonResponse({"success": False, "message": "Your account is blocked. Contact admin."}, status=403)

        lock_info = get_lockout_status(conn, user_id, "student")
        if lock_info["is_locked"] == 1 and lock_info["lockout_until"]:
            remaining = seconds_remaining(lock_info["lockout_until"])
            if remaining > 0:
                insert_fraud_event(conn, user_id, "student", ip,
                                   "LOGIN_LOCKED", "ACCOUNT_LOCKED",
                                   "High", "Student account locked", "LOCKED")

                log_login_attempt(conn, user_id, "student", "locked", request, 80, "High", "LOCKED")
                return JsonResponse({
                    "success": False,
                    "message": "Account locked. Try later.",
                    "lockout_remaining_seconds": remaining
                }, status=403)

        if not bcrypt_check_password(password, password_hash):
            failed = increase_failed_attempt(conn, user_id, "student")
            attempts_left = max(0, 5 - failed)

            insert_fraud_event(conn, user_id, "student", ip,
                               "LOGIN_FAILED", "WRONG_PASSWORD",
                               "High", "Wrong password", "NONE")

            upsert_fraud_score(conn, "user", user_id, 70, "High")
            upsert_fraud_score(conn, "ip", ip, 60, "High")

            log_login_attempt(conn, user_id, "student", "failed", request, 70, "High", "NONE")

            if failed >= 5:
                lock_account(conn, user_id, "student", minutes=10)
                block_entity(conn, "user", user_id, "Too many failed logins", minutes=10)

                insert_fraud_event(conn, user_id, "student", ip,
                                   "ACCOUNT_LOCKED", "LOCKED_AFTER_5",
                                   "Critical", "Locked after 5 attempts", "BLOCKED")

                log_login_attempt(conn, user_id, "student", "locked", request, 90, "Critical", "LOCKED")

                return JsonResponse({
                    "success": False,
                    "message": "Too many attempts. Account locked for 10 minutes."
                }, status=403)

            return JsonResponse({
                "success": False,
                "message": f"Invalid password. Attempts left: {attempts_left}",
                "attempts_left": attempts_left
            }, status=401)

        # Check password expiry (90-day policy)
        cursor.execute("SELECT created_at FROM students WHERE id = %s", (user_id,))
        created_at_result = cursor.fetchone()
        
        if created_at_result and created_at_result[0]:
            created_at = created_at_result[0]
            from datetime import date
            
            if isinstance(created_at, datetime):
                creation_date = created_at.date()
            else:
                creation_date = created_at
            
            today = date.today()
            days_old = (today - creation_date).days
            
            if days_old >= 270:
                insert_fraud_event(conn, user_id, "student", ip,
                                   "LOGIN_FAILED", "PASSWORD_EXPIRED",
                                   "High", f"Password expired ({days_old} days old)", "BLOCKED")
                
                log_login_attempt(conn, user_id, "student", "failed", request, 80, "High", "BLOCKED")
                
                # Log to auditt_logs table for compliance tracking
                try:
                    import uuid
                    cursor.execute("""
                        INSERT INTO auditt_logs (id, actor_type, actor_id, action, resource, ip_address, compliance_rule_id, result, details, timestamp)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    """, (
                        str(uuid.uuid4()).replace('-', ''),
                        'STUDENT',
                        user_id,
                        'login_attempt_expired_password',
                        f'student:{student_id}',
                        ip,
                        None,
                        'VIOLATION',
                        json.dumps({"password_age_days": days_old, "policy": "270_day_password_expiry"})
                    ))
                    conn.commit()
                    print(f"✅ LOGGED TO AUDITT_LOGS: password expiry violation for user {user_id}")
                except Exception as e:
                    print(f"❌ Failed to log to auditt_logs: {e}")
                
                return JsonResponse({
                    "success": False,
                    "error_code": "PASSWORD_EXPIRED",
                    "message": "Password older than 90 days. Please change your password.",
                    "password_age_days": 90,
                    "require_password_change": True,
                    "user_id": user_id,
                    "user_type": "student"
                }, status=401)

        # ✅ SUCCESS
        reset_lockout(conn, user_id, "student")

        insert_fraud_event(conn, user_id, "student", ip,
                           "LOGIN_SUCCESS", "PASSWORD_OK",
                           "Low", "Login success", "NONE")

        upsert_fraud_score(conn, "user", user_id, 10, "Low")
        upsert_fraud_score(conn, "ip", ip, 10, "Low")

        log_login_attempt(conn, user_id, "student", "success", request, 10, "Low", "ALLOW")

        session, device, is_new = SessionManager.create_session(user_id, "student", request)

        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "session_token": session.session_token,
            "expires_at": session.expires_at.isoformat()
        }, status=200)

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Server error: {str(e)}"}, status=500)

    finally:
        if conn:
            conn.close()


# ================= TEACHER LOGIN =================
@csrf_exempt
@require_http_methods(["POST"])
def teacher_login_with_session(request):
    conn = None
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JsonResponse({"success": False, "message": "Email and password required"}, status=400)

        conn = get_db_conn()
        cursor = conn.cursor()
        ip = get_client_ip(request)

        cursor.execute("""
            SELECT id, password_hash, is_active FROM educators WHERE email=%s
        """, (email,))
        row = cursor.fetchone()

        if not row:
            insert_fraud_event(conn, None, "teacher", ip,
                               "LOGIN_FAILED", "USER_NOT_FOUND",
                               "Medium", "Teacher not found", "NONE")

            upsert_fraud_score(conn, "ip", ip, 50, "Medium")
            log_login_attempt(conn, None, "teacher", "failed", request, 50, "Medium", "NONE")

            return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

        user_id, password_hash, is_active = row

        if is_entity_blocked(conn, "user", user_id):
            insert_fraud_event(conn, user_id, "teacher", ip,
                               "LOGIN_BLOCKED", "USER_BLOCKED",
                               "High", "Blocked teacher tried login", "BLOCKED")

            log_login_attempt(conn, user_id, "teacher", "blocked", request, 90, "Critical", "BLOCKED")
            return JsonResponse({"success": False, "message": "Account blocked. Contact admin."}, status=403)

        if int(is_active or 0) == 0:
            insert_fraud_event(conn, user_id, "teacher", ip,
                               "LOGIN_FAILED", "ACCOUNT_INACTIVE",
                               "Medium", "Inactive teacher tried login", "BLOCKED")

            log_login_attempt(conn, user_id, "teacher", "failed", request, 60, "High", "NONE")
            return JsonResponse({"success": False, "message": "Teacher account inactive. Contact admin."}, status=403)

        lock_info = get_lockout_status(conn, user_id, "teacher")
        if lock_info["is_locked"] == 1 and lock_info["lockout_until"]:
            remaining = seconds_remaining(lock_info["lockout_until"])
            if remaining > 0:
                insert_fraud_event(conn, user_id, "teacher", ip,
                                   "LOGIN_LOCKED", "ACCOUNT_LOCKED",
                                   "High", "Teacher locked", "LOCKED")

                log_login_attempt(conn, user_id, "teacher", "locked", request, 80, "High", "LOCKED")
                return JsonResponse({
                    "success": False,
                    "message": "Account locked. Try later.",
                    "lockout_remaining_seconds": remaining
                }, status=403)

        if not bcrypt_check_password(password, password_hash):
            # Try plain text comparison as fallback
            if password != password_hash:
                failed = increase_failed_attempt(conn, user_id, "teacher")
                attempts_left = max(0, 5 - failed)

                insert_fraud_event(conn, user_id, "teacher", ip,
                                   "LOGIN_FAILED", "WRONG_PASSWORD",
                                   "High", "Wrong teacher password", "NONE")

                upsert_fraud_score(conn, "user", user_id, 70, "High")
                upsert_fraud_score(conn, "ip", ip, 60, "High")

                log_login_attempt(conn, user_id, "teacher", "failed", request, 70, "High", "NONE")

                if failed >= 5:
                    lock_account(conn, user_id, "teacher", minutes=10)
                    block_entity(conn, "user", user_id, "Too many failed teacher logins", minutes=10)

                    insert_fraud_event(conn, user_id, "teacher", ip,
                                       "ACCOUNT_LOCKED", "LOCKED_AFTER_5",
                                       "Critical", "Teacher locked after 5 attempts", "BLOCKED")

                    log_login_attempt(conn, user_id, "teacher", "locked", request, 90, "Critical", "LOCKED")

                    return JsonResponse({
                        "success": False,
                        "message": "Too many attempts. Account locked for 10 minutes."
                    }, status=403)

                return JsonResponse({
                    "success": False,
                    "message": f"Invalid password. Attempts left: {attempts_left}",
                    "attempts_left": attempts_left
                }, status=401)

        reset_lockout(conn, user_id, "teacher")

        insert_fraud_event(conn, user_id, "teacher", ip,
                           "LOGIN_SUCCESS", "PASSWORD_OK",
                           "Low", "Teacher login success", "NONE")

        upsert_fraud_score(conn, "user", user_id, 10, "Low")
        upsert_fraud_score(conn, "ip", ip, 10, "Low")

        log_login_attempt(conn, user_id, "teacher", "success", request, 10, "Low", "ALLOW")

        session, device, is_new = SessionManager.create_session(user_id, "teacher", request)

        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "session_token": session.session_token,
            "expires_at": session.expires_at.isoformat()
        }, status=200)

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Server error: {str(e)}"}, status=500)

    finally:
        if conn:
            conn.close()


# ================= ADMIN LOGIN =================
@csrf_exempt
@require_http_methods(["POST"])
def admin_login_with_session(request):
    conn = None
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        ip = get_client_ip(request)

        if not email or not password:
            return JsonResponse({"success": False, "message": "Email and password required"}, status=400)

        conn = get_db_conn()

        # ✅ Hardcoded Admin Credentials (NO IP BLOCK CHECK)
        if email == "admin@eduyata.com" and password == "admin123":
            user_id = 1

            insert_fraud_event(conn, user_id, "admin", ip,
                               "LOGIN_SUCCESS", "PASSWORD_OK",
                               "Low", "Admin login success", "NONE")

            upsert_fraud_score(conn, "user", user_id, 5, "Low")
            upsert_fraud_score(conn, "ip", ip, 5, "Low")

            log_login_attempt(conn, user_id, "admin", "success", request, 5, "Low", "ALLOW")

            session, device, is_new = SessionManager.create_session(user_id, "admin", request)

            return JsonResponse({
                "success": True,
                "message": "Admin login successful",
                "session_token": session.session_token,
                "expires_at": session.expires_at.isoformat(),
                "data": {
                    "id": 1,
                    "role": "admin",
                    "email": email
                }
            }, status=200)

        insert_fraud_event(conn, None, "admin", ip,
                           "LOGIN_FAILED", "INVALID_ADMIN_CREDENTIALS",
                           "High", "Wrong admin login credentials", "NONE")

        upsert_fraud_score(conn, "ip", ip, 80, "High")
        log_login_attempt(conn, None, "admin", "failed", request, 80, "High", "NONE")

        return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Server error: {str(e)}"}, status=500)

    finally:
        if conn:
            conn.close()

# -*- coding: utf-8 -*-
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import pymysql

def get_db_connection():
    return pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='',
        database='eduyata_db'
    )

@csrf_exempt
@require_http_methods(["GET"])
def get_feature_flags(request):
    """Get all feature flags"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT name, description, is_enabled 
            FROM feature_flags 
            ORDER BY name
        """)
        
        flags = []
        for row in cursor.fetchall():
            name, description, is_enabled = row
            flags.append({
                'name': name,
                'description': description,
                'is_enabled': bool(is_enabled)
            })
        
        return JsonResponse({'success': True, 'flags': flags})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    finally:
        conn.close()

@csrf_exempt
@require_http_methods(["POST"])
def create_feature_flag(request):
    """Create new feature flag"""
    data = json.loads(request.body)
    name = data.get('name')
    description = data.get('description', '')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO feature_flags (name, description, is_enabled)
            VALUES (%s, %s, FALSE)
        """, (name, description))
        conn.commit()
        
        return JsonResponse({'success': True, 'message': 'Feature flag created'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    finally:
        conn.close()

@csrf_exempt
@require_http_methods(["POST"])
def toggle_feature_flag(request):
    """Toggle feature flag on/off"""
    data = json.loads(request.body)
    flag_name = data.get('flag_name')
    enabled = data.get('enabled')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            UPDATE feature_flags 
            SET is_enabled = %s 
            WHERE name = %s
        """, (enabled, flag_name))
        conn.commit()
        
        return JsonResponse({'success': True, 'message': 'Feature flag updated'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    finally:
        conn.close()

@csrf_exempt
@require_http_methods(["GET"])
def get_students(request):
    """Get all students for selection"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT id, student_id, name 
            FROM students 
            ORDER BY name
        """)
        
        students = []
        for row in cursor.fetchall():
            id, student_id, name = row
            students.append({
                'id': student_id,
                'student_id': student_id,
                'name': name
            })
        
        return JsonResponse({'success': True, 'students': students})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    finally:
        conn.close()

@csrf_exempt
@require_http_methods(["POST"])
def assign_feature_to_users(request):
    """Assign feature flag to selected users"""
    data = json.loads(request.body)
    flag_name = data.get('flag_name')
    user_ids = data.get('user_ids', [])
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Don't delete existing assignments, just add new ones
        for user_id in user_ids:
            # Convert student_id to database ID
            cursor.execute("SELECT id FROM students WHERE student_id = %s", (user_id,))
            result = cursor.fetchone()
            if result:
                db_user_id = result[0]
                # Use INSERT IGNORE to avoid duplicates
                cursor.execute("""
                    INSERT IGNORE INTO feature_flag_users (flag_name, user_id, user_type)
                    VALUES (%s, %s, 'student')
                """, (flag_name, db_user_id))
        
        conn.commit()
        return JsonResponse({'success': True, 'message': 'Users assigned to feature'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    finally:
        conn.close()

@csrf_exempt
@require_http_methods(["GET"])
def get_feature_usage(request):
    """Get feature flag usage statistics"""
    flag_name = request.GET.get('flag_name')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT 
                s.id, s.name, s.student_id,
                ffu.assigned_at,
                COALESCE(fl.last_used, NULL) as last_used,
                COALESCE(fl.usage_count, 0) as usage_count
            FROM students s
            LEFT JOIN feature_flag_users ffu ON s.id = ffu.user_id AND ffu.flag_name = %s
            LEFT JOIN (
                SELECT user_id, MAX(used_at) as last_used, COUNT(*) as usage_count
                FROM feature_flag_logs 
                WHERE flag_name = %s 
                GROUP BY user_id
            ) fl ON s.id = fl.user_id
            WHERE ffu.user_id IS NOT NULL
            ORDER BY s.name
        """, (flag_name, flag_name))
        
        usage_data = []
        for row in cursor.fetchall():
            user_id, name, student_id, assigned_at, last_used, usage_count = row
            usage_data.append({
                'user_id': user_id,
                'student_name': f"{name} ({student_id})",
                'assigned': True,
                'assigned_at': str(assigned_at) if assigned_at else None,
                'last_used': str(last_used) if last_used else None,
                'usage_count': usage_count
            })
        
        return JsonResponse({'success': True, 'usage': usage_data})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    finally:
        conn.close()

@csrf_exempt
@require_http_methods(["GET"])
def check_feature_flag(request):
    """Check if user has access to feature flag"""
    flag_name = request.GET.get('flag_name')
    user_id = request.GET.get('user_id')
    user_type = request.GET.get('user_type', 'student')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT is_enabled FROM feature_flags WHERE name = %s", (flag_name,))
        flag_result = cursor.fetchone()
        
        if not flag_result or not flag_result[0]:
            return JsonResponse({'has_access': False})
        
        db_user_id = user_id
        if user_type == 'student' and isinstance(user_id, str) and user_id.startswith('STU'):
            cursor.execute("SELECT id FROM students WHERE student_id = %s", (user_id,))
            student_result = cursor.fetchone()
            if student_result:
                db_user_id = student_result[0]
            else:
                return JsonResponse({'has_access': False})
        
        cursor.execute("""
            SELECT COUNT(*) FROM feature_flag_users 
            WHERE flag_name = %s AND user_id = %s AND user_type = %s
        """, (flag_name, db_user_id, user_type))
        
        has_access = cursor.fetchone()[0] > 0
        
        return JsonResponse({'has_access': has_access})
    except Exception as e:
        return JsonResponse({'has_access': False, 'error': str(e)})
    finally:
        conn.close()

@csrf_exempt
@require_http_methods(["POST"])
def log_feature_usage(request):
    """Log feature flag usage"""
    try:
        data = json.loads(request.body)
        flag_name = data.get('flag_name')
        user_id = data.get('user_id')
        user_type = data.get('user_type', 'student')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        db_user_id = user_id
        if user_type == 'student' and isinstance(user_id, str) and user_id.startswith('STU'):
            cursor.execute("SELECT id FROM students WHERE student_id = %s", (user_id,))
            student_result = cursor.fetchone()
            if student_result:
                db_user_id = student_result[0]
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feature_flag_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                flag_name VARCHAR(100) NOT NULL,
                user_id INT NOT NULL,
                user_type ENUM('student', 'teacher', 'admin') DEFAULT 'student',
                used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                KEY idx_flag_user (flag_name, user_id),
                KEY idx_used_at (used_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        
        cursor.execute("""
            INSERT INTO feature_flag_logs (flag_name, user_id, user_type, used_at)
            VALUES (%s, %s, %s, NOW())
        """, (flag_name, db_user_id, user_type))
        
        conn.commit()
        conn.close()
        
        return JsonResponse({'success': True, 'message': 'Usage logged'})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
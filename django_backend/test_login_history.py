#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eduyata_backend.settings')
django.setup()

import pymysql
from datetime import datetime

def get_db_conn():
    return pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='eduyata_db',
        cursorclass=pymysql.cursors.Cursor,
        autocommit=False
    )

def test_login_history_insert():
    conn = None
    try:
        conn = get_db_conn()
        cursor = conn.cursor()
        
        # Test insert
        cursor.execute("""
            INSERT INTO login_history
            (user_id, user_type, ip_address, user_agent, login_status, risk_score, risk_level, action_taken)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            "999",
            "admin",
            "127.0.0.1",
            "Test User Agent",
            "success",
            10,
            "Low",
            "NONE"
        ))
        
        conn.commit()
        print("✅ Login history insert successful!")
        
        # Verify insert
        cursor.execute("SELECT * FROM login_history WHERE user_id='999' ORDER BY id DESC LIMIT 1")
        result = cursor.fetchone()
        if result:
            print(f"✅ Record found: ID={result[0]}, User={result[1]}, Status={result[5]}")
        else:
            print("❌ No record found after insert")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    test_login_history_insert()
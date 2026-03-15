#!/usr/bin/env python
"""
Create tenant_configs table manually
"""
import pymysql

def create_tenant_configs_table():
    try:
        conn = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='eduyata_db'
        )
        cursor = conn.cursor()
        
        # Create tenant_configs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tenant_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id VARCHAR(50) NOT NULL,
                product_id VARCHAR(50) NULL,
                `key` VARCHAR(100) NOT NULL,
                value TEXT NOT NULL,
                value_type VARCHAR(20) DEFAULT 'string',
                category VARCHAR(50) DEFAULT 'general',
                description TEXT,
                is_sensitive BOOLEAN DEFAULT FALSE,
                updated_by INT NULL,
                updated_by_name VARCHAR(255),
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_tenant_product_key (tenant_id, product_id, `key`),
                INDEX idx_tenant (tenant_id),
                INDEX idx_key (`key`)
            )
        """)
        
        print("Created tenant_configs table")
        
        # Test insert
        cursor.execute("""
            INSERT INTO tenant_configs 
            (tenant_id, `key`, value, value_type, category, description, is_sensitive, updated_by_name, updated_at, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """, ('st-marys', 'test_config', 'test_value', 'string', 'general', 'Test config', 0, 'Admin'))
        
        conn.commit()
        print("Test record inserted")
        
        # Verify
        cursor.execute("SELECT * FROM tenant_configs WHERE tenant_id = %s", ('st-marys',))
        results = cursor.fetchall()
        print(f"Found {len(results)} records")
        for row in results:
            print(row)
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_tenant_configs_table()
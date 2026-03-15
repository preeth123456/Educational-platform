import pymysql

try:
    conn = pymysql.connect(host='localhost', user='root', password='', database='eduyata_db')
    cursor = conn.cursor()
    
    print("Creating incident response tables...")
    
    # Create SecurityIncident table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS incident_response_securityincident (
            id INT PRIMARY KEY AUTO_INCREMENT,
            incident_type VARCHAR(100) NOT NULL,
            severity VARCHAR(20) NOT NULL,
            status VARCHAR(20) DEFAULT 'open',
            user_id INT NOT NULL,
            user_type VARCHAR(20) NOT NULL,
            description TEXT NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            metadata JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP NULL
        )
    ''')
    
    # Create LoginAttempt table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS incident_response_loginattempt (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id VARCHAR(50) NOT NULL,
            user_type VARCHAR(20) NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            success BOOLEAN NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create AccountLock table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS incident_response_accountlock (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id VARCHAR(50) NOT NULL,
            user_type VARCHAR(20) NOT NULL,
            locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            unlock_at TIMESTAMP NULL,
            reason VARCHAR(200) NOT NULL
        )
    ''')
    
    conn.commit()
    print("Incident response tables created successfully!")
    
    # Check tables
    cursor.execute('SHOW TABLES LIKE "incident_response_%"')
    tables = cursor.fetchall()
    print(f"Tables created: {[t[0] for t in tables]}")
    
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
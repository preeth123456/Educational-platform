import os
import re
import glob

def find_tables_without_primary_keys():
    """Find all tables that don't have primary keys"""
    
    base_path = "django_backend"
    apps = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d)) and not d.startswith('__')]
    
    tables_without_pk = []
    all_tables = []
    
    for app in apps:
        migrations_path = os.path.join(base_path, app, "migrations")
        if not os.path.exists(migrations_path):
            continue
            
        migration_files = glob.glob(os.path.join(migrations_path, "*.py"))
        migration_files = [f for f in migration_files if not f.endswith("__init__.py")]
        
        for migration_file in migration_files:
            with open(migration_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Find CreateModel operations
            create_model_pattern = r'migrations\.CreateModel\(\s*name=[\'"](\w+)[\'"],(.*?)options=\{(.*?)\}'
            matches = re.findall(create_model_pattern, content, re.DOTALL)
            
            for model_name, fields_section, options_section in matches:
                # Extract db_table name
                db_table_match = re.search(r'[\'"]db_table[\'"]:\s*[\'"](\w+)[\'"]', options_section)
                table_name = db_table_match.group(1) if db_table_match else f"{app}_{model_name.lower()}"
                
                all_tables.append((table_name, app, model_name))
                
                # Check for primary key fields
                has_pk = False
                
                # Look for explicit primary key
                if re.search(r'primary_key=True', fields_section):
                    has_pk = True
                
                # Check for proxy models (they don't create tables)
                if "'proxy': True" in options_section:
                    continue
                
                if not has_pk:
                    tables_without_pk.append((table_name, app, model_name))
    
    # Check SQL files for additional tables
    sql_files = glob.glob("*.sql") + glob.glob("database/*.sql")
    
    for sql_file in sql_files:
        if os.path.exists(sql_file):
            with open(sql_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            create_table_pattern = r'CREATE TABLE\s+(?:`)?(\w+)(?:`)?\s*\((.*?)\);'
            matches = re.findall(create_table_pattern, content, re.DOTALL | re.IGNORECASE)
            
            for table_name, table_def in matches:
                all_tables.append((table_name, 'SQL', table_name))
                
                has_pk = 'PRIMARY KEY' in table_def.upper()
                
                if not has_pk:
                    tables_without_pk.append((table_name, 'SQL', table_name))
    
    print(f"TOTAL TABLES: {len(all_tables)}")
    print(f"TABLES WITHOUT PRIMARY KEY: {len(tables_without_pk)}")
    
    if tables_without_pk:
        print(f"\nTABLES MISSING PRIMARY KEYS:")
        for table, app, model in tables_without_pk:
            print(f"  - {table} (from {app}.{model})")
    else:
        print(f"\nAll tables have primary keys!")

if __name__ == "__main__":
    find_tables_without_primary_keys()
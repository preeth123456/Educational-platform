import os
import re
import glob

def analyze_migrations():
    """Analyze all Django migrations for auto-increment and primary key issues"""
    
    base_path = "django_backend"
    apps = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d)) and not d.startswith('__')]
    
    all_models = {}
    tables_without_pk = []
    tables_without_auto_increment = []
    
    print("=== ANALYZING ALL DJANGO MIGRATIONS ===\n")
    
    for app in apps:
        migrations_path = os.path.join(base_path, app, "migrations")
        if not os.path.exists(migrations_path):
            continue
            
        print(f"Checking app: {app}")
        
        # Get all migration files
        migration_files = glob.glob(os.path.join(migrations_path, "*.py"))
        migration_files = [f for f in migration_files if not f.endswith("__init__.py")]
        migration_files.sort()
        
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
                
                # Check for primary key fields
                has_explicit_pk = False
                has_auto_increment = False
                
                # Look for explicit primary key
                pk_pattern = r'\([\'"](\w+)[\'"],\s*models\.\w+.*?primary_key=True'
                pk_matches = re.findall(pk_pattern, fields_section)
                
                if pk_matches:
                    has_explicit_pk = True
                    # Check if it's auto-increment type
                    for pk_field in pk_matches:
                        if re.search(rf'\([\'"{pk_field}[\'"],\s*models\.(BigAuto|Auto)Field', fields_section):
                            has_auto_increment = True
                
                # Check for default Django id field (BigAutoField)
                if re.search(r'models\.(BigAuto|Auto)Field.*?primary_key=True', fields_section):
                    has_auto_increment = True
                    has_explicit_pk = True
                
                all_models[table_name] = {
                    'app': app,
                    'model': model_name,
                    'has_pk': has_explicit_pk,
                    'has_auto_increment': has_auto_increment
                }
                
                if not has_explicit_pk:
                    tables_without_pk.append((table_name, app, model_name))
                elif not has_auto_increment:
                    tables_without_auto_increment.append((table_name, app, model_name))
    
    # Also check for manual table creation in SQL files
    sql_files = glob.glob("*.sql") + glob.glob("database/*.sql")
    
    print(f"\nChecking SQL files for additional tables...")
    
    for sql_file in sql_files:
        if os.path.exists(sql_file):
            with open(sql_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Find CREATE TABLE statements
            create_table_pattern = r'CREATE TABLE\s+(?:`)?(\w+)(?:`)?\s*\((.*?)\);'
            matches = re.findall(create_table_pattern, content, re.DOTALL | re.IGNORECASE)
            
            for table_name, table_def in matches:
                if table_name not in all_models:
                    has_pk = 'PRIMARY KEY' in table_def.upper()
                    has_auto_inc = 'AUTO_INCREMENT' in table_def.upper()
                    
                    all_models[table_name] = {
                        'app': 'SQL',
                        'model': table_name,
                        'has_pk': has_pk,
                        'has_auto_increment': has_auto_inc
                    }
                    
                    if not has_pk:
                        tables_without_pk.append((table_name, 'SQL', table_name))
                    elif not has_auto_inc:
                        # Check if it has integer primary key that should be auto-increment
                        if re.search(r'(\w+)\s+(INT|BIGINT|SMALLINT|TINYINT).*?PRIMARY KEY', table_def, re.IGNORECASE):
                            tables_without_auto_increment.append((table_name, 'SQL', table_name))
    
    # Print results
    print(f"\n=== ANALYSIS RESULTS ===")
    print(f"Total tables found: {len(all_models)}")
    print(f"Tables without primary key: {len(tables_without_pk)}")
    print(f"Tables without auto-increment: {len(tables_without_auto_increment)}")
    
    print(f"\n=== ALL TABLES STATUS ===")
    for table_name, info in sorted(all_models.items()):
        pk_status = "PK" if info['has_pk'] else "NO-PK"
        ai_status = "AI" if info['has_auto_increment'] else "NO-AI"
        print(f"  {table_name:<30} [{pk_status}] [{ai_status}] ({info['app']}.{info['model']})")
    
    if tables_without_pk:
        print(f"\nTABLES WITHOUT PRIMARY KEY:")
        for table, app, model in tables_without_pk:
            print(f"  - {table} (from {app}.{model})")
    
    if tables_without_auto_increment:
        print(f"\nTABLES NEEDING AUTO_INCREMENT:")
        for table, app, model in tables_without_auto_increment:
            print(f"  - {table} (from {app}.{model})")
    
    if not tables_without_pk and not tables_without_auto_increment:
        print(f"\nAll tables have proper primary keys with auto-increment!")
    
    # Generate SQL fixes
    if tables_without_pk or tables_without_auto_increment:
        print(f"\n=== SQL FIXES ===")
        
        for table, app, model in tables_without_pk:
            print(f"-- Add primary key to {table}")
            print(f"ALTER TABLE `{table}` ADD COLUMN `id` BIGINT AUTO_INCREMENT PRIMARY KEY FIRST;")
        
        for table, app, model in tables_without_auto_increment:
            print(f"-- Add auto-increment to {table}")
            print(f"ALTER TABLE `{table}` MODIFY `id` BIGINT AUTO_INCREMENT;")
    
    return all_models

if __name__ == "__main__":
    analyze_migrations()
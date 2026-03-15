-- Fix datetime fields that are stored as strings
-- This script converts string datetime values to proper DATETIME format

-- First, let's check the current data types and values
SELECT 
    product_id, 
    name, 
    created_at, 
    updated_at,
    TYPEOF(created_at) as created_at_type,
    TYPEOF(updated_at) as updated_at_type
FROM products 
LIMIT 5;

-- Update products table - convert string datetimes to proper format
UPDATE products 
SET 
    created_at = CASE 
        WHEN created_at REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN STR_TO_DATE(created_at, '%Y-%m-%d %H:%i:%s')
        ELSE NOW()
    END,
    updated_at = CASE 
        WHEN updated_at REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN STR_TO_DATE(updated_at, '%Y-%m-%d %H:%i:%s')
        ELSE NOW()
    END
WHERE 
    created_at IS NOT NULL 
    OR updated_at IS NOT NULL;

-- Update tenants table - convert string datetimes to proper format
UPDATE tenants 
SET 
    created_at = CASE 
        WHEN created_at REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN STR_TO_DATE(created_at, '%Y-%m-%d %H:%i:%s')
        ELSE NOW()
    END,
    updated_at = CASE 
        WHEN updated_at REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN STR_TO_DATE(updated_at, '%Y-%m-%d %H:%i:%s')
        ELSE NOW()
    END
WHERE 
    created_at IS NOT NULL 
    OR updated_at IS NOT NULL;

-- Verify the fix
SELECT 
    product_id, 
    name, 
    created_at, 
    updated_at
FROM products;

SELECT 
    tenant_id, 
    name, 
    created_at, 
    updated_at
FROM tenants;
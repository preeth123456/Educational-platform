"""
Configuration Resolution Utilities
Feature 2: Product & Tenant Configuration Management
"""

from .models import PlatformConfig, ProductConfig, TenantConfig, Product, Tenant


def resolve_config(key, tenant_id=None, product_id=None):
    """
    Resolve configuration value with hierarchy:
    Tenant Config > Product Config > Global Config
    
    Args:
        key: Configuration key to resolve
        tenant_id: Optional tenant ID
        product_id: Optional product ID
    
    Returns:
        Resolved configuration value or None
    """
    # 1. Check tenant-specific config first (highest priority)
    if tenant_id:
        tenant_config = TenantConfig.objects.filter(
            tenant_id=tenant_id, 
            key=key
        ).first()
        if tenant_config:
            return tenant_config.get_typed_value()
    
    # 2. Check product-specific config (medium priority)
    if product_id:
        product_config = ProductConfig.objects.filter(
            product_id=product_id, 
            key=key
        ).first()
        if product_config:
            return product_config.get_typed_value()
    
    # 3. Fall back to global config (lowest priority)
    global_config = PlatformConfig.objects.filter(key=key).first()
    if global_config:
        return global_config.get_typed_value()
    
    return None


def get_all_configs_for_tenant(tenant_id, product_id=None):
    """
    Get all resolved configurations for a tenant
    
    Args:
        tenant_id: Tenant ID
        product_id: Optional product ID
    
    Returns:
        Dictionary of resolved configurations
    """
    configs = {}
    
    # Start with global configs
    for config in PlatformConfig.objects.all():
        configs[config.key] = {
            'value': config.get_typed_value(),
            'source': 'global',
            'category': config.category
        }
    
    # Override with product configs
    if product_id:
        for config in ProductConfig.objects.filter(product_id=product_id):
            configs[config.key] = {
                'value': config.get_typed_value(),
                'source': f'product:{product_id}',
                'category': config.category
            }
    
    # Override with tenant configs
    for config in TenantConfig.objects.filter(tenant_id=tenant_id):
        configs[config.key] = {
            'value': config.get_typed_value(),
            'source': f'tenant:{tenant_id}',
            'category': config.category
        }
    
    return configs


def get_config_hierarchy(key, tenant_id=None, product_id=None):
    """
    Get configuration hierarchy for debugging/admin view
    
    Returns:
        List of configuration sources and values
    """
    hierarchy = []
    
    # Global config
    global_config = PlatformConfig.objects.filter(key=key).first()
    if global_config:
        hierarchy.append({
            'level': 'global',
            'value': global_config.get_typed_value(),
            'raw_value': global_config.value,
            'source': 'Platform Default'
        })
    
    # Product config
    if product_id:
        product_config = ProductConfig.objects.filter(
            product_id=product_id, key=key
        ).first()
        if product_config:
            hierarchy.append({
                'level': 'product',
                'value': product_config.get_typed_value(),
                'raw_value': product_config.value,
                'source': f'Product: {product_config.product.name}'
            })
    
    # Tenant config
    if tenant_id:
        tenant_config = TenantConfig.objects.filter(
            tenant_id=tenant_id, key=key
        ).first()
        if tenant_config:
            hierarchy.append({
                'level': 'tenant',
                'value': tenant_config.get_typed_value(),
                'raw_value': tenant_config.value,
                'source': f'Tenant: {tenant_config.tenant.name}'
            })
    
    # Add final resolved value
    final_value = resolve_config(key, tenant_id, product_id)
    if hierarchy:
        hierarchy.append({
            'level': 'resolved',
            'value': final_value,
            'raw_value': str(final_value),
            'source': 'Final Resolved Value'
        })
    
    return hierarchy
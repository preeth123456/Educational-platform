from django.urls import path
from . import views
from .simple_save import simple_save_config

urlpatterns = [
    # Public endpoint (no auth required) - for frontend to load favicon, site name, etc.
    path('public/', views.public_configs, name='config-public'),
    
    # Configuration resolution (public endpoint)
    path('resolve/', views.resolve_configuration, name='config-resolve'),
    
    # Tenant config save (must be before generic patterns)
    path('tenants/save-configs/', simple_save_config, name='save-tenant-configs'),
    
    # ============================================================================
    # PRODUCT MANAGEMENT URLS (MUST BE BEFORE GENERIC CONFIG PATTERNS)
    # ============================================================================
    
    # Product CRUD
    path('products/', views.list_products, name='product-list'),
    path('products/create/', views.create_product, name='product-create'),
    path('products/save-configs/', views.save_product_config, name='save-product-configs'),
    path('products/<str:product_id>/', views.get_product, name='product-detail'),
    path('products/<str:product_id>/update/', views.update_product, name='product-update'),
    
    # ============================================================================
    # TENANT MANAGEMENT URLS (MUST BE BEFORE GENERIC CONFIG PATTERNS)
    # ============================================================================
    
    # Tenant CRUD
    path('tenants/', views.list_tenants, name='tenant-list'),
    path('tenants/create/', views.create_tenant, name='tenant-create'),
    path('tenants/<str:tenant_id>/', views.get_tenant, name='tenant-detail'),
    path('tenants/<str:tenant_id>/update/', views.update_tenant, name='tenant-update'),
    
    # ============================================================================
    # CONFIGURATION MANAGEMENT URLS (GENERIC PATTERNS MUST BE LAST)
    # ============================================================================
    
    # List all configs / Create new config
    path('', views.list_configs, name='config-list'),
    path('create/', views.create_config, name='config-create'),
    
    # Categories
    path('categories/', views.list_categories, name='config-categories'),
    
    # Bulk operations
    path('bulk/', views.bulk_update_configs, name='config-bulk-update'),
    
    # Change logs / Audit trail
    path('logs/', views.get_change_logs, name='config-logs'),
    
    # Configuration hierarchy
    path('hierarchy/', views.get_config_hierarchy_view, name='config-hierarchy'),
    
    # Single config operations (CRUD) - MUST BE LAST DUE TO CATCH-ALL PATTERN
    path('<str:key>/', views.get_config, name='config-detail'),
    path('<str:key>/update/', views.update_config, name='config-update'),
    path('<str:key>/delete/', views.delete_config, name='config-delete'),
]

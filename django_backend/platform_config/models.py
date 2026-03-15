from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


class PlatformConfig(models.Model):
    """
    Platform Configuration Model
    Stores key-value pairs for platform-wide settings
    Feature 13: Platform Configuration APIs
    """
    
    VALUE_TYPES = [
        ('string', 'String'),
        ('integer', 'Integer'),
        ('boolean', 'Boolean'),
        ('json', 'JSON'),
        ('float', 'Float'),
    ]
    
    CATEGORIES = [
        ('general', 'General Settings'),
        ('email', 'Email Configuration'),
        ('storage', 'Storage Settings'),
        ('security', 'Security Settings'),
        ('api', 'API Settings'),
        ('notification', 'Notification Settings'),
        ('appearance', 'Appearance Settings'),
        ('integration', 'Integration Settings'),
    ]
    
    key = models.CharField(max_length=100, unique=True, db_index=True)
    value = models.TextField()
    value_type = models.CharField(max_length=20, choices=VALUE_TYPES, default='string')
    category = models.CharField(max_length=50, choices=CATEGORIES, default='general')
    description = models.TextField(blank=True, help_text='Description of this configuration')
    is_sensitive = models.BooleanField(default=False, help_text='If true, value will be masked in API responses')
    is_editable = models.BooleanField(default=True, help_text='If false, cannot be modified via API')
    updated_by = models.IntegerField(null=True, blank=True)
    updated_by_name = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'platform_configs'
        verbose_name = 'Platform Configuration'
        verbose_name_plural = 'Platform Configurations'
        ordering = ['category', 'key']
    
    def __str__(self):
        return f"{self.category}/{self.key}"
    
    def get_typed_value(self):
        """Return value converted to its proper type"""
        if self.value_type == 'integer':
            return int(self.value)
        elif self.value_type == 'boolean':
            return self.value.lower() in ('true', '1', 'yes')
        elif self.value_type == 'float':
            return float(self.value)
        elif self.value_type == 'json':
            import json
            return json.loads(self.value)
        return self.value
    
    def set_typed_value(self, value):
        """Set value with proper type conversion"""
        if self.value_type == 'boolean':
            self.value = 'true' if value else 'false'
        elif self.value_type == 'json':
            import json
            self.value = json.dumps(value)
        else:
            self.value = str(value)


class Product(models.Model):
    """
    Educational products like CBSE, ICSE, State Board
    Feature 2: Product & Tenant Configuration Management
    """
    product_id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    board_type = models.CharField(max_length=50, help_text='Links to existing boards (CBSE, ICSE, etc.)')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.product_id})"


class Tenant(models.Model):
    """
    Organizations/Schools using the platform
    Feature 2: Product & Tenant Configuration Management
    """
    tenant_id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    domain = models.CharField(max_length=100, unique=True, help_text='Subdomain for this tenant')
    contact_email = models.EmailField()
    subscription_type = models.CharField(max_length=50, default='basic')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tenants'
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.tenant_id})"


class ProductConfig(models.Model):
    """
    Product-level configurations
    Feature 2: Product & Tenant Configuration Management
    """
    VALUE_TYPES = [
        ('string', 'String'),
        ('integer', 'Integer'),
        ('boolean', 'Boolean'),
        ('json', 'JSON'),
        ('float', 'Float'),
    ]
    
    CATEGORIES = [
        ('general', 'General Settings'),
        ('appearance', 'Appearance Settings'),
        ('features', 'Feature Toggles'),
        ('grading', 'Grading System'),
        ('content', 'Content Settings'),
        ('integration', 'Integration Settings'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='configs')
    key = models.CharField(max_length=100, db_index=True)
    value = models.TextField()
    value_type = models.CharField(max_length=20, choices=VALUE_TYPES, default='string')
    category = models.CharField(max_length=50, choices=CATEGORIES, default='general')
    description = models.TextField(blank=True)
    is_sensitive = models.BooleanField(default=False)
    updated_by = models.IntegerField(null=True, blank=True)
    updated_by_name = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'product_configs'
        verbose_name = 'Product Configuration'
        verbose_name_plural = 'Product Configurations'
        unique_together = ['product', 'key']
        ordering = ['product', 'category', 'key']
    
    def __str__(self):
        return f"{self.product.name}/{self.key}"
    
    def get_typed_value(self):
        """Return value converted to its proper type"""
        if self.value_type == 'integer':
            return int(self.value)
        elif self.value_type == 'boolean':
            return self.value.lower() in ('true', '1', 'yes')
        elif self.value_type == 'float':
            return float(self.value)
        elif self.value_type == 'json':
            import json
            return json.loads(self.value)
        return self.value


class TenantConfig(models.Model):
    """
    Tenant-level configurations (overrides product configs)
    Feature 2: Product & Tenant Configuration Management
    """
    VALUE_TYPES = [
        ('string', 'String'),
        ('integer', 'Integer'),
        ('boolean', 'Boolean'),
        ('json', 'JSON'),
        ('float', 'Float'),
    ]
    
    CATEGORIES = [
        ('general', 'General Settings'),
        ('appearance', 'Appearance Settings'),
        ('features', 'Feature Toggles'),
        ('grading', 'Grading System'),
        ('content', 'Content Settings'),
        ('integration', 'Integration Settings'),
    ]
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='configs')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, help_text='Optional: Product-specific tenant config')
    key = models.CharField(max_length=100, db_index=True)
    value = models.TextField()
    value_type = models.CharField(max_length=20, choices=VALUE_TYPES, default='string')
    category = models.CharField(max_length=50, choices=CATEGORIES, default='general')
    description = models.TextField(blank=True)
    is_sensitive = models.BooleanField(default=False)
    updated_by = models.IntegerField(null=True, blank=True)
    updated_by_name = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tenant_configs'
        verbose_name = 'Tenant Configuration'
        verbose_name_plural = 'Tenant Configurations'
        unique_together = ['tenant', 'product', 'key']
        ordering = ['tenant', 'category', 'key']
    
    def __str__(self):
        product_part = f"/{self.product.name}" if self.product else ""
        return f"{self.tenant.name}{product_part}/{self.key}"
    
    def get_typed_value(self):
        """Return value converted to its proper type"""
        if self.value_type == 'integer':
            return int(self.value)
        elif self.value_type == 'boolean':
            return self.value.lower() in ('true', '1', 'yes')
        elif self.value_type == 'float':
            return float(self.value)
        elif self.value_type == 'json':
            import json
            return json.loads(self.value)
        return self.value


class ConfigChangeLog(models.Model):
    """
    Audit log for configuration changes
    Tracks who changed what and when
    """
    config_key = models.CharField(max_length=100, db_index=True)
    old_value = models.TextField(blank=True)
    new_value = models.TextField()
    changed_by = models.IntegerField()
    changed_by_name = models.CharField(max_length=255)
    changed_by_role = models.CharField(max_length=50)
    ip_address = models.CharField(max_length=45, blank=True)
    user_agent = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'config_change_logs'
        verbose_name = 'Configuration Change Log'
        verbose_name_plural = 'Configuration Change Logs'
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.config_key} changed by {self.changed_by_name} at {self.changed_at}"

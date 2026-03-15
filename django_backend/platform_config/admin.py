from django.contrib import admin
from .models import PlatformConfig, ConfigChangeLog


@admin.register(PlatformConfig)
class PlatformConfigAdmin(admin.ModelAdmin):
    list_display = ['key', 'category', 'value_type', 'is_sensitive', 'is_editable', 'updated_at']
    list_filter = ['category', 'value_type', 'is_sensitive', 'is_editable']
    search_fields = ['key', 'description']
    ordering = ['category', 'key']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ConfigChangeLog)
class ConfigChangeLogAdmin(admin.ModelAdmin):
    list_display = ['config_key', 'changed_by_name', 'changed_by_role', 'changed_at']
    list_filter = ['changed_by_role', 'changed_at']
    search_fields = ['config_key', 'changed_by_name']
    ordering = ['-changed_at']
    readonly_fields = ['config_key', 'old_value', 'new_value', 'changed_by', 
                       'changed_by_name', 'changed_by_role', 'ip_address', 'changed_at']

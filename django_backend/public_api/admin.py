from django.contrib import admin
from .models import APIKey


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ['name', 'key_value', 'user', 'is_active', 'rate_limit_per_hour', 'request_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'key_value', 'user__username']
    readonly_fields = ['key_value', 'created_at', 'last_used_at', 'request_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'user', 'key_value', 'is_active')
        }),
        ('Rate Limiting', {
            'fields': ('rate_limit_per_hour', 'request_count', 'last_used_at')
        }),
        ('Security', {
            'fields': ('allowed_ips',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

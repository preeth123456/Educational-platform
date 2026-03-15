"""
Django Admin Configuration for Webhook System - Phase 6

Connections:
- Phase 2: Registers WebhookEndpoint model for admin interface
- Phase 3: Provides test webhook functionality via admin actions
- Feature 1 & 2: Uses same admin interface pattern
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import WebhookEndpoint
from .services import webhook_service


@admin.register(WebhookEndpoint)
class WebhookEndpointAdmin(admin.ModelAdmin):
    """
    Admin interface for managing webhook endpoints
    
    Features:
    - List view with key fields
    - Search and filter capabilities
    - Test webhook action
    - Read-only fields for audit trail
    """
    
    list_display = ['name', 'url_display', 'event_types_display', 'is_active_display', 'created_by', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'url', 'event_types']
    readonly_fields = ['created_at']
    actions = ['test_webhooks', 'activate_webhooks', 'deactivate_webhooks']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'url', 'is_active')
        }),
        ('Event Configuration', {
            'fields': ('event_types',),
            'description': 'Comma-separated event types (leave empty to subscribe to all events)'
        }),
        ('Audit Information', {
            'fields': ('created_by', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def url_display(self, obj):
        """Display truncated URL"""
        return obj.url[:50] + '...' if len(obj.url) > 50 else obj.url
    url_display.short_description = 'URL'
    
    def event_types_display(self, obj):
        """Display event types or 'All Events'"""
        return obj.event_types if obj.event_types else 'All Events'
    event_types_display.short_description = 'Event Types'
    
    def is_active_display(self, obj):
        """Display active status with color"""
        if obj.is_active:
            return format_html('<span style="color: green;">●</span> Active')
        return format_html('<span style="color: red;">●</span> Inactive')
    is_active_display.short_description = 'Status'
    
    def test_webhooks(self, request, queryset):
        """Admin action to test selected webhooks"""
        success_count = 0
        for endpoint in queryset:
            result = webhook_service.test_webhook(endpoint)
            if result['success']:
                success_count += 1
        
        self.message_user(request, f'Tested {queryset.count()} webhooks. {success_count} successful.')
    test_webhooks.short_description = 'Test selected webhooks'
    
    def activate_webhooks(self, request, queryset):
        """Admin action to activate selected webhooks"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} webhooks activated.')
    activate_webhooks.short_description = 'Activate selected webhooks'
    
    def deactivate_webhooks(self, request, queryset):
        """Admin action to deactivate selected webhooks"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} webhooks deactivated.')
    deactivate_webhooks.short_description = 'Deactivate selected webhooks'
    
    def save_model(self, request, obj, form, change):
        """Auto-set created_by to current user"""
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

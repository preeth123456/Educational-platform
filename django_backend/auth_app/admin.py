# SECURITY CONFIG POLICIES FILE - Admin interface for security policies
from django.contrib import admin
from .models import StudentConsent, ConsentHistory
from .lockout_models import AccountLockout, LoginHistory, BlockedEntity, FraudEvent, FraudScore
from session_management.models import SessionPolicy

@admin.register(StudentConsent)
class StudentConsentAdmin(admin.ModelAdmin):
    list_display = ['id', 'consent_type', 'is_granted', 'updated_at']
    list_filter = ['consent_type', 'is_granted']

@admin.register(ConsentHistory)
class ConsentHistoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'consent_type', 'action', 'timestamp']
    list_filter = ['consent_type', 'action']

@admin.register(AccountLockout)
class AccountLockoutAdmin(admin.ModelAdmin):
    list_display = ['username', 'user_type', 'failed_attempts', 'is_locked', 'lockout_until', 'last_failed_at']
    list_filter = ['user_type', 'is_locked']
    search_fields = ['username']
    actions = ['unlock_selected_accounts']
    
    def unlock_selected_accounts(self, request, queryset):
        """Admin action to unlock selected accounts"""
        count = 0
        for lockout in queryset:
            if lockout.is_locked:
                lockout.unlock()
                count += 1
        self.message_user(request, f'{count} accounts unlocked successfully.')
    unlock_selected_accounts.short_description = "Unlock selected accounts"

@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = ['username', 'user_type', 'status', 'ip_address', 'timestamp']
    list_filter = ['user_type', 'status', 'timestamp']
    search_fields = ['username', 'ip_address']
    readonly_fields = ['timestamp']

@admin.register(BlockedEntity)
class BlockedEntityAdmin(admin.ModelAdmin):
    list_display = ['entity_type', 'entity_value', 'reason', 'is_permanent', 'blocked_until', 'created_at']
    list_filter = ['entity_type', 'is_permanent']
    search_fields = ['entity_value']

@admin.register(FraudEvent)
class FraudEventAdmin(admin.ModelAdmin):
    list_display = ['event_type', 'severity', 'user_id', 'ip_address', 'resolved', 'timestamp']
    list_filter = ['event_type', 'severity', 'resolved']
    search_fields = ['ip_address']
    actions = ['mark_as_resolved']
    
    def mark_as_resolved(self, request, queryset):
        """Admin action to mark fraud events as resolved"""
        count = queryset.update(resolved=True)
        self.message_user(request, f'{count} fraud events marked as resolved.')
    mark_as_resolved.short_description = "Mark selected events as resolved"

@admin.register(FraudScore)
class FraudScoreAdmin(admin.ModelAdmin):
    list_display = ['entity_type', 'entity_id', 'score', 'last_updated']
    list_filter = ['entity_type']
    search_fields = ['entity_id']

@admin.register(SessionPolicy)
class SecurityPolicyAdmin(admin.ModelAdmin):
    list_display = ['policy_name', 'max_concurrent_sessions', 'session_timeout_minutes', 'max_devices_per_user', 'require_device_approval', 'auto_logout_inactive']
    list_filter = ['require_device_approval', 'auto_logout_inactive']
    search_fields = ['policy_name']
    
    class Meta:
        verbose_name = "Security Policy"
        verbose_name_plural = "Security Policies"
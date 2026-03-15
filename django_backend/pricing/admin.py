from django.contrib import admin
from .models import Product, PricingPlan, UserSubscription

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'product_type', 'audience_role', 'is_active', 'created_at']
    list_filter = ['product_type', 'audience_role', 'is_active']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'billing_cycle', 'price', 'currency', 'is_default', 'is_recommended', 'is_active']
    list_filter = ['billing_cycle', 'currency', 'is_default', 'is_recommended', 'is_active']
    search_fields = ['name', 'product__name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'user_type', 'plan', 'status', 'start_date', 'end_date']
    list_filter = ['user_type', 'status', 'plan__product']
    search_fields = ['user_id', 'plan__name']
    readonly_fields = ['created_at', 'updated_at']
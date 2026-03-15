from rest_framework import serializers
from .models import PlatformConfig, ConfigChangeLog, Product, Tenant, ProductConfig, TenantConfig
from django.utils.dateparse import parse_datetime
from django.utils import timezone
import datetime


class PlatformConfigSerializer(serializers.ModelSerializer):
    """Serializer for PlatformConfig model"""
    
    typed_value = serializers.SerializerMethodField()
    display_value = serializers.SerializerMethodField()
    
    class Meta:
        model = PlatformConfig
        fields = [
            'id', 'key', 'value', 'typed_value', 'display_value',
            'value_type', 'category', 'description',
            'is_sensitive', 'is_editable',
            'updated_by', 'updated_by_name', 'updated_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'updated_by', 'updated_by_name']
    
    def get_typed_value(self, obj):
        """Return properly typed value"""
        try:
            return obj.get_typed_value()
        except:
            return obj.value
    
    def get_display_value(self, obj):
        """Return display value, masking sensitive data"""
        if obj.is_sensitive:
            return '********'
        return obj.value


class PlatformConfigUpdateSerializer(serializers.Serializer):
    """Serializer for updating configuration values"""
    
    value = serializers.CharField(required=True)
    
    def validate_value(self, value):
        """Validate value based on config type"""
        config = self.context.get('config')
        if config:
            if config.value_type == 'integer':
                try:
                    int(value)
                except ValueError:
                    raise serializers.ValidationError("Value must be a valid integer")
            elif config.value_type == 'boolean':
                if value.lower() not in ('true', 'false', '1', '0', 'yes', 'no'):
                    raise serializers.ValidationError("Value must be a boolean (true/false)")
            elif config.value_type == 'float':
                try:
                    float(value)
                except ValueError:
                    raise serializers.ValidationError("Value must be a valid number")
            elif config.value_type == 'json':
                import json
                try:
                    json.loads(value)
                except json.JSONDecodeError:
                    raise serializers.ValidationError("Value must be valid JSON")
        return value


class BulkConfigUpdateSerializer(serializers.Serializer):
    """Serializer for bulk configuration updates"""
    
    configs = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        min_length=1
    )
    
    def validate_configs(self, configs):
        """Validate each config in the list"""
        for config in configs:
            if 'key' not in config or 'value' not in config:
                raise serializers.ValidationError(
                    "Each config must have 'key' and 'value' fields"
                )
        return configs


class ConfigChangeLogSerializer(serializers.ModelSerializer):
    """Serializer for ConfigChangeLog model"""
    
    class Meta:
        model = ConfigChangeLog
        fields = [
            'id', 'config_key', 'old_value', 'new_value',
            'changed_by', 'changed_by_name', 'changed_by_role',
            'ip_address', 'changed_at'
        ]
        read_only_fields = fields


class ConfigCategorySerializer(serializers.Serializer):
    """Serializer for configuration categories"""
    
    category = serializers.CharField()
    display_name = serializers.CharField()
    count = serializers.IntegerField()


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'description', 'board_type', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_created_at(self, obj):
        """Handle datetime fields that might be stored as strings"""
        try:
            if isinstance(obj.created_at, str):
                # Try to parse string datetime
                dt = parse_datetime(obj.created_at)
                if dt:
                    return dt.isoformat()
                return obj.created_at
            elif hasattr(obj.created_at, 'isoformat'):
                return obj.created_at.isoformat()
            else:
                return str(obj.created_at)
        except:
            return str(obj.created_at) if obj.created_at else None
    
    def get_updated_at(self, obj):
        """Handle datetime fields that might be stored as strings"""
        try:
            if isinstance(obj.updated_at, str):
                # Try to parse string datetime
                dt = parse_datetime(obj.updated_at)
                if dt:
                    return dt.isoformat()
                return obj.updated_at
            elif hasattr(obj.updated_at, 'isoformat'):
                return obj.updated_at.isoformat()
            else:
                return str(obj.updated_at)
        except:
            return str(obj.updated_at) if obj.updated_at else None


class TenantSerializer(serializers.ModelSerializer):
    """Serializer for Tenant model"""
    
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    
    class Meta:
        model = Tenant
        fields = ['tenant_id', 'name', 'domain', 'contact_email', 'subscription_type', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_created_at(self, obj):
        """Handle datetime fields that might be stored as strings"""
        try:
            if isinstance(obj.created_at, str):
                dt = parse_datetime(obj.created_at)
                if dt:
                    return dt.isoformat()
                return obj.created_at
            elif hasattr(obj.created_at, 'isoformat'):
                return obj.created_at.isoformat()
            else:
                return str(obj.created_at)
        except:
            return str(obj.created_at) if obj.created_at else None
    
    def get_updated_at(self, obj):
        """Handle datetime fields that might be stored as strings"""
        try:
            if isinstance(obj.updated_at, str):
                dt = parse_datetime(obj.updated_at)
                if dt:
                    return dt.isoformat()
                return obj.updated_at
            elif hasattr(obj.updated_at, 'isoformat'):
                return obj.updated_at.isoformat()
            else:
                return str(obj.updated_at)
        except:
            return str(obj.updated_at) if obj.updated_at else None


class ProductConfigSerializer(serializers.ModelSerializer):
    """Serializer for ProductConfig model"""
    
    typed_value = serializers.SerializerMethodField()
    display_value = serializers.SerializerMethodField()
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = ProductConfig
        fields = [
            'id', 'product', 'product_name', 'key', 'value', 'typed_value', 'display_value',
            'value_type', 'category', 'description', 'is_sensitive',
            'updated_by', 'updated_by_name', 'updated_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'updated_by', 'updated_by_name']
    
    def get_typed_value(self, obj):
        try:
            return obj.get_typed_value()
        except:
            return obj.value
    
    def get_display_value(self, obj):
        if obj.is_sensitive:
            return '********'
        return obj.value


class TenantConfigSerializer(serializers.ModelSerializer):
    """Serializer for TenantConfig model"""
    
    typed_value = serializers.SerializerMethodField()
    display_value = serializers.SerializerMethodField()
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = TenantConfig
        fields = [
            'id', 'tenant', 'tenant_name', 'product', 'product_name', 'key', 'value', 
            'typed_value', 'display_value', 'value_type', 'category', 'description', 'is_sensitive',
            'updated_by', 'updated_by_name', 'updated_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'updated_by', 'updated_by_name']
    
    def get_typed_value(self, obj):
        try:
            return obj.get_typed_value()
        except:
            return obj.value
    
    def get_display_value(self, obj):
        if obj.is_sensitive:
            return '********'
        return obj.value


class ConfigHierarchySerializer(serializers.Serializer):
    """Serializer for configuration hierarchy view"""
    
    level = serializers.CharField()
    value = serializers.JSONField()
    raw_value = serializers.CharField()
    source = serializers.CharField()

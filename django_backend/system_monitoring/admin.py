from django.contrib import admin
from .models import SystemMetric

@admin.register(SystemMetric)
class SystemMetricAdmin(admin.ModelAdmin):
    list_display = ['metric_type', 'value', 'unit', 'server_name', 'timestamp']
    list_filter = ['metric_type', 'server_name', 'timestamp']
    search_fields = ['metric_type', 'server_name']
    ordering = ['-timestamp']
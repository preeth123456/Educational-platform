# SECURITY CONFIG POLICIES FILE - Compliance rules and security models
from django.db import models

class ComplianceRule(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_compliancerule'

class ComplianceLog(models.Model):
    rule = models.ForeignKey(ComplianceRule, on_delete=models.CASCADE)
    user_id = models.IntegerField()
    user_type = models.CharField(max_length=50)
    action = models.CharField(max_length=200)
    ip_address = models.GenericIPAddressField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'compliance_compliancelog'
from django.urls import path
from . import enhanced_audit_views

urlpatterns = [
    # Forensic timeline and investigation
    path('forensic/timeline/', enhanced_audit_views.forensic_timeline, name='forensic_timeline'),
    path('forensic/integrity-check/', enhanced_audit_views.audit_integrity_check, name='audit_integrity_check'),
    
    # Compliance reports
    path('reports/data-access/', enhanced_audit_views.data_access_report, name='data_access_report'),
    path('reports/admin-actions/', enhanced_audit_views.admin_actions_report, name='admin_actions_report'),
    path('reports/policy-changes/', enhanced_audit_views.policy_changes_report, name='policy_changes_report'),
    path('reports/data-exports/', enhanced_audit_views.data_exports_report, name='data_exports_report'),
    path('reports/incident-response/', enhanced_audit_views.incident_response_report, name='incident_response_report'),
    
    # Dashboard statistics
    path('dashboard/stats/', enhanced_audit_views.audit_dashboard_stats, name='audit_dashboard_stats'),
]
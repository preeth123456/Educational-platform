# SECURITY CONFIG POLICIES FILE - URL routing for security rules
from django.urls import path
from . import views

urlpatterns = [
    path('rules/', views.compliance_rules),
    path('rules-raw/', views.compliance_rules_raw),
    path('log/', views.log_compliance),
    path('incidents/', views.compliance_incidents),
    path('evidence/', views.audit_evidence),
    path('check/', views.check_compliance),
    path('report/', views.compliance_report),
]
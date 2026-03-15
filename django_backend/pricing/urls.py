from django.urls import path
from . import views

urlpatterns = [
    # Admin Product endpoints
    path('api/admin/products/', views.ProductListView.as_view(), name='admin_products'),
    path('api/admin/products/<int:product_id>/', views.ProductDetailView.as_view(), name='admin_product_detail'),
    path('api/admin/products/<int:product_id>/status/', views.toggle_product_status, name='toggle_product_status'),
    
    # Admin Pricing Plan endpoints
    path('api/admin/pricing-plans/', views.PricingPlanListView.as_view(), name='admin_pricing_plans'),
    path('api/admin/pricing-plans/<int:plan_id>/', views.PricingPlanDetailView.as_view(), name='admin_pricing_plan_detail'),
    path('api/admin/pricing-plans/<int:plan_id>/status/', views.toggle_plan_status, name='toggle_plan_status'),
    path('api/admin/pricing-plans/<int:plan_id>/set-default/', views.set_default_plan, name='set_default_plan'),
    
    # Student endpoints
    path('api/student/pricing-plans/', views.student_pricing_plans, name='student_pricing_plans'),
    path('api/student/my-subscription/', views.student_subscription, name='student_subscription'),
    path('api/student/upgrade-plan/', views.upgrade_plan, name='upgrade_plan'),
]
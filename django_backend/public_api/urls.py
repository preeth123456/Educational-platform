from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, CourseViewSet, TeacherViewSet, ClassroomViewSet, DeveloperGuideView, APIKeyWhoAmIView
from .admin_views import APIKeyManagementViewSet, PublicAPIMonitoringViewSet
from .devtools import DevToolsViewSet, PublicDownloadViewSet # Feature 9

# ========== FEATURE 1 ROUTER ==========
router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='students')
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'teachers', TeacherViewSet, basename='teachers')
router.register(r'classrooms', ClassroomViewSet, basename='classrooms')
router.register(r'devtools', DevToolsViewSet, basename='devtools') # Feature 9

# ========== FEATURE 2 ADMIN ROUTER (PHASE 4) ==========
admin_router = DefaultRouter()
admin_router.register(r'api-keys', APIKeyManagementViewSet, basename='api-keys')
admin_router.register(r'monitoring', PublicAPIMonitoringViewSet, basename='api-monitoring')
urlpatterns = [
    # Feature 9: Secure Public Download (Token Based) - MOVED TO TOP
    re_path(r'^api/v1/public/download-kit/(?P<token>.+)/$', PublicDownloadViewSet.as_view({'get': 'get_kit'}), name='public-download'),
    
    path('api/v1/developer-guide/', DeveloperGuideView.as_view(), name='developer-guide'),
    path('api/v1/auth/whoami/', APIKeyWhoAmIView.as_view(), name='api-whoami'),
    path('api/v1/', include(router.urls)),  # Feature 1 public endpoints
    path('admin/api/', include(admin_router.urls)),  # Feature 2 admin endpoints
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConnectorViewSet, SyncJobViewSet, ConnectorConfigViewSet

router = DefaultRouter()
# Since ConnectorViewSet is a ViewSet but not ModelViewSet default actions might differ, 
# but we used @action mostly. We can bind manually or use router if we set base_name.
router.register(r'sync-jobs', SyncJobViewSet, basename='sync-jobs')
router.register(r'connectors', ConnectorViewSet, basename='connectors')
router.register(r'connector-config', ConnectorConfigViewSet, basename='connector-config')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]

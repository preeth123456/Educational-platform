# INCIDENT DETECTION FILE - Incident handling logic and API endpoints
from rest_framework import viewsets
from .models import SecurityIncident, LoginAttempt, AccountLock
from .serializers import SecurityIncidentSerializer, LoginAttemptSerializer, AccountLockSerializer

class SecurityIncidentViewSet(viewsets.ModelViewSet):
    queryset = SecurityIncident.objects.all()
    serializer_class = SecurityIncidentSerializer

class LoginAttemptViewSet(viewsets.ModelViewSet):
    queryset = LoginAttempt.objects.all()
    serializer_class = LoginAttemptSerializer

class AccountLockViewSet(viewsets.ModelViewSet):
    queryset = AccountLock.objects.all()
    serializer_class = AccountLockSerializer

# INCIDENT DETECTION FILE - Data serialization for API responses
from rest_framework import serializers
from .models import SecurityIncident, LoginAttempt, AccountLock

class SecurityIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityIncident
        fields = '__all__'

class LoginAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginAttempt
        fields = '__all__'

class AccountLockSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountLock
        fields = '__all__'

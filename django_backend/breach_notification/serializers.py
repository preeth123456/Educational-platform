# BREACH NOTIFICATION FILE - This file defines breach notification serializers

from rest_framework import serializers
from .models import BreachReport, BreachNotification

class BreachReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = BreachReport
        fields = '__all__'

class BreachNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BreachNotification
        fields = '__all__'

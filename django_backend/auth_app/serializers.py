from rest_framework import serializers
from .models import Educator

class EducatorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Educator
        fields = [
            'name', 'email', 'mobile', 'password', 'subject', 'qualification',
            'date_of_birth', 'gender', 'highest_qualification',
            'experience_years', 'bio', 'boards', 'subject_classes',
            'languages_known', 'teaching_experience_institutes'
        ]
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        educator = Educator(**validated_data)
        educator.set_password(password)
        # Ensure teacher requires admin approval
        educator.is_active = False
        educator.document_status = 'Pending Verification'
        # Encrypt sensitive data before saving
        educator.encrypt_sensitive_data()
        educator.save()
        return educator
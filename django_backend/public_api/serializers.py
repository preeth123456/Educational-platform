from rest_framework import serializers
from auth_app.models import Student, Educator
from courses.models import Course
from virtual_classrooms.models import VirtualClassroom
from .models import APIKey


# ========== FEATURE 1 SERIALIZERS ==========

class PublicStudentSerializer(serializers.ModelSerializer):
    """Serializer for public student data"""
    class Meta:
        model = Student
        fields = ['student_id', 'name', 'class_level', 'board', 'created_at']


class PublicCourseSerializer(serializers.ModelSerializer):
    """Serializer for public course data"""
    class Meta:
        model = Course
        fields = ['course_id', 'title', 'description', 'category', 'level', 
                  'duration_hours', 'price', 'thumbnail_url', 'created_at']


class PublicTeacherSerializer(serializers.ModelSerializer):
    """Serializer for public teacher/educator data"""
    class Meta:
        model = Educator
        fields = ['teacher_id', 'name', 'subject', 'qualification', 
                  'experience_years', 'is_active', 'created_at']


class PublicClassroomSerializer(serializers.ModelSerializer):
    """Serializer for public virtual classroom data"""
    class Meta:
        model = VirtualClassroom
        fields = ['classroom_id', 'title', 'description', 'classroom_code',
                  'max_students', 'is_active', 'created_at']


# ========== FEATURE 2 SERIALIZER (PHASE 4) ==========

class APIKeySerializer(serializers.ModelSerializer):
    """Serializer for API Key management"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = APIKey
        fields = [
            'id', 'key_value', 'name', 'user', 'user_name',
            'is_active', 'created_at',
            'rate_limit_per_hour', 'allowed_ips', 'allowed_endpoints',
            'last_used_at', 'request_count'
        ]
        read_only_fields = ['id', 'key_value', 'created_at', 'last_used_at', 'request_count', 'user_name', 'user']

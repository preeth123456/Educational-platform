from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
from .services.developer_kit_generator import get_developer_guide_html
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from .authentication import APIKeyAuthentication
from .serializers import (
    PublicStudentSerializer,
    PublicCourseSerializer,
    PublicTeacherSerializer,
    PublicClassroomSerializer
)
from auth_app.models import Student, Educator
from courses.models import Course
from virtual_classrooms.models import VirtualClassroom


# ========== PAGINATION ==========
class StandardPagination(PageNumberPagination):
    """
    Standard pagination for Public API.
    - Default: 20 records per page
    - Max: 100 records per page
    - Use ?page=2&page_size=50 to customize
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class HasEndpointPermission(permissions.BasePermission):
    """
    Feature 9.1: Check if API key has access to this specific endpoint.
    The endpoint name is derived from the view's basename.
    """
    def has_permission(self, request, view):
        # request.auth contains the APIKey object (set by APIKeyAuthentication)
        api_key = request.auth
        if not api_key:
            return False
        
        # Get the endpoint name from the view's basename
        endpoint_name = getattr(view, 'basename', '')
        
        # If allowed_endpoints is empty/null, allow all
        if not api_key.allowed_endpoints:
            return True
        
        # Parse allowed endpoints
        allowed = [e.strip().lower() for e in api_key.allowed_endpoints.split(',')]
        
        if endpoint_name.lower() not in allowed:
            raise PermissionDenied(
                f"Your API key does not have access to the '{endpoint_name}' endpoint. "
                f"Allowed endpoints: {', '.join(allowed)}"
            )
        
        return True


class PublicAPIViewSet(viewsets.ReadOnlyModelViewSet):
    """Base viewset for all public API endpoints with pagination"""
    authentication_classes = [APIKeyAuthentication]
    permission_classes = [permissions.IsAuthenticated, HasEndpointPermission]
    pagination_class = StandardPagination


class StudentViewSet(PublicAPIViewSet):
    """
    API endpoint for students
    GET /api/v1/students/ - List all students (paginated)
    GET /api/v1/students/{student_id}/ - Get student details
    
    Filters:
    - ?class_level=10
    - ?board=CBSE
    - ?page=2&page_size=50
    """
    queryset = Student.objects.all()
    serializer_class = PublicStudentSerializer
    lookup_field = 'student_id'
    
    def get_queryset(self):
        queryset = Student.objects.all()
        
        # Manual filtering
        class_level = self.request.query_params.get('class_level')
        board = self.request.query_params.get('board')
        
        if class_level:
            queryset = queryset.filter(class_level=class_level)
        if board:
            queryset = queryset.filter(board=board)
        
        return queryset


class CourseViewSet(PublicAPIViewSet):
    """
    API endpoint for courses
    GET /api/v1/courses/ - List all published courses (paginated)
    GET /api/v1/courses/{course_id}/ - Get course details
    
    Filters:
    - ?category=Mathematics
    - ?level=Beginner
    - ?page=2&page_size=50
    """
    queryset = Course.objects.all()
    serializer_class = PublicCourseSerializer
    lookup_field = 'course_id'
    
    def get_queryset(self):
        queryset = Course.objects.all()
        
        # Manual filtering
        category = self.request.query_params.get('category')
        level = self.request.query_params.get('level')
        
        if category:
            queryset = queryset.filter(category__icontains=category)
        if level:
            queryset = queryset.filter(level=level)
        
        return queryset


class TeacherViewSet(PublicAPIViewSet):
    """
    API endpoint for teachers/educators
    GET /api/v1/teachers/ - List all active teachers (paginated)
    GET /api/v1/teachers/{teacher_id}/ - Get teacher details
    
    Filters:
    - ?subject=Physics
    - ?is_active=true
    - ?page=2&page_size=50
    """
    queryset = Educator.objects.filter(is_active=True)
    serializer_class = PublicTeacherSerializer
    lookup_field = 'teacher_id'
    
    def get_queryset(self):
        queryset = Educator.objects.filter(is_active=True)
        
        # Manual filtering
        subject = self.request.query_params.get('subject')
        is_active = self.request.query_params.get('is_active')
        
        if subject:
            queryset = queryset.filter(subject__icontains=subject)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class ClassroomViewSet(PublicAPIViewSet):
    """
    API endpoint for virtual classrooms
    GET /api/v1/classrooms/ - List all active classrooms (paginated)
    GET /api/v1/classrooms/{classroom_id}/ - Get classroom details
    
    Filters:
    - ?is_active=true
    - ?page=2&page_size=50
    """
    queryset = VirtualClassroom.objects.filter(is_active=True)
    serializer_class = PublicClassroomSerializer
    lookup_field = 'classroom_id'
    
    def get_queryset(self):
        queryset = VirtualClassroom.objects.all()
        
        # Manual filtering
        is_active = self.request.query_params.get('is_active')
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        else:
            # Default to active classrooms
            queryset = queryset.filter(is_active=True)
        
        return queryset.order_by('classroom_id')


class DeveloperGuideView(APIView):
    """
    Serves the Developer Guide HTML directly.
    """
    permission_classes = [AllowAny]
    authentication_classes = [] 

    def get(self, request):
        html_content = get_developer_guide_html()
        return HttpResponse(html_content, content_type='text/html')


class APIKeyWhoAmIView(APIView):
    """
    Feature 9: Validation endpoint for the Developer Kit.
    Returns the permissions assigned to the API Key.
    """
    authentication_classes = [APIKeyAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        api_key = request.auth
        return Response({
            "status": "valid",
            "name": api_key.name,
            "allowed_endpoints": [e.strip().lower() for e in api_key.allowed_endpoints.split(',')] if api_key.allowed_endpoints else []
        })

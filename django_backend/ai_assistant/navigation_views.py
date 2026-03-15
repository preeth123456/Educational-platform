from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import re
from auth_app.models import Student, Enrollment
from courses.models import Course

@csrf_exempt
@require_http_methods(["POST"])
def process_navigation_command(request):
    try:
        data = json.loads(request.body)
        command = data.get('command', '').lower().strip()
        user_id = data.get('user_id')
        user_role = data.get('user_role', 'student')
        is_quick_command = data.get('is_quick_command', False)
        
        # Parse the command and determine navigation action
        navigation_result = parse_navigation_command(command, user_id, user_role, is_quick_command)
        
        return JsonResponse({
            'success': True,
            'action': navigation_result['action'],
            'route': navigation_result['route'],
            'message': navigation_result['message'],
            'suggestions': navigation_result.get('suggestions', [])
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': "I didn't understand that command. Try saying something like 'Show my courses' or 'Go to assignments'"
        }, status=400)

def parse_navigation_command(command, user_id, user_role, is_quick_command=False):
    """Parse natural language commands and return navigation actions"""
    
    # Specific course continuation commands
    if 'continue' in command:
        if 'advanced calculus' in command or 'calculus' in command or 'applications' in command:
            return {
                'action': 'navigate',
                'route': '/course/1/learn',
                'message': 'Continuing Advanced Calculus & Applications!'
            }
        elif 'artificial intelligence' in command or 'ai' in command or 'introduction to artificial intelligence' in command:
            return {
                'action': 'navigate',
                'route': '/course/5/learn',
                'message': 'Continuing Introduction to Artificial Intelligence!'
            }
        elif 'web development' in command or 'bootcamp' in command or 'web development bootcamp' in command:
            return {
                'action': 'navigate',
                'route': '/course/2/learn',
                'message': 'Continuing Web Development Bootcamp!'
            }
    
    # Direct course name matching for quick commands
    course_mappings = {
        'advanced calculus & applications': '/course/1/learn',
        'introduction to artificial intelligence': '/course/5/learn', 
        'web development bootcamp': '/course/2/learn'
    }
    
    for course_name, route in course_mappings.items():
        if course_name in command:
            return {
                'action': 'navigate',
                'route': route,
                'message': f'Opening {course_name.title()}!'
            }
    
    # Course-related commands
    if any(word in command for word in ['course', 'subject', 'class']):
        action_type = 'navigate' if is_quick_command else 'suggest'
        if 'math' in command or 'mathematics' in command:
            return {
                'action': action_type,
                'route': '/courses' if is_quick_command else None,
                'message': 'Opening Mathematics courses for you!' if is_quick_command else 'I can take you to Mathematics courses',
                'suggestions': [] if is_quick_command else ['Go to Math courses', 'Show all courses']
            }
        elif 'physics' in command:
            return {
                'action': action_type,
                'route': '/courses' if is_quick_command else None,
                'message': 'Taking you to Physics courses!' if is_quick_command else 'I can take you to Physics courses',
                'suggestions': [] if is_quick_command else ['Go to Physics courses', 'Show all courses']
            }
        elif 'chemistry' in command:
            return {
                'action': action_type,
                'route': '/courses' if is_quick_command else None,
                'message': 'Opening Chemistry courses!' if is_quick_command else 'I can take you to Chemistry courses',
                'suggestions': [] if is_quick_command else ['Go to Chemistry courses', 'Show all courses']
            }
        elif any(word in command for word in ['my', 'all', 'show']):
            return {
                'action': action_type,
                'route': '/courses' if is_quick_command else None,
                'message': 'Here are all your courses!' if is_quick_command else 'I can show you all your courses',
                'suggestions': [] if is_quick_command else ['Go to my courses', 'Show course list']
            }
    
    # Assignment/homework commands
    if any(word in command for word in ['assignment', 'homework', 'task']):
        action_type = 'navigate' if is_quick_command else 'suggest'
        return {
            'action': action_type,
            'route': '/assignments' if is_quick_command else None,
            'message': 'Showing your assignments and tasks!' if is_quick_command else 'I can show you your assignments',
            'suggestions': [] if is_quick_command else ['Go to assignments', 'Show pending tasks']
        }
    
    # Quiz/test commands
    if any(word in command for word in ['quiz', 'test', 'exam', 'assessment']):
        if 'battle' in command:
            return {
                'action': 'navigate',
                'route': '/math-maze',
                'message': 'Let\'s start Math Maze! 🎯'
            }
        return {
            'action': 'navigate',
            'route': '/performance',
            'message': 'Opening your performance and tests!'
        }
    
    # Progress/performance commands
    if any(word in command for word in ['progress', 'performance', 'score', 'grade']):
        action_type = 'navigate' if is_quick_command else 'suggest'
        return {
            'action': action_type,
            'route': '/performance' if is_quick_command else None,
            'message': 'Here\'s your learning progress!' if is_quick_command else 'I can show you your progress',
            'suggestions': [] if is_quick_command else ['View my progress', 'Check performance']
        }
    
    # Dashboard/home commands
    if any(word in command for word in ['dashboard', 'home', 'main']):
        action_type = 'navigate' if is_quick_command else 'suggest'
        return {
            'action': action_type,
            'route': '/dashboard' if is_quick_command else None,
            'message': 'Taking you to your dashboard!' if is_quick_command else 'I can take you to your dashboard',
            'suggestions': [] if is_quick_command else ['Go to dashboard', 'Go home']
        }
    
    # Profile/settings commands
    if any(word in command for word in ['profile', 'settings', 'account']):
        return {
            'action': 'navigate',
            'route': '/settings',
            'message': 'Opening your profile settings!'
        }
    
    # Games commands
    if any(word in command for word in ['game', 'play', 'fun']):
        if 'fraction' in command:
            if 'chef' in command:
                return {
                    'action': 'navigate',
                    'route': '/fraction-chef',
                    'message': 'Starting Fraction Chef game! 👨‍🍳'
                }
            elif 'balloon' in command:
                return {
                    'action': 'navigate',
                    'route': '/fraction-balloon',
                    'message': 'Starting Fraction Balloon Pop! 🎈'
                }
        elif 'maze' in command or 'math' in command:
            return {
                'action': 'navigate',
                'route': '/math-maze',
                'message': 'Starting Math Maze Adventure! 🧩'
            }
        return {
            'action': 'navigate',
            'route': '/math-maze',
            'message': 'Let\'s play some educational games! 🎮'
        }
    
    # Default fallback - different behavior for quick commands vs text input
    if is_quick_command:
        # Quick commands should navigate even if not perfectly matched
        return {
            'action': 'navigate',
            'route': '/dashboard',
            'message': 'Taking you to dashboard!'
        }
    else:
        # Text input should provide suggestions and links
        return {
            'action': 'suggest',
            'route': None,
            'message': 'I can help you navigate! Here are some options:',
            'suggestions': [
                'Show my courses',
                'Go to assignments', 
                'Play Math Maze',
                'Check my progress',
                'Take me to dashboard'
            ]
        }

@csrf_exempt
@require_http_methods(["POST"])
def get_personalized_suggestions(request):
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        
        suggestions = []
        
        if user_id:
            try:
                # Import here to avoid circular imports
                from auth_app.models import Student, Enrollment
                
                student = Student.objects.get(id=user_id)
                enrollments = Enrollment.objects.filter(student=student)
                
                # Get incomplete courses
                for enrollment in enrollments[:3]:
                    suggestions.append({
                        'text': f'Continue {enrollment.course.title}',
                        'command': f'open {enrollment.course.title.lower()} course',
                        'type': 'course'
                    })
                
                # Add general suggestions
                suggestions.extend([
                    {
                        'text': 'Check assignments',
                        'command': 'show my assignments',
                        'type': 'task'
                    },
                    {
                        'text': 'Start Quiz Battle',
                        'command': 'open quiz battle',
                        'type': 'game'
                    }
                ])
                
            except (Student.DoesNotExist, Exception):
                # If student not found or any other error, use default suggestions
                pass
        
        # Default suggestions if no user data or error occurred
        if not suggestions:
            suggestions = [
                {'text': 'Show my courses', 'command': 'show my courses', 'type': 'course'},
                {'text': 'Go to assignments', 'command': 'go to assignments', 'type': 'task'},
                {'text': 'Check progress', 'command': 'show my progress', 'type': 'progress'},
                {'text': 'Play Math Maze', 'command': 'play math maze', 'type': 'game'},
                {'text': 'Study tips', 'command': 'study tips', 'type': 'guidance'},
                {'text': 'Time management', 'command': 'time management', 'type': 'guidance'}
            ]
        
        return JsonResponse({
            'success': True,
            'suggestions': suggestions
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data',
            'suggestions': [
                {'text': 'Show my courses', 'command': 'show my courses', 'type': 'course'},
                {'text': 'Go to assignments', 'command': 'go to assignments', 'type': 'task'},
                {'text': 'Check progress', 'command': 'show my progress', 'type': 'progress'}
            ]
        }, status=200)  # Return 200 with default suggestions instead of 500
    except Exception as e:
        # Return default suggestions instead of error to prevent frontend crash
        return JsonResponse({
            'success': True,
            'suggestions': [
                {'text': 'Show my courses', 'command': 'show my courses', 'type': 'course'},
                {'text': 'Go to assignments', 'command': 'go to assignments', 'type': 'task'},
                {'text': 'Check progress', 'command': 'show my progress', 'type': 'progress'},
                {'text': 'Play Math Maze', 'command': 'play math maze', 'type': 'game'},
                {'text': 'Study tips', 'command': 'study tips', 'type': 'guidance'}
            ]
        })
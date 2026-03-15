from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import requests

def get_ai_response(prompt, max_tokens=500):
    # Dialogflow ES API
    try:
        project_id = "your-project-id"  # Replace with your project ID
        session_id = "default-session"
        
        response = requests.post(
            f"https://dialogflow.googleapis.com/v2/projects/{project_id}/agent/sessions/{session_id}:detectIntent",
            headers={
                "Authorization": "Bearer your-dialogflow-token",  # Replace with your token
                "Content-Type": "application/json"
            },
            json={
                "queryInput": {
                    "text": {
                        "text": prompt,
                        "languageCode": "en"
                    }
                }
            },
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['queryResult']['fulfillmentText']
        else:
            return f"Dialogflow Error: {response.status_code}"
            
    except Exception as e:
        return f"Dialogflow failed: {str(e)}"

@csrf_exempt
@require_http_methods(["POST"])
def summarize_content(request):
    try:
        data = json.loads(request.body)
        topic = data.get('topic', 'Unknown Topic')
        content = data.get('content', '')
        
        prompt = f"""Summarize this educational content about {topic}:

{content}

Provide a structured summary with:
- Key concepts
- Main takeaways
- Important points to remember

Format with emojis and bullet points for student readability."""
        
        summary = get_ai_response(prompt)
        
        return JsonResponse({
            'success': True,
            'summary': summary
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def explain_topic(request):
    try:
        data = json.loads(request.body)
        topic = data.get('topic', 'this topic')
        difficulty = data.get('difficulty', 'intermediate')
        
        prompt = f"""Explain {topic} for a {difficulty} level student.

Provide:
1. Simple definition
2. Key components
3. Real-world analogy
4. Practical example
5. Common misconceptions

Use emojis and clear formatting. Make it engaging and easy to understand."""
        
        explanation = get_ai_response(prompt)
        
        return JsonResponse({
            'success': True,
            'explanation': explanation
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def generate_questions(request):
    try:
        data = json.loads(request.body)
        topic = data.get('topic', 'this topic')
        count = data.get('count', 3)
        
        prompt = f"""Generate {count} practice questions about {topic}.

Include:
- 1 multiple choice question with 4 options
- 1 short answer question
- 1 true/false question

For each question provide:
- The question text
- Correct answer
- Brief explanation

Format as JSON array with id, type, question, options (if applicable), correctAnswer, explanation."""
        
        questions_text = get_ai_response(prompt, max_tokens=800)
        
        return JsonResponse({
            'success': True,
            'questions_text': questions_text
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def get_study_tips(request):
    try:
        data = json.loads(request.body)
        topic = data.get('topic', 'this topic')
        
        tips = f"""💡 **Study Tips for {topic}:**

📝 **Effective Learning Strategies:**
• Break it into smaller chunks
• Use active recall techniques
• Create visual mind maps
• Practice with real examples

⏰ **Time Management:**
• Study in 25-minute focused sessions
• Take 5-minute breaks between sessions
• Review material within 24 hours
• Space out practice over several days

🎯 **Memory Techniques:**
• Create acronyms for key points
• Use the story method for sequences
• Associate with familiar concepts
• Teach it to someone else

🔄 **Self-Assessment:**
• Quiz yourself regularly
• Explain concepts out loud
• Identify weak areas for extra focus
• Track your progress over time"""
        
        return JsonResponse({
            'success': True,
            'tips': tips
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
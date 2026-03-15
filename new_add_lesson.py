@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def add_lesson(request):
    try:
        data = json.loads(request.body)
        chapter_id = data.get('chapter_id')
        title = data.get('title')
        course_id = data.get('course_id')
        
        if not chapter_id or not title:
            return Response({
                'status': 'error',
                'message': 'Chapter ID and lesson title are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cursor = connection.cursor()
        
        # Get next lesson number for this chapter
        cursor.execute("SELECT COALESCE(MAX(lesson_no), 0) + 1 FROM lessons WHERE chapter_id = %s", [chapter_id])
        next_lesson_no = cursor.fetchone()[0]
        
        # Insert new lesson
        cursor.execute("""
            INSERT INTO lessons (chapter_id, title, lesson_no, course_id, created_at, updated_at)
            VALUES (%s, %s, %s, %s, NOW(), NOW())
        """, [chapter_id, title, next_lesson_no, course_id])
        
        lesson_id = cursor.lastrowid
        
        return Response({
            'status': 'success',
            'message': 'Lesson created successfully',
            'data': {
                'id': lesson_id,
                'chapter_id': chapter_id,
                'title': title,
                'lesson_no': next_lesson_no
            }
        })
        
    except Exception as e:
        print(f"Add lesson error: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'Failed to create lesson: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
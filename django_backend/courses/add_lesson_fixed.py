@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def add_lesson(request):
    try:
        data = json.loads(request.body)
        chapter_id = data.get('chapter_id')
        title = data.get('title')
        
        if not chapter_id or not title:
            return Response({
                'status': 'error',
                'message': 'Chapter ID and lesson title are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cursor = connection.cursor()
        
        # Check if chapter exists using correct column name
        cursor.execute("SELECT chapter_id FROM chapters WHERE chapter_id = %s", [chapter_id])
        chapter_result = cursor.fetchone()
        if not chapter_result:
            return Response({
                'status': 'error',
                'message': 'Chapter not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get next lesson number for this chapter
        cursor.execute("SELECT COALESCE(MAX(lesson_number), 0) + 1 FROM lessons WHERE chapter_id = %s", [chapter_id])
        next_lesson_no = cursor.fetchone()[0]
        
        # Insert new lesson using correct column names from schema
        cursor.execute("""
            INSERT INTO lessons (chapter_id, lesson_number, lesson_name, created_at)
            VALUES (%s, %s, %s, NOW())
        """, [chapter_id, next_lesson_no, title])
        
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
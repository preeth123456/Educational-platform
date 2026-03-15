from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def test_endpoint(request):
    return JsonResponse({"status": "Django server is working", "method": request.method})
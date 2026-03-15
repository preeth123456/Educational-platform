import requests
import json

def test_usage_logging():
    try:
        url = 'http://localhost:8001/api/feature-flags/log-usage/'
        data = {
            'flag_name': 'theme_toggle',
            'user_id': 'STU20251807',
            'user_type': 'student'
        }
        
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_usage_logging()
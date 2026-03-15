import requests
import os

# Test teacher registration with file upload
url = "http://localhost:8001/api/teacher/register-files/"

# Create test files
test_files_dir = "test_files"
os.makedirs(test_files_dir, exist_ok=True)

# Create dummy files for testing
cv_content = b"This is a test CV file content"
degree_content = b"This is a test degree certificate content"
experience_content = b"This is a test experience proof content"

cv_file_path = os.path.join(test_files_dir, "test_cv.pdf")
degree_file_path = os.path.join(test_files_dir, "test_degree.pdf")
experience_file_path = os.path.join(test_files_dir, "test_experience.pdf")

with open(cv_file_path, 'wb') as f:
    f.write(cv_content)
with open(degree_file_path, 'wb') as f:
    f.write(degree_content)
with open(experience_file_path, 'wb') as f:
    f.write(experience_content)

# Test data
data = {
    'name': 'Test Teacher',
    'email': 'testteacher@example.com',
    'phone': '1234567890',
    'password': 'testpassword123'
}

# Files to upload
files = {
    'cv_file': ('test_cv.pdf', open(cv_file_path, 'rb'), 'application/pdf'),
    'degree_certificate': ('test_degree.pdf', open(degree_file_path, 'rb'), 'application/pdf'),
    'experience_proof': ('test_experience.pdf', open(experience_file_path, 'rb'), 'application/pdf')
}

try:
    print("Testing teacher registration with file upload...")
    response = requests.post(url, data=data, files=files)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        result = response.json()
        teacher_id = result['data']['teacher_id']
        print(f"✅ Registration successful! Teacher ID: {teacher_id}")
        
        # Check if files exist in media folder
        media_path = f"C:\\xampp\\htdocs\\EDUYATA-PROJECT\\Eduyta-collaboration\\Eduyata-collaboration\\django_backend\\media\\teachers\\{teacher_id}"
        print(f"Checking files in: {media_path}")
        
        if os.path.exists(media_path):
            files_in_folder = os.listdir(media_path)
            print(f"Files found: {files_in_folder}")
            
            expected_files = ['CV_test_cv.pdf', 'DEGREE_test_degree.pdf', 'EXPERIENCE_test_experience.pdf']
            for expected_file in expected_files:
                if expected_file in files_in_folder:
                    print(f"✅ {expected_file} - Found")
                else:
                    print(f"❌ {expected_file} - Missing")
        else:
            print(f"❌ Media folder not created: {media_path}")
    else:
        print("❌ Registration failed!")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    # Close files
    for file_obj in files.values():
        if hasattr(file_obj[1], 'close'):
            file_obj[1].close()
    
    # Clean up test files
    for file_path in [cv_file_path, degree_file_path, experience_file_path]:
        if os.path.exists(file_path):
            os.remove(file_path)
    if os.path.exists(test_files_dir):
        os.rmdir(test_files_dir)
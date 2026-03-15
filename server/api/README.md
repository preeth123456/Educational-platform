# Eduyata API Setup Instructions

## Database Setup

1. **Start XAMPP** and ensure MySQL service is running
2. **Create Database and Tables**:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import the `database_setup.sql` file or run the SQL commands manually
   - This will create the `eduyata_db` database and `students` table

## Testing Database Connection

1. **Test Database Connection**:
   - Visit: `http://localhost/AIEduPro/server/api/test_db.php`
   - This will show if the database connection is working and if the table exists

## API Endpoints

### Student Registration
- **URL**: `POST /server/api/auth/student_register.php`
- **Required Fields**: `name`, `phone`
- **Optional Fields**: `email`, `father_name`, `gender`, `father_phone`, `mother_phone`, `class`, `board`

### Example Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "class": "10",
  "board": "CBSE"
}
```

## Troubleshooting

### If data is not being stored:

1. **Check Database Connection**:
   - Visit `http://localhost/AIEduPro/server/api/test_db.php`
   - Ensure MySQL is running in XAMPP

2. **Check PHP Error Logs**:
   - Look in XAMPP's Apache error logs
   - Check browser console for JavaScript errors

3. **Verify Table Structure**:
   - The `students` table should have these columns:
     - `id` (auto-increment primary key)
     - `student_id` (unique identifier)
     - `name` (required)
     - `mobile_self` (phone number)
     - Other optional fields

4. **Test API Directly**:
   - Use Postman or curl to test the API endpoint
   - Check the response for error messages

### Common Issues:

1. **CORS Errors**: Make sure the frontend URL matches the CORS configuration
2. **Database Connection**: Verify MySQL is running and credentials are correct
3. **Missing Table**: Run the database setup script
4. **Permission Issues**: Ensure the web server has write permissions to the database 
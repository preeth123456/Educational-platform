"""
Eduyata Developer Kit Generator
-------------------------------
Generates a complete web dashboard for developers to access API data visually.

Bundle Structure:
Eduyata_Developer_Kit/
├── .env.example
├── config.js
├── README.md
├── DEVELOPER_GUIDE.html
├── index.html
├── app.js
└── styles.css

Two modes:
1. Email Bundle: API key pre-filled, endpoints filtered based on permissions
2. Manual Download: No API key (placeholder), all endpoints available
"""
import io
import zipfile



def get_developer_guide_html():
    """
    Returns the complete HTML content for the Developer Guide.
    Used by both the Zip Generator and the Public Guide Endpoint.
    """
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eduyata Developer Kit - Complete Guide</title>
    <style>
        :root {
            --primary: #f97316;
            --dark: #18181b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #f9fafb;
            color: #374151;
            line-height: 1.7;
        }
        .header {
            background: linear-gradient(135deg, var(--dark), #27272a);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header h1 span { color: var(--primary); }
        .header p { color: #a1a1aa; font-size: 1.1rem; }
        .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
        .section { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .section h2 {
            color: var(--dark);
            font-size: 1.5rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid var(--primary);
            display: inline-block;
        }
        .section h3 { color: var(--primary); margin: 1.5rem 0 0.75rem; }
        p { margin-bottom: 1rem; }
        code {
            background: #f3f4f6;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-family: 'Consolas', monospace;
            font-size: 0.9rem;
        }
        pre {
            background: #1f2937;
            color: #e5e7eb;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        pre code { background: none; color: inherit; padding: 0; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        th, td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th { background: #374151; color: white; }
        tr:nth-child(even) { background: #f9fafb; }
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .badge-get { background: #d1fae5; color: #065f46; }
        .badge-post { background: #fef3c7; color: #92400e; }
        .note {
            background: #fef3c7;
            border-left: 4px solid #f97316;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0 8px 8px 0;
        }
        .warning {
            background: #fee2e2;
            border-left: 4px solid #dc2626;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0 8px 8px 0;
        }
        .success {
            background: #d1fae5;
            border-left: 4px solid #059669;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0 8px 8px 0;
        }
        ul, ol { margin: 1rem 0 1rem 2rem; }
        li { margin-bottom: 0.5rem; }
        .footer {
            text-align: center;
            padding: 2rem;
            color: #9ca3af;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1><span>Eduyata</span> Developer Guide</h1>
        <p>Complete API Documentation & Integration Guide</p>
    </header>
    
    <main class="container">
        <!-- Quick Start -->
        <section class="section">
            <h2>🚀 Quick Start</h2>
            
            <h3>Step 1: Configure Your API Key</h3>
            <p>Open <code>config.js</code> and add your API key in the configuration object:</p>
            <pre><code>// config.js
const EDUYATA_CONFIG = {
    API_KEY: "edu_your_api_key_here", // Paste your key here
    API_URL: "http://localhost:8001/api/v1" 
};</code></pre>
            
            <div class="note">
                <strong>📝 Note:</strong> Your administrator may have already configured your API key for you if this bundle was sent via email.
            </div>
            
            <h3>Step 2: Run the Dashboard</h3>
            <p>Choose one of these methods to run the dashboard:</p>
            
            <h4>Option A: Direct Browser (Simplest)</h4>
            <p>Just double-click <code>index.html</code> to open in your browser.</p>
            
            <h4>Option B: Python Local Server (Recommended)</h4>
            <pre><code># Navigate to the extracted folder
cd Eduyata_Developer_Kit

# Start a local server
python -m http.server 8000

# Open in browser: http://localhost:8000</code></pre>
            
            <h4>Option C: Node.js Local Server</h4>
            <pre><code># Install http-server globally (one-time)
npm install -g http-server

# Navigate to the extracted folder
cd Eduyata_Developer_Kit

# Start the server
http-server -p 8000

# Open in browser: http://localhost:8000</code></pre>
            
            <h4>Option D: VS Code Live Server</h4>
            <p>If using VS Code, install the "Live Server" extension and right-click <code>index.html</code> → "Open with Live Server"</p>
            
            <h3>Step 3: Query Data</h3>
            <ol>
                <li><strong>Select an endpoint:</strong> Check the box for the data you want (Students, Courses, etc.).</li>
                <li><strong>Dynamic ID Input:</strong> When you select a category, an optional ID field will appear. Enter a specific ID to fetch a single record.</li>
                <li><strong>Permissions:</strong> Categories you do not have access to will be disabled or hidden automatically.</li>
                <li>Click <strong>Submit</strong> to fetch data.</li>
                <li>View results in the table (30 records per page).</li>
                <li>Download as PDF or CSV using the buttons.</li>
            </ol>
        </section>
        
        <!-- API Authentication -->
        <section class="section">
            <h2>🔐 API Authentication</h2>
            
            <p>All API requests must include your API key in the headers:</p>
            <pre><code>X-API-Key: your_api_key_here</code></pre>
            
            <h3>Example cURL Request</h3>
            <pre><code>curl -X GET "http://localhost:8001/api/v1/students/" \\
     -H "X-API-Key: edu_your_api_key_here"</code></pre>
            
            <h3>Example JavaScript Request</h3>
            <pre><code>fetch('http://localhost:8001/api/v1/students/', {
    headers: {
        'X-API-Key': 'edu_your_api_key_here'
    }
})
.then(response => response.json())
.then(data => console.log(data));</code></pre>
            
            <div class="warning">
                <strong>⚠️ Security:</strong> Never expose your API key in client-side code on public websites. Use server-side requests or environment variables.
            </div>
        </section>
        
        <!-- Available Endpoints -->
        <section class="section">
            <h2>📡 Available Endpoints</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/students/</code></td>
                        <td>List all students (paginated)</td>
                    </tr>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/students/{id}/</code></td>
                        <td>Get a specific student by ID</td>
                    </tr>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/courses/</code></td>
                        <td>List all courses (paginated)</td>
                    </tr>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/courses/{id}/</code></td>
                        <td>Get a specific course by ID</td>
                    </tr>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/teachers/</code></td>
                        <td>List all teachers (paginated)</td>
                    </tr>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/teachers/{id}/</code></td>
                        <td>Get a specific teacher by ID</td>
                    </tr>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/classrooms/</code></td>
                        <td>List all classrooms (paginated)</td>
                    </tr>
                    <tr>
                        <td><span class="badge badge-get">GET</span></td>
                        <td><code>/api/v1/classrooms/{id}/</code></td>
                        <td>Get a specific classroom by ID</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="note">
                <strong>📝 Note:</strong> Your API key controls access. If an endpoint is not available to you, it will either be <strong>hidden</strong> from the list entirely or <strong>disabled (greyed out)</strong>.
            </div>
        </section>
        
        <!-- Pagination & Filtering -->
        <section class="section">
            <h2>📄 Pagination & Filtering</h2>
            
            <h3>Pagination</h3>
            <p>All list endpoints return paginated results. Default: 20 records per page, maximum: 100.</p>
            <pre><code>GET /api/v1/students/?page=1&page_size=50</code></pre>
            
            <table>
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>page</code></td>
                        <td>integer</td>
                        <td>Page number (default: 1)</td>
                    </tr>
                    <tr>
                        <td><code>page_size</code></td>
                        <td>integer</td>
                        <td>Records per page (default: 20, max: 100)</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Response Format</h3>
            <pre><code>{
    "count": 150,
    "next": "http://localhost:8001/api/v1/students/?page=2",
    "previous": null,
    "results": [
        { "id": 1, "name": "John Doe", ... },
        { "id": 2, "name": "Jane Smith", ... }
    ]
}</code></pre>
            
            <h3>Filtering</h3>
            <p>Filter results using query parameters:</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Endpoint</th>
                        <th>Available Filters</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Students</td>
                        <td><code>class_level</code>, <code>board</code></td>
                    </tr>
                    <tr>
                        <td>Courses</td>
                        <td><code>category</code>, <code>level</code></td>
                    </tr>
                    <tr>
                        <td>Teachers</td>
                        <td><code>subject</code>, <code>is_active</code></td>
                    </tr>
                    <tr>
                        <td>Classrooms</td>
                        <td><code>is_active</code></td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Example with Filters</h3>
            <pre><code>GET /api/v1/students/?class_level=10&board=CBSE&page_size=50</code></pre>
        </section>
        
        <!-- Download Options -->
        <section class="section">
            <h2>💾 Download Options</h2>
            
            <p>The dashboard provides three download options:</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Download This Page</strong></td>
                        <td>Downloads the current page (up to 30 records)</td>
                    </tr>
                    <tr>
                        <td><strong>Download All</strong></td>
                        <td>Downloads all records from the query</td>
                    </tr>
                    <tr>
                        <td><strong>Row Download (⬇)</strong></td>
                        <td>Downloads a single record (click the button in the last column)</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Formats</h3>
            <ul>
                <li><strong>CSV:</strong> Comma-separated values, compatible with Excel and spreadsheet applications</li>
                <li><strong>PDF:</strong> Professional document with Eduyata branding, gray-scale tables, page numbers</li>
            </ul>
        </section>
        
        <!-- Rate Limiting -->
        <section class="section">
            <h2>⏱️ Rate Limiting</h2>
            
            <p>API requests are rate-limited to ensure fair usage:</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Limit Type</th>
                        <th>Default Limit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Requests per Hour</td>
                        <td>1,000 (configurable per API key)</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Rate Limit Headers</h3>
            <p>Response headers include rate limit information:</p>
            <pre><code>X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1609459200</code></pre>
            
            <div class="warning">
                <strong>⚠️ 429 Too Many Requests:</strong> If you exceed the rate limit, you'll receive a 429 error. Wait until the reset time before making more requests.
            </div>
        </section>
        
        <!-- Error Handling -->
        <section class="section">
            <h2>❌ Error Handling</h2>
            
            <p>The API returns standard HTTP status codes:</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Meaning</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>200</code></td>
                        <td>Success</td>
                        <td>Request completed successfully</td>
                    </tr>
                    <tr>
                        <td><code>400</code></td>
                        <td>Bad Request</td>
                        <td>Check your request parameters</td>
                    </tr>
                    <tr>
                        <td><code>401</code></td>
                        <td>Unauthorized</td>
                        <td>API key is missing or invalid</td>
                    </tr>
                    <tr>
                        <td><code>403</code></td>
                        <td>Forbidden</td>
                        <td>API key doesn't have access to this endpoint</td>
                    </tr>
                    <tr>
                        <td><code>404</code></td>
                        <td>Not Found</td>
                        <td>Resource doesn't exist</td>
                    </tr>
                    <tr>
                        <td><code>429</code></td>
                        <td>Too Many Requests</td>
                        <td>Rate limit exceeded, wait and retry</td>
                    </tr>
                    <tr>
                        <td><code>500</code></td>
                        <td>Server Error</td>
                        <td>Contact administrator</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Error Response Format</h3>
            <pre><code>{
    "error": "Access denied",
    "message": "Your API key does not have access to the students endpoint",
    "code": "ENDPOINT_FORBIDDEN"
}</code></pre>
        </section>
        
        <!-- Files Reference -->
        <section class="section">
            <h2>📁 File Reference</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>.env.example</code></td>
                        <td>Configuration file - contains API key and settings</td>
                    </tr>
                    <tr>
                        <td><code>config.js</code></td>
                        <td>JavaScript configuration - reads from .env</td>
                    </tr>
                    <tr>
                        <td><code>index.html</code></td>
                        <td>Main dashboard interface</td>
                    </tr>
                    <tr>
                        <td><code>app.js</code></td>
                        <td>Application logic (fetch, paginate, download)</td>
                    </tr>
                    <tr>
                        <td><code>styles.css</code></td>
                        <td>Eduyata theme styling</td>
                    </tr>
                    <tr>
                        <td><code>README.md</code></td>
                        <td>Quick start guide</td>
                    </tr>
                    <tr>
                        <td><code>DEVELOPER_GUIDE.html</code></td>
                        <td>This complete documentation</td>
                    </tr>
                </tbody>
            </table>
        </section>
        
        <!-- Support -->
        <section class="section">
            <h2>💬 Support</h2>
            
            <div class="success">
                <strong>Need Help?</strong>
                <ul style="margin-top: 0.5rem;">
                    <li>Contact your Eduyata administrator for API key issues</li>
                    <li>Check the error codes section for troubleshooting</li>
                    <li>Ensure your API key has permissions for the endpoints you're accessing</li>
                </ul>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <p>Eduyata Developer Kit v1.0 | © 2026 Eduyata Platform</p>
    </footer>
</body>
</html>
'''

def generate_developer_kit_bundle(api_key=None, allowed_endpoints=None):
    """
    Generates the Eduyata Developer Kit - A complete web dashboard.
    
    Args:
        api_key: Optional APIKey object. If provided, bundle includes pre-filled key
                 and filtered endpoints. If None, bundle is a template.
        allowed_endpoints: Optional string of comma-separated endpoints (e.g., "students,courses")
    
    Returns:
        dict with "status" and "zip_bytes" keys
    """
    try:
        # Determine mode
        is_email_bundle = api_key is not None
        
        if is_email_bundle:
            key_value = api_key.key_value
            # Get allowed endpoints from API key
            endpoints = allowed_endpoints or api_key.allowed_endpoints or "students,courses,teachers,classrooms"
            endpoints_list = [e.strip() for e in endpoints.split(',') if e.strip()]
        else:
            key_value = "PASTE_YOUR_API_KEY_HERE"
            endpoints_list = ["students", "courses", "teachers", "classrooms"]
        
        # ========== README.md ==========
        readme = f'''# Eduyata Developer Kit

## Quick Start (2 Minutes)

### Step 1: Configure Your API Key
{f"Your API key is already configured in `config.js`!" if is_email_bundle else "Open `config.js` and paste your API key:"}

```javascript
// config.js
const EDUYATA_CONFIG = {{
    API_KEY: "{key_value if is_email_bundle else "YOUR_API_KEY_HERE"}",
    API_URL: "http://localhost:8001/api/v1"
}};
```

### Step 2: Run the Local Server
Because of browser security protections (CORS), you must run a local server:

**Option A: Python (Recommended)**
```bash
python -m http.server 8000
# Then open http://localhost:8000
```

**Option B: Node.js**
```bash
npx serve
# Then open the URL shown
```

### Step 3: Query Data
1. Select an endpoint ({", ".join([e.capitalize() for e in endpoints_list])})
2. Optionally enter a specific ID
3. Click **Submit** to fetch data
4. View results (30 records per page)
5. Download as PDF or CSV

## Files
| File | Description |
|------|-------------|
| `config.js` | API configuration |
| `index.html` | Dashboard UI |
| `app.js` | Fetch & Export logic |
| `styles.css` | Eduyata theme |
| `DEVELOPER_GUIDE.html` | API Documentation |

## Support
Contact support@eduyata.com for API assistance.
'''

        # ========== config.js ==========
        config_js = f'''// Eduyata Developer Kit Configuration
const EDUYATA_CONFIG = {{
    API_KEY: "{key_value}",
    API_URL: "http://localhost:8001/api/v1" 
}};
'''

        # ========== styles.css ==========
        styles_css = '''/* Eduyata Developer Kit - Styles */
:root {
    --primary: #f97316;
    --primary-dark: #ea580c;
    --dark: #18181b;
    --light: #fafafa;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: var(--gray-50);
    color: var(--gray-700);
    line-height: 1.6;
}

/* Header */
.header {
    background: linear-gradient(135deg, var(--dark) 0%, #27272a 100%);
    color: white;
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.logo {
    width: 48px;
    height: 48px;
    background: var(--primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5rem;
    color: white;
}

.header-text h1 {
    font-size: 1.5rem;
    font-weight: 600;
}

.header-text h1 span {
    color: var(--primary);
}

.header-text p {
    font-size: 0.875rem;
    color: #a1a1aa;
}

/* Main Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Cards */
.card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: 1px solid var(--gray-200);
}

.card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary);
    display: inline-block;
}

/* Form Elements */
.form-row {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    align-items: flex-end;
}

.form-group {
    flex: 1;
    min-width: 200px;
}

.form-label {
    display: block;
    font-weight: 500;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
}


/* Endpoint Grid (Feature Update) */
.endpoint-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 0.5rem;
}

.endpoint-card {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.2s;
}

.endpoint-card:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.checkbox-group {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.checkbox-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 500;
    padding: 0.5rem 1rem;
    background: var(--gray-100);
    border-radius: 8px;
    transition: all 0.2s;
}

.checkbox-item:hover:not(.disabled) {
    background: var(--gray-200);
}

.checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
}

.checkbox-item.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: var(--gray-200);
}

.checkbox-item.disabled input {
    pointer-events: none;
}

input[type="text"], input[type="number"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-secondary {
    background: var(--gray-700);
    color: white;
}

.btn-secondary:hover {
    background: var(--gray-800);
}

.btn-outline {
    background: white;
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
}

.btn-outline:hover {
    background: var(--gray-100);
}

/* Table */
.table-container {
    overflow-x: auto;
    margin-top: 1rem;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--gray-200);
}

th {
    background: var(--gray-800);
    color: white;
    font-weight: 600;
    position: sticky;
    top: 0;
}

tr:nth-child(even) {
    background: var(--gray-50);
}

tr:hover {
    background: var(--gray-100);
}

/* Download Bar */
.download-bar {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: var(--gray-100);
    border-radius: 8px;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.download-bar select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--gray-300);
    border-radius: 6px;
    font-size: 0.875rem;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--gray-300);
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background: var(--gray-100);
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    padding: 0.5rem 1rem;
    color: var(--gray-600);
}

/* Status Messages */
.status {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.status-loading {
    background: #fef3c7;
    color: #92400e;
}

.status-error {
    background: #fee2e2;
    color: #991b1b;
}

.status-success {
    background: #d1fae5;
    color: #065f46;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--gray-500);
}

/* Footer */
.footer {
    text-align: center;
    padding: 2rem;
    color: var(--gray-500);
    font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
    }
    .checkbox-group {
        flex-direction: column;
    }
    .download-bar {
        flex-direction: column;
        align-items: stretch;
    }
}

/* Tabs (Feature Update) */
.tabs-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--gray-200);
    padding-bottom: 1px;
    overflow-x: auto;
}

.tab-btn {
    padding: 0.5rem 1.5rem;
    border: none;
    background: transparent;
    font-size: 1rem;
    font-weight: 500;
    color: var(--gray-500);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -3px;
    transition: all 0.2s;
    white-space: nowrap;
}

.tab-btn:hover {
    color: var(--gray-700);
    background: var(--gray-50);
}

.tab-btn.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
    font-weight: 600;
}
'''

        # ========== app.js ==========
        # Generate JavaScript with endpoint filtering
        endpoints_json = str(endpoints_list).replace("'", '"')
        
        app_js = f'''// Eduyata Developer Kit - Main Application

// State
let dataStore = {{}}; // Stores data for each endpoint
let currentEndpoint = ''; 
let currentPage = 1;
const pageSize = 30;
let allowedEndpoints = []; 

// Initialize
document.addEventListener('DOMContentLoaded', async () => {{
    const isValid = await validateApiKey();
    if (isValid) {{
        setupEventListeners();
    }}
}});

async function validateApiKey() {{
    if (!EDUYATA_CONFIG.API_KEY || EDUYATA_CONFIG.API_KEY === 'PASTE_YOUR_API_KEY_HERE') {{
        showStatus('Please configure your API key in config.js', 'error');
        document.getElementById('submitBtn').disabled = true;
        // Keep everything inactive
        document.querySelectorAll('.endpoint-checkbox').forEach(cb => {{
            cb.disabled = true;
            cb.closest('.checkbox-item').classList.add('disabled');
        }});
        return false;
    }}

    showStatus('Validating API key and fetching permissions...', 'loading');
    
    try {{
        const response = await fetch(`${{EDUYATA_CONFIG.API_URL}}/auth/whoami/`, {{
            headers: {{ 'X-API-Key': EDUYATA_CONFIG.API_KEY }}
        }});

        if (!response.ok) {{
            const errorData = await response.json().catch(() => ({{}}));
            throw new Error(errorData.detail || `Authentication failed (Status: ${{response.status}})`);
        }}

        const data = await response.json();
        allowedEndpoints = data.allowed_endpoints || [];
        
        console.log('Permissions loaded:', allowedEndpoints);
        applyPermissions();
        showStatus(`Welcome, ${{data.name || 'Developer'}}! Permissions loaded.`, 'success');
        return true;

    }} catch (error) {{
        console.error('Validation error:', error);
        showStatus(`API Key Error: ${{error.message}}`, 'error');
        document.getElementById('submitBtn').disabled = true;
        return false;
    }}
}}

function applyPermissions() {{
    // Enable/Disable checkboxes based on actual API permissions
    document.querySelectorAll('.endpoint-checkbox').forEach(cb => {{
        const endpoint = cb.value;
        const label = cb.closest('.checkbox-item');
        
        if (allowedEndpoints.includes(endpoint)) {{
            cb.disabled = false;
            label.classList.remove('disabled');
            label.title = '';
        }} else {{
            cb.disabled = true;
            cb.checked = false; // Ensure uncheck
            label.classList.add('disabled');
            label.title = 'Your API key does not have access to this category';
            
            // Hide ID input for disabled category
            const targetId = cb.getAttribute('data-target');
            if (targetId) {{
                const input = document.getElementById(targetId);
                if (input) {{
                    input.style.display = 'none';
                    input.value = '';
                }}
            }}
        }}
    }});
}}

function setupEventListeners() {{
    document.getElementById('submitBtn').addEventListener('click', fetchData);
    document.getElementById('prevBtn').addEventListener('click', () => changePage(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changePage(1));
    document.getElementById('downloadPageBtn').addEventListener('click', () => downloadData('page'));
    document.getElementById('downloadAllBtn').addEventListener('click', () => downloadData('all'));
    
    // Checkbox handling: Toggle ID input enablement
    document.querySelectorAll('.endpoint-checkbox').forEach(cb => {{
        cb.addEventListener('change', (e) => {{
            const targetId = e.target.getAttribute('data-target');
            if (targetId) {{
                const input = document.getElementById(targetId);
                // Toggle visibility: standard block if checked, none if unchecked
                if (e.target.checked) {{
                    input.style.display = 'block';
                    input.disabled = false;
                    input.focus();
                }} else {{
                    input.style.display = 'none';
                    input.value = ''; 
                }}
            }}
        }});
    }});
}}

async function fetchData() {{
    const selectedCheckboxes = Array.from(document.querySelectorAll('.endpoint-checkbox:checked'));
    const endpointsToFetch = selectedCheckboxes.map(cb => cb.value);
    
    if (endpointsToFetch.length === 0) {{
        showStatus('Please select at least one category', 'error');
        return;
    }}
    
    showStatus(`Fetching data from secure API...`, 'loading');
    dataStore = {{}}; 
    document.getElementById('endpointTabs').innerHTML = '';
    
    let globalError = null;

    try {{
        await Promise.all(endpointsToFetch.map(async (endpoint) => {{
            let url = `${{EDUYATA_CONFIG.API_URL}}/${{endpoint}}/`;
            let results = [];
            
            const specificIdInput = document.getElementById(`id-${{endpoint}}`);
            const specificId = specificIdInput ? specificIdInput.value.trim() : '';
            
            try {{
                if (specificId) {{
                    const response = await fetch(`${{url}}${{specificId}}/`, {{
                        headers: {{ 'X-API-Key': EDUYATA_CONFIG.API_KEY }}
                    }});

                    if (response.status === 404) {{
                        results = [];
                    }} else if (!response.ok) {{
                        throw new Error(`${{endpoint}}: ${{response.statusText}} (${{response.status}})`);
                    }} else {{
                        const data = await response.json();
                        results = [data];
                    }}
                }} else {{
                    let page = 1;
                    let hasMore = true;
                    
                    while (hasMore && page <= 5) {{ 
                        const response = await fetch(`${{url}}?page=${{page}}&page_size=100`, {{
                            headers: {{ 'X-API-Key': EDUYATA_CONFIG.API_KEY }}
                        }});
                        
                        if (!response.ok) throw new Error(`${{endpoint}}: ${{response.statusText}} (${{response.status}})`);
                        
                        const data = await response.json();
                        if (data.results) {{
                            results = results.concat(data.results);
                            hasMore = data.next !== null;
                            page++;
                        }} else {{
                            results = Array.isArray(data) ? data : [data];
                            hasMore = false;
                        }}
                    }}
                }}
            }} catch (err) {{
                console.error(`Fetch error for ${{endpoint}}:`, err);
                globalError = err.message;
            }}
            
            dataStore[endpoint] = results;
        }}));
        
        renderTabs(endpointsToFetch);
        
        if (endpointsToFetch.length > 0) {{
            const hasAnyData = endpointsToFetch.some(ep => dataStore[ep] && dataStore[ep].length > 0);
            const firstWithData = endpointsToFetch.find(ep => dataStore[ep] && dataStore[ep].length > 0) || endpointsToFetch[0];
            switchTab(firstWithData);
            
            if (globalError) {{
                showStatus(`Warning: Some data failed to load. ${{globalError}}`, 'error');
            }} else if (hasAnyData) {{
                showStatus('Data synced successfully from Eduyata database', 'success');
                document.getElementById('resultsCard').style.display = 'block';
            }} else {{
                showStatus('No records found for the selected categories.', 'warning');
                document.getElementById('resultsCard').style.display = 'block';
            }}
        }}
        
    }} catch (error) {{
        showStatus(`Critical Error: ${{error.message}}`, 'error');
    }}
}}

function renderTabs(endpoints) {{
    const tabsContainer = document.getElementById('endpointTabs');
    tabsContainer.innerHTML = endpoints.map(ep => 
        `<button class="tab-btn" onclick="switchTab('${{ep}}')" id="tab-${{ep}}">
            ${{ep.charAt(0).toUpperCase() + ep.slice(1)}} (${{dataStore[ep] ? dataStore[ep].length : 0}})
        </button>`
    ).join('');
}}

function switchTab(endpoint) {{
    currentEndpoint = endpoint;
    currentPage = 1;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`tab-${{endpoint}}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    renderTable();
}}

function renderTable() {{
    const tbody = document.getElementById('dataBody');
    const thead = document.getElementById('dataHead');
    
    if (!currentEndpoint || !dataStore[currentEndpoint]) return;
    const allData = dataStore[currentEndpoint];
    
    if (allData.length === 0) {{
        tbody.innerHTML = '<tr><td colspan="100%" class="empty-state">No records available for this category</td></tr>';
        return;
    }}
    
    const columns = Object.keys(allData[0]);
    thead.innerHTML = '<tr>' + columns.map(col => `<th>${{formatColumnName(col)}}</th>`).join('') + '<th style="text-align:center;">Download</th></tr>';
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const currentData = allData.slice(start, end);
    
    tbody.innerHTML = currentData.map((row, index) => {{
        const globalIndex = start + index;
        return '<tr>' + 
            columns.map(col => `<td>${{formatValue(row[col])}}</td>`).join('') + 
            `<td style="text-align:center;"><button class="btn btn-outline" style="padding:0.25rem 0.5rem;font-size:0.75rem;" onclick="downloadSingleRow(${{globalIndex}})">⬇</button></td>` +
        '</tr>';
    }}).join('');
    
    updatePagination();
}}

function formatColumnName(col) {{
    return col.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
}}

function formatValue(val) {{
    if (val === null || val === undefined) return '-';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}}

function updatePagination() {{
    if (!currentEndpoint || !dataStore[currentEndpoint]) return;
    const allData = dataStore[currentEndpoint];
    const totalPages = Math.ceil(allData.length / pageSize);
    document.getElementById('pageInfo').textContent = `Page ${{currentPage}} of ${{totalPages}} (${{allData.length}} records)`;
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
}}

function changePage(delta) {{
    currentPage += delta;
    renderTable();
}}

function showStatus(message, type) {{
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status status-${{type}}`;
    status.style.display = 'block';
}}

function downloadData(scope) {{
    const format = document.getElementById('formatSelect').value;
    if (!currentEndpoint || !dataStore[currentEndpoint]) return;
    const allData = dataStore[currentEndpoint];
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const currentData = allData.slice(start, end);
    
    const data = scope === 'all' ? allData : currentData;
    if (data.length === 0) {{
        showStatus('No data to download', 'error');
        return;
    }}
    
    const filename = `eduyata_${{currentEndpoint}}_${{scope === 'all' ? 'all' : 'page' + currentPage}}`;
    if (format === 'csv') {{
        downloadCSV(data, filename);
    }} else {{
        downloadPDF(data, filename);
    }}
}}

function downloadSingleRow(index) {{
    const format = document.getElementById('formatSelect').value;
    const allData = dataStore[currentEndpoint]; 
    const data = [allData[index]];
    const id = data[0].id || data[0].student_id || data[0].course_id || index;
    const filename = `eduyata_${{currentEndpoint}}_${{id}}`;
    
    if (format === 'csv') {{
        downloadCSV(data, filename);
    }} else {{
        downloadPDF(data, filename);
    }}
}}

function downloadCSV(data, filename) {{
    const columns = Object.keys(data[0]);
    const header = columns.join(',');
    const rows = data.map(row => columns.map(col => {{
        let val = row[col];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""');
        if (val.includes(',') || val.includes('"') || val.includes('\\n')) {{
            val = `"${{val}}"`;
        }}
        return val;
    }}).join(','));
    
    const csv = [header, ...rows].join('\\n');
    const blob = new Blob([csv], {{ type: 'text/csv' }});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${{filename}}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus(`Downloaded ${{filename}}.csv`, 'success');
}}

function downloadPDF(data, filename) {{
    const {{ jsPDF }} = window.jspdf;
    const doc = new jsPDF({{ orientation: 'landscape' }});
    
    doc.setFillColor(24, 24, 27);
    doc.rect(0, 0, 297, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Eduyata Data Export', 14, 16);
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`${{currentEndpoint.charAt(0).toUpperCase() + currentEndpoint.slice(1)}} - ${{data.length}} records`, 200, 16);
    
    const columns = Object.keys(data[0]);
    const tableData = data.map(row => columns.map(col => formatValue(row[col])));
    
    doc.autoTable({{
        head: [columns.map(formatColumnName)],
        body: tableData,
        startY: 30,
        styles: {{ fontSize: 8, cellPadding: 3 }},
        headStyles: {{ fillColor: [75, 85, 99], textColor: [255, 255, 255], fontStyle: 'bold' }},
        alternateRowStyles: {{ fillColor: [249, 250, 251] }},
        tableLineColor: [229, 231, 235],
        tableLineWidth: 0.1
    }});
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {{
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${{i}} of ${{pageCount}} | Eduyata Developer Kit`, 14, doc.internal.pageSize.height - 10);
    }}
    
    doc.save(`${{filename}}.pdf`);
    showStatus(`Downloaded ${{filename}}.pdf`, 'success');
}}
'''

        # ========== index.html ==========
        index_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eduyata Developer Kit</title>
    <!-- Favicon: Graduation Cap Emoji -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>">
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
</head>
<body>
    <header class="header">
        <div class="logo">E</div>
        <div class="header-text">
            <h1><span>Eduyata</span> Developer Kit</h1>
            <p>Access and export your API data</p>
        </div>
    </header>
    
    <main class="container">
        <!-- Status -->
        <div id="status" class="status" style="display: none;"></div>
        
        <!-- Query Form -->
        <div class="card">
            <h2 class="card-title">Query Data</h2>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Select Endpoints & Specific IDs</label>
                    <div class="endpoint-grid" id="endpointGrid">
                        {endpoint_html}
                    </div>
                </div>
            </div>
            
            <!-- Filters Section Removed -->


            <div class="form-row" style="margin-top: 1rem;">
                <div class="form-group" style="flex: 1; text-align: right;">
                    <button id="submitBtn" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        Submit Query
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Results -->
        <div id="resultsCard" class="card" style="display: none;">
            <h2 class="card-title">Results</h2>
            
            <!-- Endpoint Tabs (Feature Update) -->
            <div id="endpointTabs" class="tabs-container"></div>
            
            <!-- Download Bar -->
            <div class="download-bar">
                <label><strong>Format:</strong></label>
                <select id="formatSelect">
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                </select>
                <button id="downloadPageBtn" class="btn btn-outline">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download This Page
                </button>
                <button id="downloadAllBtn" class="btn btn-secondary">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download All
                </button>
            </div>
            
            <!-- Table -->
            <div class="table-container">
                <table>
                    <thead id="dataHead"></thead>
                    <tbody id="dataBody"></tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="pagination">
                <button id="prevBtn" disabled>&larr; Previous</button>
                <span id="pageInfo">Page 1 of 1</span>
                <button id="nextBtn" disabled>Next &rarr;</button>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <p>Eduyata Developer Kit v1.0 | Open DEVELOPER_GUIDE.html for full documentation</p>
    </footer>
    
    <script src="config.js"></script>
    <script src="app.js"></script>
</body>
</html>
'''

        # Generate Dynamic Endpoint HTML for index.html
        endpoint_html = ""
        # Filter available endpoints based on permissions if it's an email bundle
        visible_endpoints = endpoints_list if is_email_bundle else ["students", "courses", "teachers", "classrooms"]
        
        for ep in visible_endpoints:
            display_name = ep.capitalize()
            # ID input initially hidden (display: none)
            endpoint_html += f'''
                        <!-- {display_name} -->
                        <div class="endpoint-card">
                            <label class="checkbox-item">
                                <input type="checkbox" class="endpoint-checkbox" value="{ep}" data-target="id-{ep}">
                                <span>{display_name}</span>
                            </label>
                            <input type="text" id="id-{ep}" class="id-input" placeholder="{ep[:-1].capitalize()} ID (Optional)" style="margin-top: 0.5rem; width: 100%; display: none;">
                        </div>'''

        # ========== index.html (Formatted) ==========
        index_html = index_html.format(endpoint_html=endpoint_html)

        # ========== DEVELOPER_GUIDE.html ==========
        guide_html = get_developer_guide_html()


        # ========== Create ZIP Bundle ==========
        mem_zip = io.BytesIO()
        with zipfile.ZipFile(mem_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.writestr('Eduyata_Developer_Kit/config.js', config_js)
            zf.writestr('Eduyata_Developer_Kit/README.md', readme)
            zf.writestr('Eduyata_Developer_Kit/DEVELOPER_GUIDE.html', guide_html)
            zf.writestr('Eduyata_Developer_Kit/index.html', index_html)
            zf.writestr('Eduyata_Developer_Kit/app.js', app_js)
            zf.writestr('Eduyata_Developer_Kit/styles.css', styles_css)
        
        return {
            "status": "success",
            "zip_bytes": mem_zip.getvalue()
        }
    
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": str(e),
            "details": traceback.format_exc()
        }

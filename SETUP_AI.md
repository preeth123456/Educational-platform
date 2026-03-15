# AI Buddy Setup Guide

## Quick Setup

### 1. Install Dependencies
```bash
cd django_backend
pip install openai==1.3.0
```

### 2. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy the key

### 3. Set Environment Variable
```bash
# Windows
set OPENAI_API_KEY=your-api-key-here

# Linux/Mac
export OPENAI_API_KEY=your-api-key-here
```

### 4. Start Django Server
```bash
cd django_backend
python manage.py runserver
```

### 5. Start React App
```bash
cd client
npm run dev
```

## Usage

Add to any page:
```tsx
<AiBuddyPopup 
  studentName="John Doe"
  currentContent="Your lesson content..."
  currentTopic="Math - Integration"
/>
```

## Features
- 📚 **Summarize** - AI summarizes reading material
- 🎯 **Explain** - AI explains difficult concepts  
- 📝 **Practice** - AI generates practice questions

## API Endpoints
- POST `/api/ai/summarize/` - Summarize content
- POST `/api/ai/explain/` - Explain topics
- POST `/api/ai/questions/` - Generate questions
- POST `/api/ai/tips/` - Get study tips
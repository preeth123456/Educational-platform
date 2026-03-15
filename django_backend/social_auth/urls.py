from django.urls import path
from . import views

urlpatterns = [
    # Google SSO
    path('google/login/', views.google_login, name='google_login'),
    path('google/callback/', views.google_callback, name='google_callback'),
    
    # Microsoft SSO
    path('microsoft/login/', views.microsoft_login, name='microsoft_login'),
    path('microsoft/callback/', views.microsoft_callback, name='microsoft_callback'),
    
    # Canvas LMS
    path('canvas/callback/', views.canvas_callback, name='canvas_callback'),
    
    # Zoom
    path('zoom/callback/', views.zoom_callback, name='zoom_callback'),
    
    # Slack
    path('slack/callback/', views.slack_callback, name='slack_callback'),
    
    # Salesforce
    path('salesforce/callback/', views.salesforce_callback, name='salesforce_callback'),
    
    # HubSpot
    path('hubspot/callback/', views.hubspot_callback, name='hubspot_callback'),
    
    # Dropbox
    path('dropbox/callback/', views.dropbox_callback, name='dropbox_callback'),
    
    # GitHub
    path('github/callback/', views.github_callback, name='github_callback'),
    
    # Notion
    path('notion/callback/', views.notion_callback, name='notion_callback'),
    
    # Registration & Account Management
    path('complete-registration/', views.complete_sso_registration, name='complete_sso_registration'),
    path('linked-accounts/', views.get_linked_accounts, name='get_linked_accounts'),
]

from django.urls import path
from . import lockout_views

urlpatterns = [
    path('account-lockouts/', lockout_views.get_account_lockouts, name='get_account_lockouts'),
    path('unlock-user/', lockout_views.unlock_account, name='unlock_account'),
]
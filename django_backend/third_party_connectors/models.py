from django.db import models
from django.utils import timezone
from integration_marketplace.encryption import EncryptionService
from public_api.models import APIKey
from integration_marketplace.models import Integration
from admin_auth.models import AdminNotification

# Enhanced APIKey model for OAuth credentials (existing table)
class OAuthAPIKey(APIKey):
    """Proxy model for OAuth credentials using existing api_keys table"""
    
    class Meta:
        proxy = True
        verbose_name = 'OAuth Application'
        verbose_name_plural = 'OAuth Applications'
    
    # Properties removed because they conflict with Django model fields
    # when migrating or saving. The fields exist in the parent model's table
    # so we can access them directly.
    pass
    
    def get_decrypted_secret(self):
        """Get decrypted client secret from allowed_ips field (reused as secret storage)"""
        # key_value is max 64 chars, too short for encrypted secret
        # We reuse allowed_ips (TextField) to store the encrypted client_secret
        return EncryptionService.decrypt_value(self.allowed_ips)
    
    @classmethod
    def create_oauth_app(cls, provider, name, client_id, client_secret, redirect_uri, scopes=None, user=None):
        """Create or Update OAuth application using existing api_keys table"""
        import secrets
        
        # Consistent with ViewSet and Storage in allowed_ips (TextField)
        from integration_marketplace.encryption import EncryptionService
        encrypted_secret = EncryptionService.encrypt_value(client_secret)
        
        obj, created = cls.objects.update_or_create(
            oauth_provider=provider,
            defaults={
                'name': f"{provider.title()} Connector App",
                'key_value': f"APP_{provider.upper()}_{secrets.token_hex(4)}", 
                'allowed_ips': encrypted_secret, # Store secret here!
                'user': user,
                'oauth_provider': provider, # Explicitly set for proxy model safety
                'oauth_client_id': client_id,
                'oauth_redirect_uri': redirect_uri,
                'oauth_scopes': scopes or '',
                'is_active': True
            }
        )
        return obj

# Enhanced Integration model for OAuth tokens (existing table)
class OAuthIntegration(Integration):
    """Proxy model for OAuth integrations using existing integrations table"""
    
    class Meta:
        proxy = True
        verbose_name = 'OAuth Integration'
        verbose_name_plural = 'OAuth Integrations'
    
    def get_oauth_tokens(self):
        """Get OAuth tokens from encrypted config"""
        import json
        config = self.get_decrypted_config()
        if isinstance(config, str):
            try:
                config = json.loads(config)
            except json.JSONDecodeError:
                config = {}
        tokens = config.get('oauth_tokens', {})
        if isinstance(tokens, str):
            # It might be a string representation of a dict due to encryption/decryption
            # of the whole object because key contains 'token'
            try:
                # Try JSON first
                tokens = json.loads(tokens)
            except json.JSONDecodeError:
                 # If it was str(dict) which uses single quotes, json.loads fails.
                 # Fallback to ast.literal_eval if safe (usually discouraged but here it's our data)
                 # Or better, ensures set_oauth_tokens saves as proper JSON string before encryption?
                 # Better to fix set_oauth_tokens to handle saving.
                 import ast
                 try:
                    tokens = ast.literal_eval(tokens)
                 except:
                    tokens = {}
        return tokens
    
    def set_oauth_tokens(self, access_token, refresh_token=None, expires_at=None, scopes=None):
        """Set OAuth tokens in encrypted config"""
        import json
        config = self.get_decrypted_config() or {}
        if isinstance(config, str):
            try:
                config = json.loads(config)
            except json.JSONDecodeError:
                config = {}
        
        # Preserve existing tokens if new ones aren't provided
        existing_tokens = config.get('oauth_tokens', {})
        
        # Handle expires_at - can be string (already formatted) or datetime object
        if expires_at:
            if hasattr(expires_at, 'isoformat'):
                expires_at_str = expires_at.isoformat()
            else:
                expires_at_str = str(expires_at)
        else:
            expires_at_str = None
        
        config['oauth_tokens'] = {
            'access_token': access_token,
            'refresh_token': refresh_token or existing_tokens.get('refresh_token'),
            'expires_at': expires_at_str,
            'scopes': scopes or existing_tokens.get('scopes')
        }
        
        # Encrypt and save via the parent update_secrets logic effectively
        # But here we set config and must save
        self.config = EncryptionService.encrypt_config(config)
        self.save()
    
    def is_token_expired(self):
        """Check if OAuth token is expired"""
        tokens = self.get_oauth_tokens()
        expires_at = tokens.get('expires_at')
        if not expires_at:
            return True # Assume expired if no date
        return timezone.now() >= timezone.datetime.fromisoformat(expires_at)
    
    def get_data_mappings(self):
        """Get data mappings from config"""
        decrypted_config = self.get_decrypted_config()
        return decrypted_config.get('data_mappings', []) if decrypted_config else []
    
    def set_data_mappings(self, mappings):
        """Set data mappings in config"""
        config = self.get_decrypted_config() or {}
        config['data_mappings'] = mappings
        
        # Encrypt and save
        self.config = EncryptionService.encrypt_config(config)
        self.save()

# Enhanced AdminNotification for sync jobs (existing table)
class SyncJobNotification(AdminNotification):
    """Proxy model for sync jobs using existing admin_notifications table"""
    
    class Meta:
        proxy = True
        verbose_name = 'Sync Job'
        verbose_name_plural = 'Sync Jobs'
    
    # Properties like status, job_type are accessed via the job_metadata dictionary helper
    # or should be methods if they are wrappers around the JSON field.
    # Currently they are properties returning values from JSON, which IS fine since they don't share names with DB columns.
    # Wait, the error was "property 'job_metadata' of 'SyncJobNotification' object has no setter"
    # This happens when we try to assign to it, e.g. self.job_metadata['status'] = 'running'
    # BUT, job_metadata returns a DICT (copy usually from json.loads). Modifying it doesn't change the object unless we write it back.
    # The error came from line 176: metadata = self.job_metadata.
    # Wait, update_progress calls self.job_metadata.
    # The property is fine.
    # BUT if something tried `self.job_metadata = ...` it would fail.
    # The traceback said: property 'job_metadata' of 'SyncJobNotification' object has no setter.
    # Ah, I see in update_progress: metadata['processed_records'] = ... this modifies the dict.
    # Wait, the error was likely earlier or in a different place?
    # Let's look at the traceback again.
    # The error occurred in `job.update_progress`? No, the traceback was suppressed/truncated in previous steps but in this step 760:
    # [FAIL] SyncJobNotification Error: property 'job_metadata' of 'SyncJobNotification' object has no setter
    # This implies something assigned to job.job_metadata = value.
    # BUT my code in `update_progress` does `metadata = self.job_metadata`.
    # Let's check `verify_feature_5_backend.py`.
    # In verify script: `meta = job.job_metadata` -> OK.
    # Error likely in library or obscure interaction?
    # Or maybe `job_metadata` property is somehow conflicting with a field? No.
    # Let's simple fix: Make it a method `get_job_metadata()` to avoid property setter confusion 
    # or just fix the usage if it's assigning.
    
    def get_job_metadata(self):
        """Get job metadata from webhook_event_data"""
        import json
        try:
            return json.loads(self.webhook_event_data) if self.webhook_event_data else {}
        except (json.JSONDecodeError, TypeError):
            return {}
            
    # Remove other properties that depend on it to avoid confusion or just update them to use get_job_metadata
    @property
    def job_type(self):
        return self.get_job_metadata().get('job_type', 'sync')
    
    @property
    def status(self):
        return self.get_job_metadata().get('status', 'pending')
    
    @property
    def total_records(self):
        return self.get_job_metadata().get('total_records', 0)
    
    @property
    def processed_records(self):
        return self.get_job_metadata().get('processed_records', 0)
    
    @property
    def progress_percentage(self):
        """Calculate job progress percentage"""
        try:
            total = self.total_records
            processed = self.processed_records
            if total == 0:
                return 0
            return min(100, int((processed / total) * 100))
        except:
             return 0

    @property
    def duration_seconds(self):
        """Calculate duration in seconds"""
        metadata = self.get_job_metadata()
        start = metadata.get('started_at')
        end = metadata.get('completed_at')
        
        if start and end:
            try:
                from django.utils import timezone
                from datetime import datetime
                # Handle potential Z vs +00:00 format issues
                start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
                end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
                return int((end_dt - start_dt).total_seconds())
            except:
                return 0
        return 0
    
    @classmethod
    def create_sync_job(cls, integration_id, job_type, source_type, target_type):
        """Create sync job using existing admin_notifications table"""
        import json
        
        job_metadata = {
            'integration_id': integration_id,
            'job_type': job_type,
            'status': 'pending',
            'source_type': source_type,
            'target_type': target_type,
            'total_records': 0,
            'processed_records': 0,
            'started_at': None,
            'completed_at': None
        }
        
        return cls.objects.create(
            title=f"Sync Job: {source_type} -> {target_type}",
            message=f"Sync job created for integration {integration_id}",
            notification_type='sync_job',
            teacher_id=str(integration_id),
            webhook_event_type=job_type,
            webhook_event_data=json.dumps(job_metadata),
            is_read=False
        )
    
    def update_progress(self, processed_records, total_records=None, status=None):
        """Update sync job progress"""
        import json
        
        metadata = self.get_job_metadata()
        metadata['processed_records'] = processed_records
        if total_records is not None:
            metadata['total_records'] = total_records
        if status:
            metadata['status'] = status
            if status == 'running' and not metadata.get('started_at'):
                metadata['started_at'] = timezone.now().isoformat()
            elif status in ['completed', 'failed']:
                metadata['completed_at'] = timezone.now().isoformat()
        
        self.webhook_event_data = json.dumps(metadata)
        self.message = f"Processed {processed_records} of {metadata.get('total_records', '?')} records"
        self.save()

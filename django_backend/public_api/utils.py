from django.core.signing import TimestampSigner, BadSignature, SignatureExpired

class TokenGenerator:
    """
    Generates time-limited, signed tokens for secure file downloads.
    """
    
    @staticmethod
    def make_token(api_key_id):
        """
        Creates a signed token containing the API Key ID.
        """
        signer = TimestampSigner()
        # Sign the ID directly
        return signer.sign(str(api_key_id))

    @staticmethod
    def validate_token(token, max_age_seconds=86400): # Default 24 hours
        """
        Validates the token and returns the API Key ID if valid.
        Returns None if invalid or expired.
        """
        signer = TimestampSigner()
        try:
            # unsign returns the original value if signature is valid and not expired
            original_value = signer.unsign(token, max_age=max_age_seconds)
            return original_value
        except (BadSignature, SignatureExpired):
            return None

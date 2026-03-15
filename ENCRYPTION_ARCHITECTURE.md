# 🏗️ Data Encryption & Key Management - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EDUYATA PLATFORM                             │
│                    Data Encryption & Key Management                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ SecurityIndicator│  │EncryptionDashboard│  │  SessionManager  │  │
│  │   Component      │  │    Component      │  │   (Enhanced)     │  │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤  │
│  │ • Show badges    │  │ • Admin panel    │  │ • Token encrypt  │  │
│  │ • Status display │  │ • Statistics     │  │ • 24hr timeout   │  │
│  │ • User-friendly  │  │ • One-click enc  │  │ • Auto cleanup   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │ HTTPS/API Calls
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                          API LAYER                                    │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Encryption API Endpoints                          │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ POST /api/auth/rotate_encryption_key/                         │  │
│  │ GET  /api/auth/security_status/                               │  │
│  │ POST /api/auth/encrypt_existing_data/                         │  │
│  │ GET  /api/auth/user_security_status/                          │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                            │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  Encryption Manager                          │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  • AES-256-GCM encryption/decryption                        │   │
│  │  • Key generation                                            │   │
│  │  • Nonce management                                          │   │
│  │  • Error handling                                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               Session Encryption                             │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  • Fernet token encryption                                   │   │
│  │  • Session validation                                        │   │
│  │  • Timeout management                                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                File Encryption                               │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  • Upload encryption                                         │   │
│  │  • Decryption on-demand                                      │   │
│  │  • Secure storage                                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                         MODEL LAYER                                   │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────┐ │
│  │   Student Model     │  │  Educator Model     │  │ EncryptionKey│ │
│  ├─────────────────────┤  ├─────────────────────┤  │    Model     │ │
│  │ • mobile_self       │  │ • mobile            │  ├──────────────┤ │
│  │ • address           │  │ • email             │  │ • key_hash   │ │
│  │ • parent_phone      │  │ • mobile_encrypted  │  │ • is_active  │ │
│  │ • mobile_encrypted  │  │ • email_encrypted   │  │ • created_at │ │
│  │ • address_encrypted │  │ • encryption_key_id │  │ • rotated_at │ │
│  │ • parent_encrypted  │  │                     │  │              │ │
│  │ • encryption_key_id │  │ Methods:            │  └──────────────┘ │
│  │                     │  │ • encrypt_data()    │                   │
│  │ Methods:            │  │ • get_mobile()      │                   │
│  │ • encrypt_data()    │  │ • get_email()       │                   │
│  │ • get_mobile_self() │  │ • is_encrypted      │                   │
│  │ • get_address()     │  │                     │                   │
│  │ • get_parent_phone()│  │                     │                   │
│  │ • is_encrypted      │  │                     │                   │
│  └─────────────────────┘  └─────────────────────┘                   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                        DATABASE LAYER                                 │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                      MySQL Database                            │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  students                    educators                        │  │
│  │  ├─ id                       ├─ id                            │  │
│  │  ├─ mobile_self              ├─ mobile                        │  │
│  │  ├─ mobile_self_encrypted 🔒 ├─ mobile_encrypted 🔒           │  │
│  │  ├─ address                  ├─ email                         │  │
│  │  ├─ address_encrypted 🔒     ├─ email_encrypted 🔒            │  │
│  │  ├─ parent_phone             ├─ encryption_key_id            │  │
│  │  ├─ parent_phone_encrypted🔒 └─ ...                           │  │
│  │  ├─ encryption_key_id        │                                │  │
│  │  └─ ...                      │                                │  │
│  │                              │                                │  │
│  │  encryption_keys             │                                │  │
│  │  ├─ id                       │                                │  │
│  │  ├─ key_hash                 │                                │  │
│  │  ├─ is_active                │                                │  │
│  │  ├─ created_at               │                                │  │
│  │  └─ rotated_at               │                                │  │
│  │                              │                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Encryption Flow (Write Operation)

```
User Input (Plaintext)
        │
        ▼
┌───────────────────┐
│  Django View      │
│  (API Endpoint)   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Model Method     │
│  encrypt_data()   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ EncryptionManager │
│  • Get key        │
│  • Generate nonce │
│  • AES-256-GCM    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Encrypted Data   │
│  (Base64 encoded) │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  MySQL Database   │
│  (Stored safely)  │
└───────────────────┘
```

### 2. Decryption Flow (Read Operation)

```
Database Query
        │
        ▼
┌───────────────────┐
│  Encrypted Data   │
│  from Database    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Model Method     │
│  get_mobile()     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ EncryptionManager │
│  • Get key        │
│  • Extract nonce  │
│  • AES-256-GCM    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Plaintext Data   │
│  (Decrypted)      │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  API Response     │
│  (JSON)           │
└────────┬──────────┘
         │
         ▼
    User Display
```

### 3. Session Token Flow

```
User Login
    │
    ▼
┌─────────────────┐
│  Create Session │
│  Data (JSON)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SessionEncryption│
│  • Fernet key   │
│  • Encrypt      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Encrypted Token │
│ + Timestamp     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │
│  (Browser)      │
└────────┬────────┘
         │
         ▼
    On Each Request
         │
         ▼
┌─────────────────┐
│  Decrypt Token  │
│  Check Expiry   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
  Valid    Expired
    │         │
    ▼         ▼
  Allow    Logout
```

### 4. Key Rotation Flow

```
Admin Triggers Rotation
         │
         ▼
┌──────────────────────┐
│  Generate New Key    │
│  (AES-256)           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Mark Old Keys       │
│  as Inactive         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Save New Key        │
│  to encryption_keys  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Update .env         │
│  (Manual Step)       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Re-encrypt Data     │
│  (Optional/Manual)   │
└──────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Layer 7: Compliance                  │
│  GDPR | FERPA | PCI DSS | SOC 2 | ISO 27001            │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Layer 6: Monitoring                  │
│  Encryption Status | Key Rotation | Audit Logs         │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Layer 5: UI Security                 │
│  Security Indicators | Badges | Dashboard              │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Layer 4: Session                     │
│  Encrypted Tokens | 24hr Timeout | Secure Cleanup      │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Layer 3: API                         │
│  HTTPS | CORS | Authentication | Authorization         │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Layer 2: Data                        │
│  AES-256-GCM | Field-level Encryption | File Encryption│
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Layer 1: Password                    │
│  Argon2 | PBKDF2 | BCrypt | Salted Hashing            │
└─────────────────────────────────────────────────────────┘
```

## Component Interaction Map

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Student    │────────▶│   Django     │────────▶│   MySQL      │
│   Browser    │◀────────│   Backend    │◀────────│   Database   │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │                        │                         │
       ▼                        ▼                         ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ SessionMgr   │         │ Encryption   │         │ Encrypted    │
│ (Encrypted)  │         │ Manager      │         │ Fields       │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │                        │                         │
       ▼                        ▼                         ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ Security     │         │ Key          │         │ Encryption   │
│ Indicator    │         │ Management   │         │ Keys Table   │
└──────────────┘         └──────────────┘         └──────────────┘
```

## Encryption Algorithm Details

```
AES-256-GCM Encryption Process:
═══════════════════════════════

Input: Plaintext Data
  │
  ├─▶ Generate 12-byte Nonce (Random)
  │
  ├─▶ Get 32-byte Key (from .env)
  │
  ├─▶ AES-256-GCM Encrypt
  │     │
  │     ├─ Encryption (AES-256)
  │     ├─ Authentication (GCM)
  │     └─ Associated Data (AEAD)
  │
  ├─▶ Combine: Nonce + Ciphertext
  │
  └─▶ Base64 Encode

Output: Encrypted String (Safe for Database)


Decryption Process:
═══════════════════

Input: Encrypted String
  │
  ├─▶ Base64 Decode
  │
  ├─▶ Extract Nonce (first 12 bytes)
  │
  ├─▶ Extract Ciphertext (remaining bytes)
  │
  ├─▶ Get Key (from .env)
  │
  ├─▶ AES-256-GCM Decrypt
  │     │
  │     ├─ Verify Authentication Tag
  │     ├─ Decrypt Ciphertext
  │     └─ Return Plaintext
  │
  └─▶ Validate & Return

Output: Original Plaintext Data
```

## File Structure Visualization

```
Eduyata-collaboration/
│
├── 🔧 Backend (Django)
│   ├── auth_app/
│   │   ├── 🆕 encryption.py           ← Core encryption engine
│   │   ├── 🆕 encryption_views.py     ← API endpoints
│   │   ├── 📝 models.py               ← Enhanced models
│   │   └── 📝 urls.py                 ← New routes
│   │
│   ├── 🆕 add_encryption_fields.sql   ← Database migration
│   ├── 🆕 generate_encryption_keys.py ← Key generator
│   └── 🆕 test_encryption.py          ← Test suite
│
├── 🎨 Frontend (React)
│   ├── components/
│   │   ├── 🆕 SecurityIndicator.tsx   ← UI badges
│   │   └── 🆕 EncryptionDashboard.tsx ← Admin panel
│   │
│   └── utils/
│       └── 📝 sessionManager.ts       ← Enhanced security
│
└── 📚 Documentation
    ├── 🆕 ENCRYPTION_SETUP_GUIDE.md
    ├── 🆕 ENCRYPTION_README.md
    ├── 🆕 ENCRYPTION_CHECKLIST.md
    ├── 🆕 ENCRYPTION_IMPLEMENTATION_SUMMARY.md
    └── 🆕 ENCRYPTION_ARCHITECTURE.md (this file)

Legend: 🆕 New | 📝 Updated | 🔧 Backend | 🎨 Frontend | 📚 Docs
```

---

**This architecture provides enterprise-grade security with minimal performance impact!**

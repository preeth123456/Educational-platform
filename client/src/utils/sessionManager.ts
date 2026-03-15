// Enhanced Session Manager with Device Management
// Session Manager for Student and Teacher Authentication

// Simple encryption utilities for session tokens
const encryptToken = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data));
  } catch {
    return data;
  }
};

const decryptToken = (encrypted: string): string => {
  try {
    return decodeURIComponent(atob(encrypted));
  } catch {
    return encrypted;
  }
};

export interface StudentSession {
  id: number;
  student_id: string;
  name: string;
  phone: string;
  class: string;
  board: string;
  gender: string;
  profile_picture: string;
  profile_completed?: boolean;
  isLoggedIn: boolean;
  role?: string;
  session_token?: string;
  device_id?: string;
  current_context?: any;
}

export interface TeacherSession {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
  profile_completed?: boolean;
  session_token?: string;
  device_id?: string;
  current_context?: any;
}

export interface AdminSession {
  id: number;
  admin_id: string;
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
  session_token?: string;
  device_id?: string;
  current_context?: any;
}

export interface DeviceInfo {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  browser: string;
  os: string;
  is_trusted: boolean;
  last_used: string;
  created_at: string;
}

export interface SessionInfo {
  id: string;
  device_name: string;
  device_type: string;
  browser: string;
  os: string;
  ip_address: string;
  last_activity: string;
  created_at: string;
  is_current: boolean;
  is_trusted: boolean;
}

type UserSession = StudentSession | TeacherSession | AdminSession;

class SessionManager {
  private static STORAGE_KEY = 'eduyata_user_session';
  private static SESSION_TOKEN_KEY = 'eduyata_session_token';
  private static API_BASE = 'http://localhost:8001/api/session';

  private static SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  // Save session data with token
  static saveSession(userData: any, sessionToken?: string): void {
    let session: UserSession;

    if (userData.role === 'admin' || userData.admin_id) {
      session = {
        id: userData.id,
        admin_id: userData.admin_id,
        name: userData.name,
        email: userData.email,
        role: 'admin',
        isLoggedIn: true,
        session_token: sessionToken
      } as AdminSession;
    } else if (userData.role === 'teacher' || userData.teacherId) {
      session = {
        id: userData.id,
        teacherId: userData.teacherId,
        name: userData.name,
        email: userData.email,
        role: 'teacher',
        isLoggedIn: true,
        profile_completed: userData.profile_completed || false,
        session_token: sessionToken
      } as TeacherSession;
    } else {
      session = {
        id: userData.id,
        student_id: userData.student_id,
        name: userData.name,
        phone: userData.phone,
        class: userData.class,
        board: userData.board,
        gender: userData.gender || '',
        profile_picture: userData.profile_picture || '',
        profile_completed: userData.profile_completed || false,
        role: 'student',
        isLoggedIn: true,
        session_token: sessionToken
      } as StudentSession;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    if (sessionToken) {
      localStorage.setItem(this.SESSION_TOKEN_KEY, sessionToken);
    }
    
    const sessionData = {
      ...session,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.SESSION_TIMEOUT
    };
    
    const encrypted = encryptToken(JSON.stringify(sessionData));
    localStorage.setItem(this.STORAGE_KEY, encrypted);
    // Notify listeners that session has been updated
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sessionUpdated'));
    }
  }

  // Get current session with decryption
  static getSession(): UserSession | null {
    const encryptedData = localStorage.getItem(this.STORAGE_KEY);
    if (encryptedData) {
      try {
        const decrypted = decryptToken(encryptedData);
        const session = JSON.parse(decrypted);
        
        // Check session expiration
        if (session.expiresAt && Date.now() > session.expiresAt) {
          this.clearSession();
          return null;
        }
        
        return session.isLoggedIn ? session : null;
      } catch {
        this.clearSession();
        return null;
      }
    }
    return null;
  }

  // Get session token
  static getSessionToken(): string | null {
    return localStorage.getItem(this.SESSION_TOKEN_KEY);
  }

  // Enhanced logout with server-side session revocation
  static async logout(): Promise<void> {
    const sessionToken = this.getSessionToken();
    
    if (sessionToken) {
      try {
        await fetch(`${this.API_BASE}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_token: sessionToken })
        });
      } catch (error) {
        console.error('Failed to revoke session on server:', error);
      }
    }
    
    this.clearSession();
  }

  // Get active sessions
  static async getActiveSessions(): Promise<SessionInfo[]> {
    const session = this.getSession();
    const sessionToken = this.getSessionToken();
    
    if (!session || !sessionToken) return [];
    
    try {
      const response = await fetch(
        `${this.API_BASE}/sessions/active/?user_id=${session.id}&user_type=${session.role}&current_token=${sessionToken}`
      );
      const data = await response.json();
      return data.sessions || [];
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
      return [];
    }
  }

  // Revoke a specific session
  static async revokeSession(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/sessions/revoke/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to revoke session:', error);
      return false;
    }
  }

  // Get user devices
  static async getUserDevices(): Promise<DeviceInfo[]> {
    const session = this.getSession();
    if (!session) return [];
    
    try {
      const response = await fetch(
        `${this.API_BASE}/devices/list/?user_id=${session.id}&user_type=${session.role}`
      );
      const data = await response.json();
      return data.devices || [];
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      return [];
    }
  }

  // Trust a device
  static async trustDevice(deviceId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/devices/trust/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: deviceId })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to trust device:', error);
      return false;
    }
  }

  // Clear session
  static clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SESSION_TOKEN_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sessionUpdated'));
    }
  }

  // Get current context
  static getCurrentContext(): any {
    const session = this.getSession();
    return session?.current_context || null;
  }

  // Update session context
  static updateSessionContext(context: any): void {
    const session = this.getSession();
    if (session) {
      session.current_context = context;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('sessionUpdated'));
      }
    }
  }

  // Check if user has permission
  static hasPermission(permission: string): boolean {
    const context = this.getCurrentContext();
    return context?.permissions?.[permission] || false;
  }

  // Get user permissions
  static getUserPermissions(): Record<string, boolean> {
    const context = this.getCurrentContext();
    return context?.permissions || {};
  }

  // Existing methods for backward compatibility
  static getUserRole(): string | null {
    const session = this.getSession();
    return session?.role || null;
  }

  static isTeacher(): boolean {
    return this.getUserRole() === 'teacher';
  }

  static isStudent(): boolean {
    return this.getUserRole() === 'student';
  }

  static isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  static getStudentSession = this.getSession;

  static isLoggedIn(): boolean {
    const session = this.getSession();
    return session !== null && session.isLoggedIn;
  }

  // Get user name
  static getUserName(): string {
    const session = this.getSession();
    return session?.name || 'User';
  }

  static getStudentName(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return session.name || 'Student';
    }
    return 'Student';
  }

  static getStudentId(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return (session as StudentSession).student_id || '';
    }
    return '';
  }

  static getTeacherId(): string {
    const session = this.getSession();
    if (session?.role === 'teacher') {
      return (session as TeacherSession).teacherId || '';
    }
    return '';
  }

  static getStudentClass(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return (session as StudentSession).class || '';
    }
    return '';
  }

  static getStudentBoard(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return (session as StudentSession).board || '';
    }
    return '';
  }
}

export default SessionManager;
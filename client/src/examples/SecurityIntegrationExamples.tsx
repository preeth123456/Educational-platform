/**
 * INCIDENT DETECTION FILE - Security integration examples
 * Example Integration: Adding Security Indicators to Existing Components
 * 
 * This file shows how to integrate the SecurityIndicator component
 * into your existing student and teacher profile pages.
 */

// ============================================
// Example 1: Student Profile Page
// ============================================

import React from 'react';
import SecurityIndicator, { SecurityBadge } from '@/components/SecurityIndicator';

const StudentProfile = ({ student }) => {
  return (
    <div className="profile-container">
      {/* Header with Security Badge */}
      <div className="profile-header">
        <h1>{student.name}</h1>
        <SecurityBadge encrypted={student.is_data_encrypted} />
      </div>

      {/* Profile Information with Security Indicator */}
      <div className="profile-section">
        <div className="section-header">
          <h2>Personal Information</h2>
          <SecurityIndicator 
            userId={student.id} 
            userType="student" 
            showDetails={true} 
          />
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Phone Number</label>
            <div className="flex items-center gap-2">
              <span>{student.phone}</span>
              {student.is_data_encrypted && (
                <span className="text-xs text-green-600">🔒 Encrypted</span>
              )}
            </div>
          </div>

          <div className="info-item">
            <label>Address</label>
            <div className="flex items-center gap-2">
              <span>{student.address}</span>
              {student.is_data_encrypted && (
                <span className="text-xs text-green-600">🔒 Encrypted</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Example 2: Teacher Profile Page
// ============================================

const TeacherProfile = ({ teacher }) => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h1>{teacher.name}</h1>
          <p className="text-gray-600">{teacher.email}</p>
        </div>
        <SecurityIndicator 
          userId={teacher.id} 
          userType="teacher" 
          showDetails={true} 
        />
      </div>
    </div>
  );
};

// ============================================
// Example 3: Admin Dashboard Integration
// ============================================

import EncryptionDashboard from '@/components/EncryptionDashboard';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <EncryptionDashboard />
    </div>
  );
};

export { StudentProfile, TeacherProfile, AdminDashboard };

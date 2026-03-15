import React, { useState, useEffect } from 'react';
import { FaFlag } from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';

const AdminFeatureFlags: React.FC = () => {
  const [flags, setFlags] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState('');
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [selectedFlagUsage, setSelectedFlagUsage] = useState('');
  const [newFlag, setNewFlag] = useState({ name: '', description: '' });

  // Load flags and students
  useEffect(() => {
    loadFlags();
    loadStudents();
  }, []);

  const loadFlags = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/feature-flags/');
      const data = await response.json();
      if (data.success) setFlags(data.flags);
    } catch (error) {
      console.error('Failed to load flags:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/feature-flags/students/');
      const data = await response.json();
      if (data.success) setStudents(data.students);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  // 1. Create feature flag
  const createFlag = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/feature-flags/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlag)
      });
      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewFlag({ name: '', description: '' });
        loadFlags();
        alert('Feature flag created successfully!');
      }
    } catch (error) {
      console.error('Failed to create flag:', error);
    }
  };

  // 2. Toggle feature on/off
  const toggleFlag = async (flagName: string, enabled: boolean) => {
    try {
      const response = await fetch('http://localhost:8001/api/feature-flags/toggle/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag_name: flagName, enabled })
      });
      const data = await response.json();
      if (data.success) {
        loadFlags();
        alert(`Feature ${enabled ? 'enabled' : 'disabled'} successfully!`);
      }
    } catch (error) {
      console.error('Failed to toggle flag:', error);
    }
  };

  const loadUsageData = async (flagName: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/feature-flags/usage/?flag_name=${flagName}`);
      const data = await response.json();
      if (data.success) setUsageData(data.usage);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    }
  };
  const loadExistingAssignments = async (flagName: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/feature-flags/usage/?flag_name=${flagName}`);
      const data = await response.json();
      if (data.success) {
        // Get student IDs of already assigned users
        const assignedStudentIds = data.usage
          .filter((user: any) => user.assigned)
          .map((user: any) => {
            // Extract student_id from "Name (STU123)" format
            const match = user.student_name.match(/\(([^)]+)\)/);
            return match ? match[1] : null;
          })
          .filter(Boolean);
        
        setSelectedStudents(assignedStudentIds);
      }
    } catch (error) {
      console.error('Failed to load existing assignments:', error);
    }
  };

  const assignToUsers = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/feature-flags/assign/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flag_name: selectedFlag,
          user_ids: selectedStudents
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowAssignModal(false);
        setSelectedStudents([]);
        alert('Feature assigned to selected students!');
      }
    } catch (error) {
      console.error('Failed to assign feature:', error);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <FaFlag style={{ color: '#007bff', fontSize: '2rem' }} />
          Feature Flags Management
        </h1>
      
      {/* Create New Flag Button */}
      <button 
        onClick={() => setShowCreateModal(true)}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}
      >
        + Create Feature Flag
      </button>

      {/* Feature Flags Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Feature Name</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Description</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag: any) => (
            <tr key={flag.name}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{flag.name}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{flag.description}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  backgroundColor: flag.is_enabled ? '#28a745' : '#dc3545',
                  color: 'white'
                }}>
                  {flag.is_enabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => toggleFlag(flag.name, !flag.is_enabled)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: flag.is_enabled ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    marginRight: '8px'
                  }}
                >
                  {flag.is_enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => {
                    setSelectedFlag(flag.name);
                    loadExistingAssignments(flag.name);
                    setShowAssignModal(true);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    marginRight: '8px'
                  }}
                >
                  Assign Users
                </button>
                <button
                  onClick={() => {
                    setSelectedFlagUsage(flag.name);
                    loadUsageData(flag.name);
                    setShowUsageModal(true);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  View Usage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Flag Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3>Create New Feature Flag</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>Feature Name:</label>
              <input
                type="text"
                value={newFlag.name}
                onChange={(e) => setNewFlag({...newFlag, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px'
                }}
                placeholder="e.g., new_dashboard_ui"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Description:</label>
              <textarea
                value={newFlag.description}
                onChange={(e) => setNewFlag({...newFlag, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px',
                  height: '80px'
                }}
                placeholder="Describe what this feature does..."
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={createFlag}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Users Modal */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            <h3>Assign "{selectedFlag}" to Students</h3>
            <div style={{ marginBottom: '20px', maxHeight: '300px', overflow: 'auto' }}>
              {students.map((student: any) => (
                <div key={student.id} style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    {student.name} ({student.student_id})
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={assignToUsers}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Assign ({selectedStudents.length} students)
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedStudents([]);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Tracking Modal */}
      {showUsageModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '600px',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            <h3>Usage Tracking for "{selectedFlagUsage}"</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Student</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Assigned</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Last Used</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Usage Count</th>
                </tr>
              </thead>
              <tbody>
                {usageData.map((usage: any) => (
                  <tr key={usage.user_id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{usage.student_name}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <span style={{ color: usage.assigned ? 'green' : 'red' }}>
                        {usage.assigned ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {usage.last_used || 'Never'}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {usage.usage_count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setShowUsageModal(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminFeatureFlags;
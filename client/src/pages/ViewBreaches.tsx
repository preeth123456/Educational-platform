// INCIDENT DETECTION FILE - View and manage reported breaches
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

// BREACH NOTIFICATION FILES - This file displays breach reports for admin viewing

const ViewBreaches = () => {
  const [breaches, setBreaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBreaches();
  }, []);

  const fetchBreaches = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/breach/reports/');
      const data = await response.json();

      if (response.ok && Array.isArray(data.results)) {
        setBreaches(data.results);
      } else if (response.ok && Array.isArray(data)) {
        setBreaches(data);
      } else {
        setBreaches([]);
        setMessage('No breach data available');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const resolveBreach = async (breachId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/breach/reports/${breachId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'resolved' })
      });

      if (response.ok) {
        setMessage('Breach marked as resolved');
        fetchBreaches(); // Refresh the list
      } else {
        setMessage('Error resolving breach');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading breach reports...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Breach Reports</h1>
            <div className="text-sm text-gray-600">
              Total Reports: {breaches.length}
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md mb-6 ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {breaches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No breach reports found.
            </div>
          ) : (
            <div className="space-y-4">
              {breaches.map((breach) => (
                <div key={breach.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(breach.severity)}`}>
                          {breach.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(breach.status)}`}>
                          {breach.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          #{breach.id}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {breach.data_type} Breach
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {breach.description}
                      </p>
                    </div>
                    {breach.status !== 'resolved' && (
                      <button
                        onClick={() => resolveBreach(breach.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-semibold text-red-700 mb-2">Source Group (Data Leaked)</h4>
                      <p className="text-sm text-gray-600">
                        {breach.source_board} Class {breach.source_class}
                      </p>
                      <p className="text-sm font-medium text-red-600">
                        {breach.source_affected_count} students affected
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-orange-700 mb-2">Target Group (Received Wrong Data)</h4>
                      <p className="text-sm text-gray-600">
                        {breach.target_board} Class {breach.target_class}
                      </p>
                      <p className="text-sm font-medium text-orange-600">
                        {breach.target_affected_count} students affected
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div>
                      <span className="font-medium">Total Affected:</span> {breach.total_affected} students
                    </div>
                    <div>
                      <span className="font-medium">Reported by:</span> {breach.reported_by}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(breach.created_at).toLocaleDateString()}
                    </div>
                    {breach.resolved_at && (
                      <div>
                        <span className="font-medium">Resolved:</span> {new Date(breach.resolved_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewBreaches;
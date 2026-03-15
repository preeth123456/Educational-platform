import React, { useState } from 'react';

const GrievanceForm = ({ userId, userType, onSubmit }) => {
  console.log('GrievanceForm props:', { userId, userType }); // Debug log
  const [formData, setFormData] = useState({
    grievance_type: '',
    title: '',
    description: '',
    incident_date: '',
    respondent_id: '',
    respondent_type: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const grievanceTypes = [
    { value: 'academic', label: 'Academic Issue' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'unfair_treatment', label: 'Unfair Treatment' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing Dispute' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('complainant_id', String(userId));
    submitData.append('complainant_type', userType);
    Object.keys(formData).forEach(key => {
      if (formData[key]) submitData.append(key, formData[key]);
    });
    
    files.forEach(file => {
      submitData.append('evidence', file);
    });

    try {
      // Try proxy first, fallback to direct URL
      let response = await fetch('/api/collaboration/grievances/submit/', {
        method: 'POST',
        body: submitData
      });
      
      // If proxy fails (returns HTML), try direct Django URL
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        response = await fetch('http://localhost:8001/api/collaboration/grievances/submit/', {
          method: 'POST',
          body: submitData
        });
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        onSubmit?.(result);
        setFormData({
          grievance_type: '',
          title: '',
          description: '',
          incident_date: '',
          respondent_id: '',
          respondent_type: ''
        });
        setFiles([]);
      }
    } catch (error) {
      console.error('Error submitting grievance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Submit Grievance</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Grievance Type *</label>
          <select
            value={formData.grievance_type}
            onChange={(e) => setFormData({...formData, grievance_type: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select type</option>
            {grievanceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border rounded-lg h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Incident Date</label>
          <input
            type="datetime-local"
            value={formData.incident_date}
            onChange={(e) => setFormData({...formData, incident_date: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Evidence Files</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="w-full p-3 border rounded-lg"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload supporting documents (PDF, DOC, images)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Grievance'}
        </button>
      </form>
    </div>
  );
};

export default GrievanceForm;
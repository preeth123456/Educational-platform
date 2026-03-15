import React, { useState, useEffect } from 'react';
import { FaTrophy, FaTimes, FaCheck } from 'react-icons/fa';
import './CreateEndorsement.css';

interface Student {
  id: number;
  name: string;
}

interface CreateEndorsementProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacherId: number;
  preSelectedStudent?: Student;
}

const CreateEndorsement: React.FC<CreateEndorsementProps> = ({
  isOpen,
  onClose,
  onSuccess,
  teacherId,
  preSelectedStudent
}) => {
  const [formData, setFormData] = useState({
    student_id: preSelectedStudent?.id || 0,
    skill_name: '',
    skill_category: '',
    level: 'beginner',
    message: '',
    evidence_type: '',
    evidence_score: ''
  });
  const [availableSkills, setAvailableSkills] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableSkills();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preSelectedStudent) {
      setFormData(prev => ({
        ...prev,
        student_id: preSelectedStudent.id
      }));
    }
  }, [preSelectedStudent]);

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/endorsements/skills/');
      const data = await response.json();
      if (data.status === 'success') {
        setAvailableSkills(data.data.skills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/auth/endorsements/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          endorser_id: teacherId,
          endorser_type: 'teacher',
          evidence_score: formData.evidence_score ? parseFloat(formData.evidence_score) : null
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        onSuccess();
        onClose();
        setFormData({
          student_id: preSelectedStudent?.id || 0,
          skill_name: '',
          skill_category: '',
          level: 'beginner',
          message: '',
          evidence_type: '',
          evidence_score: ''
        });
      } else {
        alert('Error creating endorsement: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating endorsement:', error);
      alert('Error creating endorsement');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      skill_category: category,
      skill_name: ''
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="endorsement-modal-overlay" onClick={onClose}>
      <div className="endorsement-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaTrophy />
            Create Skill Endorsement
          </h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="endorsement-form">
          {preSelectedStudent && (
            <div className="selected-student">
              <strong>Student:</strong> {preSelectedStudent.name}
            </div>
          )}

          <div className="form-group">
            <label>Skill Category</label>
            <select
              value={formData.skill_category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {Object.keys(availableSkills).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Skill Name</label>
            <select
              value={formData.skill_name}
              onChange={(e) => setFormData(prev => ({ ...prev, skill_name: e.target.value }))}
              required
              disabled={!formData.skill_category}
            >
              <option value="">Select Skill</option>
              {formData.skill_category && availableSkills[formData.skill_category]?.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              required
            >
              <option value="beginner">Beginner ⭐</option>
              <option value="intermediate">Intermediate 🏅</option>
              <option value="advanced">Advanced 🏆</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Evidence Type</label>
              <select
                value={formData.evidence_type}
                onChange={(e) => setFormData(prev => ({ ...prev, evidence_type: e.target.value }))}
              >
                <option value="">None</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="project">Project</option>
                <option value="participation">Participation</option>
              </select>
            </div>

            <div className="form-group">
              <label>Evidence Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.evidence_score}
                onChange={(e) => setFormData(prev => ({ ...prev, evidence_score: e.target.value }))}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Add a personal message about this endorsement..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>Creating...</>
              ) : (
                <>
                  <FaCheck />
                  Create Endorsement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEndorsement;
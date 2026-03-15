import React, { useState } from "react";
import NewHeader from "@/components/NewHeader";
import { TeacherSidebarDemo } from "@/components/TeacherSidebar";
import "../Dashboard.css";
import "./CreateAssignment.css";

const CreateAssignment: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState<{
    title: string;
    class: string;
    type: string;
    dueDate: string;
    dueTime: string;
    maxPoints: string;
    duration: string;
    description: string;
    attachments: File[];
  }>({
    title: "",
    class: "",
    type: "Quiz",
    dueDate: "",
    dueTime: "23:59",
    maxPoints: "100",
    duration: "30",
    description: "",
    attachments: []
  });

  // Mock data for teacher
  const teacherData = {
    name: "Ms. Priya Sharma",
    role: "Teacher",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  // Mock classes data
  const classes = [
    "CS101 - Introduction to Programming",
    "CS201 - Data Structures",
    "CS304 - Web Development",
    "CS105 - Python Programming"
  ];

  // Assignment types
  const assignmentTypes = [
    "Assignment",
    "Project",
    "Lab"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileArray]
      }));
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileArray]
      }));
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (action: 'create' | 'draft' | 'cancel') => {
    if (action === 'create') {
      console.log('Creating assignment:', formData);
      // Handle assignment creation
    } else if (action === 'draft') {
      console.log('Saving as draft:', formData);
      // Handle draft saving
    } else {
      console.log('Cancelled');
      // Handle cancellation
    }
  };

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />


      <div className="dashboard-main" style={{ 
        marginLeft: sidebarOpen ? '250px' : '60px',
        transition: 'margin-left 0.3s ease',
        width: `calc(100% - ${sidebarOpen ? '250px' : '60px'})`
      }}>
        <NewHeader 
          avatar={teacherData.avatar} 
          name={teacherData.name} 
          role={teacherData.role} 
          searchPlaceholder="Search assignments..." 
          onSearch={(query) => console.log('Search:', query)} 
        />
        
        <div className="create-assignment-root">
          {/* Header Section */}
          <div className="create-assignment-header">
            <div className="create-assignment-title">
              <h1>Create Assignment</h1>
              <p>Prepare new assignments, quizzes, and projects for your students.</p>
            </div>
          </div>

          {/* Assignment Form */}
          <div className="assignment-form-container">
            <form className="assignment-form" onSubmit={(e) => e.preventDefault()}>
              {/* Assignment Title */}
              <div className="form-group">
                <label htmlFor="title">Assignment Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="e.g., JavaScript Fundamentals Quiz"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Class and Type Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="class">Class</label>
                  <select
                    id="class"
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a Class</option>
                    {classes.map((className, index) => (
                      <option key={index} value={className}>{className}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="type">Assignment Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="form-select"
                  >
                    {assignmentTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date and Time Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="form-input"
                    />
                    <span className="input-icon">📅</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dueTime">Due Time</label>
                  <div className="input-with-icon">
                    <input
                      type="time"
                      id="dueTime"
                      value={formData.dueTime}
                      onChange={(e) => handleInputChange('dueTime', e.target.value)}
                      className="form-input"
                    />
                    <span className="input-icon">🕐</span>
                  </div>
                </div>
              </div>

              {/* Points and Duration Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="maxPoints">Maximum Points</label>
                  <input
                    type="number"
                    id="maxPoints"
                    value={formData.maxPoints}
                    onChange={(e) => handleInputChange('maxPoints', e.target.value)}
                    className="form-input"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    type="number"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="form-input"
                    min="1"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Provide details about the assignment..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-textarea"
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label>Attachments</label>
                <div
                  className="file-upload-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">
                      <span className="upload-button">Choose Files</span>
                      <span className="upload-hint">or drop files here</span>
                    </div>
                  </label>
                </div>

                {/* File List */}
                {formData.attachments.length > 0 && (
                  <div className="file-list">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="remove-file-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => handleSubmit('create')}
                  className="btn-primary"
                >
                  Create Assignment
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('draft')}
                  className="btn-secondary"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('cancel')}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment; 
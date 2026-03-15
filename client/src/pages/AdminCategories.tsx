import React from 'react';
import { FaAward, FaPlus, FaEdit, FaTrash, FaArrowRight, FaTags, FaBook, FaGraduationCap } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminCategories: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Course Categories</h1>
                <p className="hero-subtitle">Organize and manage course categories, subjects, and learning paths</p>
              </div>
            </div>
          </div>

          {/* Categories Overview Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaTags />
              </div>
              <div className="stat-content">
                <h3>24</h3>
                <p>Total Categories</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>89</h3>
                <p>Courses Categorized</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaGraduationCap />
              </div>
              <div className="stat-content">
                <h3>156</h3>
                <p>Learning Paths</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaAward />
              </div>
              <div className="stat-content">
                <h3>12</h3>
                <p>Popular Categories</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Management Dashboard */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaTags className="section-icon" />
                <h2>Category Management</h2>
              </div>
              <button className="view-all-btn">
                Add New Category
                <FaPlus />
              </button>
            </div>

            {/* Categories Overview */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaBook />
                  </div>
                  <div className="summary-content">
                    <h3>Category Organization</h3>
                    <p>Well-structured categories help students discover relevant courses and learning paths</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">6</span>
                        <span className="stat-label">Main Categories</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">18</span>
                        <span className="stat-label">Subcategories</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">Hierarchical</span>
                        <span className="stat-label">Structure</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  Manage Categories
                  <FaArrowRight />
                </button>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📚</div>
                  <h4>Mathematics</h4>
                  <p>15 courses, 45 learning paths, most popular category</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🧪</div>
                  <h4>Science</h4>
                  <p>12 courses, 38 learning paths, growing rapidly</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">💻</div>
                  <h4>Technology</h4>
                  <p>18 courses, 52 learning paths, high engagement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Management Cards */}
          <div className="recommended-grid">
            <div className="management-card">
              <div className="management-header">
                <FaPlus className="management-icon" />
                <h3>Create Category</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Quick</span>
                  <span className="stat-label">Setup</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Template</span>
                  <span className="stat-label">Based</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Auto</span>
                  <span className="stat-label">Validation</span>
                </div>
              </div>
              <button className="management-btn">Create New Category</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaEdit className="management-icon" />
                <h3>Edit Categories</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">24</span>
                  <span className="stat-label">Active Categories</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Bulk</span>
                  <span className="stat-label">Operations</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Versioned</span>
                  <span className="stat-label">Changes</span>
                </div>
              </div>
              <button className="management-btn">Edit Categories</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaAward className="management-icon" />
                <h3>Popular Categories</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Top Categories</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">85%</span>
                  <span className="stat-label">Student Engagement</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Featured</span>
                  <span className="stat-label">Display</span>
                </div>
              </div>
              <button className="management-btn">View Analytics</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaGraduationCap className="management-icon" />
                <h3>Learning Paths</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">156</span>
                  <span className="stat-label">Total Paths</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Sequential</span>
                  <span className="stat-label">Progression</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Adaptive</span>
                  <span className="stat-label">Recommendations</span>
                </div>
              </div>
              <button className="management-btn">Manage Paths</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
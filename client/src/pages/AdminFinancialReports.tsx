import React, { useState } from 'react';
import { FaFileAlt, FaDollarSign, FaCreditCard, FaChartLine, FaArrowRight, FaDownload, FaUsers, FaBook, FaClock } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminFinancialReports: React.FC = () => {
  // Sample data for Student charts (aggregate data)
  const studentCompletionData = [
    { subject: 'STEM Subjects', completion: 82 },
    { subject: 'Languages', completion: 88 },
    { subject: 'Social Sciences', completion: 75 },
    { subject: 'Arts', completion: 79 },
    { subject: 'Professional Courses', completion: 85 },
  ];

  const studentAssessmentData = [
    { month: 'Jan', averageScore: 76, totalAssessments: 1250 },
    { month: 'Feb', averageScore: 78, totalAssessments: 1380 },
    { month: 'Mar', averageScore: 81, totalAssessments: 1420 },
    { month: 'Apr', averageScore: 79, totalAssessments: 1580 },
    { month: 'May', averageScore: 84, totalAssessments: 1650 },
    { month: 'Jun', averageScore: 87, totalAssessments: 1720 },
  ];

  const studentAssignmentData = [
    { name: 'Completed', value: 68, color: '#28a745' },
    { name: 'In Progress', value: 22, color: '#ffc107' },
    { name: 'Not Started', value: 10, color: '#dc3545' },
  ];

  // Sample data for Teacher charts (aggregate data)
  const teacherApprovalData = [
    { status: 'Approved', count: 156 },
    { status: 'Rejected', count: 23 },
    { status: 'Under Review', count: 12 },
    { status: 'Pending Documents', count: 8 },
  ];

  const teacherAssignmentData = [
    { month: 'Jan', totalStudents: 2450, activeTeachers: 89 },
    { month: 'Feb', totalStudents: 2680, activeTeachers: 92 },
    { month: 'Mar', totalStudents: 2890, activeTeachers: 95 },
    { month: 'Apr', totalStudents: 3120, activeTeachers: 98 },
    { month: 'May', totalStudents: 3350, activeTeachers: 102 },
    { month: 'Jun', totalStudents: 3580, activeTeachers: 105 },
  ];

  const teacherPerformanceData = [
    { month: 'Jan', avgRating: 4.2, totalReviews: 450 },
    { month: 'Feb', avgRating: 4.3, totalReviews: 520 },
    { month: 'Mar', avgRating: 4.1, totalReviews: 480 },
    { month: 'Apr', avgRating: 4.5, totalReviews: 610 },
    { month: 'May', avgRating: 4.4, totalReviews: 580 },
    { month: 'Jun', avgRating: 4.6, totalReviews: 650 },
  ];

  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

  // Generate Student PDF Report
  const generateStudentReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Student Performance Report', 20, 30);

    // Generated date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);

    let yPosition = 60;

    // Course Completion Rates Section
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('1. Course Completion Rates by Subject', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('Completion percentages across different subject categories:', 20, yPosition);
    yPosition += 10;

    // Table header
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text('Subject Category', 20, yPosition);
    doc.text('Completion Rate', 120, yPosition);
    yPosition += 5;

    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 180, yPosition);
    yPosition += 10;

    // Table data
    const completionData = [
      { subject: 'STEM Subjects', rate: '82%' },
      { subject: 'Languages', rate: '88%' },
      { subject: 'Social Sciences', rate: '75%' },
      { subject: 'Arts', rate: '79%' },
      { subject: 'Professional Courses', rate: '85%' }
    ];

    completionData.forEach(item => {
      doc.text(item.subject, 20, yPosition);
      doc.text(item.rate, 120, yPosition);
      yPosition += 8;
    });

    yPosition += 15;

    // Assessment Performance Section
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('2. Assessment Performance Trends', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('Monthly assessment scores and participation:', 20, yPosition);
    yPosition += 10;

    // Assessment table header
    doc.setFontSize(10);
    doc.text('Month', 20, yPosition);
    doc.text('Avg Score', 60, yPosition);
    doc.text('Total Assessments', 100, yPosition);
    yPosition += 5;

    doc.line(20, yPosition, 180, yPosition);
    yPosition += 10;

    // Assessment data
    const assessmentData = [
      { month: 'Jan', score: '76%', total: '1,250' },
      { month: 'Feb', score: '78%', total: '1,380' },
      { month: 'Mar', score: '81%', total: '1,420' },
      { month: 'Apr', score: '79%', total: '1,580' },
      { month: 'May', score: '84%', total: '1,650' },
      { month: 'Jun', score: '87%', total: '1,720' }
    ];

    assessmentData.forEach(item => {
      doc.text(item.month, 20, yPosition);
      doc.text(item.score, 60, yPosition);
      doc.text(item.total, 100, yPosition);
      yPosition += 8;
    });

    yPosition += 15;

    // Assignment Submissions Section
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('3. Assignment Submission Status', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('Current status of student assignment submissions:', 20, yPosition);
    yPosition += 10;

    // Assignment data
    const assignmentData = [
      { status: 'Completed', percentage: '68%' },
      { status: 'In Progress', percentage: '22%' },
      { status: 'Not Started', percentage: '10%' }
    ];

    assignmentData.forEach(item => {
      doc.text(`${item.status}: ${item.percentage}`, 20, yPosition);
      yPosition += 8;
    });

    // Save the PDF
    doc.save('student_performance_report.pdf');
  };

  // Generate Teacher PDF Report with Charts
  const generateTeacherReport = async () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Teacher Performance Report', 20, 30);

    // Generated date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);

    let yPosition = 60;

    try {
      // Capture and add Teacher Approval Chart
      const approvalChart = document.getElementById('teacher-approval-chart');
      if (approvalChart) {
        const approvalCanvas = await html2canvas(approvalChart, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        const approvalImgData = approvalCanvas.toDataURL('image/png');

        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('1. Teacher Approval Status', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('Bar chart showing teacher verification status counts:', 20, yPosition);
        yPosition += 10;

        // Add the chart image
        doc.addImage(approvalImgData, 'PNG', 20, yPosition, 170, 80);
        yPosition += 100;
      }

      // New page for Assignment Chart
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      // Capture and add Student-Teacher Assignment Chart
      const assignmentChart = document.getElementById('teacher-assignment-chart');
      if (assignmentChart) {
        const assignmentCanvas = await html2canvas(assignmentChart, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        const assignmentImgData = assignmentCanvas.toDataURL('image/png');

        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('2. Student-Teacher Assignments', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('Line chart showing monthly student assignments and active teachers:', 20, yPosition);
        yPosition += 10;

        // Add the chart image
        doc.addImage(assignmentImgData, 'PNG', 20, yPosition, 170, 80);
        yPosition += 100;
      }

      // New page for Performance Chart
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      // Capture and add Teacher Performance Chart
      const performanceChart = document.getElementById('teacher-performance-chart');
      if (performanceChart) {
        const performanceCanvas = await html2canvas(performanceChart, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        const performanceImgData = performanceCanvas.toDataURL('image/png');

        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('3. Teacher Performance Ratings', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('Line chart showing monthly teacher ratings and review counts:', 20, yPosition);
        yPosition += 10;

        // Add the chart image
        doc.addImage(performanceImgData, 'PNG', 20, yPosition, 170, 80);
      }

    } catch (error) {
      console.error('Error capturing teacher charts:', error);

      // Fallback: Generate PDF with data tables if chart capture fails
      yPosition = 60;

      // Teacher Approval Status Section
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('1. Teacher Approval Status', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text('Current status of teacher verification process:', 20, yPosition);
      yPosition += 10;

      // Approval table header
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text('Status', 20, yPosition);
      doc.text('Count', 120, yPosition);
      yPosition += 5;

      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, 180, yPosition);
      yPosition += 10;

      // Approval data
      const approvalData = [
        { status: 'Approved', count: '156' },
        { status: 'Rejected', count: '23' },
        { status: 'Under Review', count: '12' },
        { status: 'Pending Documents', count: '8' }
      ];

      approvalData.forEach(item => {
        doc.text(item.status, 20, yPosition);
        doc.text(item.count, 120, yPosition);
        yPosition += 8;
      });
    }

    // Save the PDF
    doc.save('teacher_performance_report.pdf');
  };

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Activity Reports</h1>
                <p className="hero-subtitle">Monitor learning activities, engagement stats, and performance metrics</p>
              </div>
            </div>
          </div>

          {/* Report Type Tabs */}
          <div className="report-tabs">
            <button
              className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <FaUsers className="tab-icon" />
              Student Reports
            </button>
            <button
              className={`tab-button ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => setActiveTab('teachers')}
            >
              <FaBook className="tab-icon" />
              Teacher Reports
            </button>
          </div>

          {/* Student Reports */}
          {activeTab === 'students' && (
            <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaUsers className="section-icon" />
                <h2>Student Reports</h2>
              </div>
              <button className="view-all-btn" onClick={generateStudentReport}>
                Generate Student Reports
                <FaDownload />
              </button>
            </div>

            {/* Course Completion Chart */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaBook />
                  </div>
                  <div className="summary-content">
                    <h3>Course Completion Rates</h3>
                    <p>Completion percentages across different subjects</p>
                    <div className="chart-container" id="student-completion-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studentCompletionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="completion"
                            fill="#007bff"
                            label={{ position: 'top', formatter: (value: number) => `${value}%` }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📚</div>
                  <h4>Highest Completion</h4>
                  <p>Languages show 88% completion rate</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">📊</div>
                  <h4>Average Rate</h4>
                  <p>81.8% overall course completion</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <h4>Improvement Area</h4>
                  <p>Social Sciences need attention (75%)</p>
                </div>
              </div>
            </div>

            {/* Assessment Performance Chart */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaChartLine />
                  </div>
                  <div className="summary-content">
                    <h3>Assessment Performance</h3>
                    <p>Average assessment scores over time</p>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={studentAssessmentData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="month"
                            axisLine={{ stroke: '#6b7280' }}
                            tickLine={{ stroke: '#6b7280' }}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                          />
                          <YAxis
                            yAxisId="left"
                            domain={[0, 100]}
                            axisLine={{ stroke: '#6b7280' }}
                            tickLine={{ stroke: '#6b7280' }}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#28a745' } }}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 2000]}
                            axisLine={{ stroke: '#6b7280' }}
                            tickLine={{ stroke: '#6b7280' }}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            label={{ value: 'Total Assessments', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#007bff' } }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="averageScore"
                            stroke="#28a745"
                            strokeWidth={3}
                            name="Average Score (%)"
                            dot={{ fill: '#28a745', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#28a745', strokeWidth: 2, fill: '#fff' }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="totalAssessments"
                            stroke="#007bff"
                            strokeWidth={3}
                            name="Total Assessments"
                            dot={{ fill: '#007bff', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#007bff', strokeWidth: 2, fill: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <h4>Performance Trend</h4>
                  <p>Average scores improved from 76% to 87%</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <h4>Assessment Volume</h4>
                  <p>1,720 assessments completed in June</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">📊</div>
                  <h4>Growth Rate</h4>
                  <p>15% increase in assessment participation</p>
                </div>
              </div>
            </div>

            {/* Assignment Submissions Chart */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaFileAlt />
                  </div>
                  <div className="summary-content">
                    <h3>Assignment Submissions</h3>
                    <p>Breakdown of assignment submission status</p>
                    <div className="chart-container" id="student-assignment-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={studentAssignmentData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {studentAssignmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">✅</div>
                  <h4>Submission Rate</h4>
                  <p>75% of assignments submitted on time</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">⏰</div>
                  <h4>Pending Tasks</h4>
                  <p>20% of assignments still pending</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">⚠️</div>
                  <h4>Overdue Alerts</h4>
                  <p>5% of assignments are overdue</p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Teacher Reports */}
          {activeTab === 'teachers' && (
            <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaUsers className="section-icon" />
                <h2>Teacher Reports</h2>
              </div>
              <button className="view-all-btn" onClick={generateTeacherReport}>
                Generate Teacher Reports
                <FaDownload />
              </button>
            </div>

            {/* Teacher Approval Status Chart */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaChartLine />
                  </div>
                  <div className="summary-content">
                    <h3>Teacher Approval Status</h3>
                    <p>Overview of teacher verification and approval process</p>
                    <div className="chart-container" id="teacher-approval-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={teacherApprovalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="status" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#17a2b8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">✅</div>
                  <h4>Approved Teachers</h4>
                  <p>156 teachers successfully approved</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">❌</div>
                  <h4>Rejections</h4>
                  <p>23 applications rejected</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">⏳</div>
                  <h4>Pending Review</h4>
                  <p>20 applications under review</p>
                </div>
              </div>
            </div>

            {/* Students Assigned to Teachers Chart */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaUsers />
                  </div>
                  <div className="summary-content">
                    <h3>Students Assigned to Teachers</h3>
                    <p>Monthly trend of student-teacher assignments</p>
                    <div className="chart-container" id="teacher-assignment-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={teacherAssignmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="totalStudents" stroke="#ffc107" strokeWidth={2} name="Total Students" />
                          <Line yAxisId="right" type="monotone" dataKey="activeTeachers" stroke="#17a2b8" strokeWidth={2} name="Active Teachers" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <h4>Growth Trend</h4>
                  <p>46% increase in total student enrollment</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">👥</div>
                  <h4>Current Enrollment</h4>
                  <p>3,580 students enrolled this month</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">📊</div>
                  <h4>Teacher Growth</h4>
                  <p>18% increase in active teaching staff</p>
                </div>
              </div>
            </div>

            {/* Teacher Performance Ratings Chart */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaClock />
                  </div>
                  <div className="summary-content">
                    <h3>Teacher Performance Ratings</h3>
                    <p>Monthly teacher performance and satisfaction ratings</p>
                    <div className="chart-container" id="teacher-performance-chart">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={teacherPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" domain={[0, 5]} />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="avgRating" stroke="#dc3545" strokeWidth={2} name="Average Rating" />
                          <Line yAxisId="right" type="monotone" dataKey="totalReviews" stroke="#28a745" strokeWidth={2} name="Total Reviews" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">⭐</div>
                  <h4>Average Rating</h4>
                  <p>4.38 out of 5 overall teacher performance</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <h4>Review Volume</h4>
                  <p>650 reviews collected in June</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🏆</div>
                  <h4>Peak Performance</h4>
                  <p>June shows highest ratings (4.6)</p>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancialReports;
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { usageTrackingService, UsageSummary } from '../services/usageTrackingService';
import UsageChart from '../components/UsageChart';
import { Search, Download, RefreshCw, Users, TrendingUp } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { FaChartLine } from 'react-icons/fa';

export default function AdminUsagePage() {
  const [allUsage, setAllUsage] = useState<UsageSummary[]>([]);
  const [filteredUsage, setFilteredUsage] = useState<UsageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsageData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allUsage.filter(
        (u) =>
          u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.userId.toString().includes(searchTerm)
      );
      setFilteredUsage(filtered);
    } else {
      setFilteredUsage(allUsage);
    }
  }, [searchTerm, allUsage]);

  const loadUsageData = async () => {
    setLoading(true);
    try {
      // Fetch all students' usage from backend
      const response = await fetch('http://localhost:8001/api/courses/all_students_usage/');
      const result = await response.json();
      
      if (result.status === 'success') {
        const usageData = result.data.map((student: any) => ({
          userId: student.student_id,
          userName: student.student_name,
          userType: 'student' as const,
          period: new Date().toISOString().slice(0, 7),
          coursesEnrolled: student.enrolled_courses || 0,
          videoWatchTime: student.total_video_time || 0,
          assignmentsSubmitted: student.assignments_submitted || 0,
          quizzesTaken: student.quizzes_taken || 0,
          storageUsed: student.storage_used || 0,
          liveClassesAttended: student.live_classes || 0,
          coursesCreated: 0,
          totalCost: 0 // Calculate based on usage
        }));
        setAllUsage(usageData);
        setFilteredUsage(usageData);
      } else {
        setAllUsage([]);
        setFilteredUsage([]);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
      setAllUsage([]);
      setFilteredUsage([]);
    }
    setLoading(false);
  };

  const handleExport = () => {
    const csv = [
      ['User ID', 'User Name', 'Type', 'Courses', 'Video Time (min)', 'Assignments', 'Quizzes', 'Cost (₹)'],
      ...filteredUsage.map((u) => [
        u.userId,
        u.userName,
        u.userType,
        u.coursesEnrolled,
        u.videoWatchTime,
        u.assignmentsSubmitted,
        u.quizzesTaken,
        u.totalCost.toFixed(2),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usage-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalRevenue = filteredUsage.reduce((sum, u) => sum + u.totalCost, 0);
  const totalUsers = filteredUsage.length;
  const totalVideoHours = filteredUsage.reduce((sum, u) => sum + u.videoWatchTime, 0) / 60;

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Usage Tracking & Metering</h1>
                <p className="hero-subtitle one-line">Monitor platform usage and billing metrics across all users</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={loadUsageData} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card primary">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
                <Users />
              </div>
              <div className="stat-content">
                <h3>{totalUsers}</h3>
                <p>Total Users</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #9333ea)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                <TrendingUp />
              </div>
              <div className="stat-content">
                <h3>₹{totalRevenue.toFixed(2)}</h3>
                <p>Total Revenue</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>{totalVideoHours.toFixed(0)}h</h3>
                <p>Video Hours</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #0284c7)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ marginTop: '2rem' }}>
            <UsageChart title="Platform Usage Trends" />
          </div>

          {/* Search and Filter */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaChartLine className="section-icon" />
                <h2>Usage Details</h2>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                <Input
                  placeholder="Search by user name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading usage data...</p>
                </div>
              ) : filteredUsage.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No usage data found. Generate mock data to test.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">User ID</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-right p-3">Courses</th>
                        <th className="text-right p-3">Video Time</th>
                        <th className="text-right p-3">Assignments</th>
                        <th className="text-right p-3">Quizzes</th>
                        <th className="text-right p-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsage.map((usage) => (
                        <tr key={usage.userId} className="border-b hover:bg-gray-50">
                          <td className="p-3">{usage.userId}</td>
                          <td className="p-3">{usage.userName}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                usage.userType === 'student'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {usage.userType}
                            </span>
                          </td>
                          <td className="text-right p-3">{usage.coursesEnrolled}</td>
                          <td className="text-right p-3">
                            {Math.floor(usage.videoWatchTime / 60)}h {usage.videoWatchTime % 60}m
                          </td>
                          <td className="text-right p-3">{usage.assignmentsSubmitted}</td>
                          <td className="text-right p-3">{usage.quizzesTaken}</td>
                          <td className="text-right p-3 font-semibold text-green-600">
                            ₹{usage.totalCost.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

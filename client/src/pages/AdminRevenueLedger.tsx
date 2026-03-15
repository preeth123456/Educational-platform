import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminSidebar from '@/components/AdminSidebar';
import { FaDownload, FaChartLine, FaMoneyBillWave, FaUsers, FaBook } from 'react-icons/fa';

export default function AdminRevenueLedger() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [courseFilter, setCourseFilter] = useState('all');

  const revenueData = {
    total: 245000,
    thisMonth: 45000,
    lastMonth: 38000,
    growth: 18.4,
    transactions: 156,
    students: 89,
    courses: 12
  };

  const courseRevenue = [
    { course: 'Python Basics', revenue: 45000, enrollments: 25, avgPrice: 1800 },
    { course: 'Web Development', revenue: 38000, enrollments: 20, avgPrice: 1900 },
    { course: 'Data Science', revenue: 52000, enrollments: 22, avgPrice: 2364 },
    { course: 'Machine Learning', revenue: 48000, enrollments: 18, avgPrice: 2667 },
    { course: 'React Masterclass', revenue: 35000, enrollments: 15, avgPrice: 2333 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 35000 },
    { month: 'Mar', revenue: 38000 },
    { month: 'Apr', revenue: 42000 },
    { month: 'May', revenue: 45000 },
    { month: 'Jun', revenue: 53000 }
  ];

  const exportReport = () => {
    const csv = [
      ['Course', 'Revenue', 'Enrollments', 'Avg Price'],
      ...courseRevenue.map(c => [c.course, c.revenue, c.enrollments, c.avgPrice])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-report.csv';
    a.click();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '250px' : '60px',
        transition: 'margin-left 0.3s ease',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Revenue & Transaction Ledger</h1>
            <Button onClick={exportReport} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaDownload /> Export Report
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaMoneyBillWave /> Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>₹{revenueData.total.toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>+{revenueData.growth}% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaChartLine /> This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{revenueData.thisMonth.toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{revenueData.transactions} transactions</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUsers /> Active Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{revenueData.students}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Paid enrollments</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaBook /> Revenue Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{revenueData.courses}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Generating revenue</div>
              </CardContent>
            </Card>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger style={{ width: '200px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger style={{ width: '200px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="python">Python Basics</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card style={{ marginBottom: '24px' }}>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
                {monthlyRevenue.map((item, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>₹{(item.revenue / 1000).toFixed(0)}k</div>
                    <div style={{ 
                      width: '100%', 
                      height: `${(item.revenue / 53000) * 100}%`, 
                      backgroundColor: '#8b5cf6',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }} />
                    <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>{item.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Course</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Revenue</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Enrollments</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Avg Price</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseRevenue.map((course, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontWeight: '500' }}>{course.course}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#10b981', fontWeight: '600' }}>₹{course.revenue.toLocaleString()}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{course.enrollments}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{course.avgPrice.toLocaleString()}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <div style={{ 
                              width: '60px', 
                              height: '6px', 
                              backgroundColor: '#e5e7eb', 
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{ 
                                width: `${(course.revenue / 52000) * 100}%`, 
                                height: '100%', 
                                backgroundColor: '#8b5cf6' 
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#666', minWidth: '35px' }}>
                              {((course.revenue / 218000) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

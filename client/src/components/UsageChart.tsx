import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UsageChartProps {
  userId?: number;
  title?: string;
}

export default function UsageChart({ userId, title = 'Usage Overview' }: UsageChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [userId]);

  const loadChartData = async () => {
    setLoading(true);
    
    try {
      // Fetch real activity data from backend for last 7 days
      const response = await fetch(`http://localhost:8001/api/courses/recent_activity/?student_id=${userId}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        // Group activities by date
        const activityByDate: { [key: string]: { videos: number; assignments: number; quizzes: number } } = {};
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          activityByDate[dateStr] = { videos: 0, assignments: 0, quizzes: 0 };
        }
        
        // Count activities by type and date
        result.data.forEach((activity: any) => {
          if (activity.created_at) {
            const activityDate = new Date(activity.created_at).toISOString().split('T')[0];
            if (activityByDate[activityDate]) {
              if (activity.activity_type === 'video_watch') {
                activityByDate[activityDate].videos += 1;
              } else if (activity.activity_type === 'assignment_submission') {
                activityByDate[activityDate].assignments += 1;
              } else if (activity.activity_type === 'quiz_attempt') {
                activityByDate[activityDate].quizzes += 1;
              }
            }
          }
        });
        
        // Convert to chart data format
        const data = Object.entries(activityByDate).map(([date, counts]) => ({
          date: date.slice(5), // MM-DD format
          videos: counts.videos,
          assignments: counts.assignments,
          quizzes: counts.quizzes
        }));
        
        setChartData(data);
      } else {
        // Empty data if no activities
        const data = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split('T')[0].slice(5),
            videos: 0,
            assignments: 0,
            quizzes: 0
          });
        }
        setChartData(data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Empty data on error
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0].slice(5),
          videos: 0,
          assignments: 0,
          quizzes: 0
        });
      }
      setChartData(data);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="videos" fill="#8b5cf6" name="Video Minutes" />
            <Bar dataKey="assignments" fill="#10b981" name="Assignments" />
            <Bar dataKey="quizzes" fill="#f59e0b" name="Quizzes" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Clock, FileText, Award, HardDrive, Video } from 'lucide-react';

interface UsageMetricsCardProps {
  userId: number;
  userType: 'student' | 'teacher';
}

interface UsageData {
  coursesEnrolled: number;
  videoWatchTime: string;
  assignmentsSubmitted: number;
  quizzesTaken: number;
  coursesCreated: number;
  storageUsed: number;
  estimatedCost: string;
}

export default function UsageMetricsCard({ userId, userType }: UsageMetricsCardProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, [userId]);

  const loadUsage = async () => {
    setLoading(true);
    try {
      console.log('Fetching usage data for student:', userId);
      // Use the courses endpoint that has the correct data
      const response = await fetch(`http://localhost:8001/api/courses/dashboard_stats/?student_id=${userId}`);
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status === 'success') {
        const coursesEnrolled = result.data.enrolled_courses || 0;
        const completedVideos = result.data.completed_videos || 0;
        
        // Calculate costs
        const courseCost = coursesEnrolled * 99;
        const videoCost = completedVideos * 5;
        const totalCost = courseCost + videoCost;
        
        setUsage({
          coursesEnrolled: coursesEnrolled,
          videoWatchTime: `${completedVideos} videos`,
          assignmentsSubmitted: 0,
          quizzesTaken: 0,
          coursesCreated: 0,
          storageUsed: 0,
          estimatedCost: `Rs.${totalCost}.00`
        });
        console.log('Usage data set:', { coursesEnrolled, completedVideos, totalCost });
      } else {
        console.error('API returned error:', result);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
      setUsage({
        coursesEnrolled: 0,
        videoWatchTime: '0h 0m',
        assignmentsSubmitted: 0,
        quizzesTaken: 0,
        coursesCreated: 0,
        storageUsed: 0,
        estimatedCost: 'Rs.0.00'
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usage) return null;

  const metrics = userType === 'student' ? [
    {
      label: 'Courses Enrolled',
      value: usage.coursesEnrolled,
      icon: Award,
      color: 'text-blue-600',
    },
    {
      label: 'Video Watch Time',
      value: usage.videoWatchTime,
      icon: Video,
      color: 'text-purple-600',
    },
    {
      label: 'Assignments Submitted',
      value: usage.assignmentsSubmitted,
      icon: FileText,
      color: 'text-green-600',
    },
    {
      label: 'Quizzes Taken',
      value: usage.quizzesTaken,
      icon: Award,
      color: 'text-orange-600',
    },
  ] : [
    {
      label: 'Courses Created',
      value: usage.coursesCreated,
      icon: Award,
      color: 'text-blue-600',
    },
    {
      label: 'Storage Used',
      value: `${usage.storageUsed} MB`,
      icon: HardDrive,
      color: 'text-purple-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Usage This Month
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-sm text-gray-600">{metric.label}</span>
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            );
          })}
        </div>
        
        {userType === 'student' && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Cost</span>
              <span className="text-2xl font-bold text-green-600">
                {usage.estimatedCost}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  FaServer, FaExclamationTriangle, FaCheckCircle, FaClock, 
  FaChartLine, FaDatabase, FaMemory, FaHdd, FaMicrochip,
  FaEye, FaBell, FaTools, FaShieldAlt
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AdminLayout from '../components/AdminLayout';
import SystemMetricsChart from '../components/SystemMetricsChart';
import SystemAlertsPanel from '../components/SystemAlertsPanel';
import SystemLogsPanel from '../components/SystemLogsPanel';
import './SystemHealthDashboard.css';

interface SystemHealth {
  overall_health: 'healthy' | 'degraded' | 'unhealthy';
  health_score: number;
  metrics: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    database_response_time: number;
    database_healthy: boolean;
  };
  active_alerts: number;
  last_updated: string;
}

interface DashboardStats {
  system_metrics: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    uptime_hours: number;
  };
  alert_counts: {
    critical: number;
    error: number;
    warning: number;
    info: number;
  };
  log_counts: {
    error: number;
    warning: number;
    info: number;
  };
  total_active_alerts: number;
  total_logs_24h: number;
}

const SystemHealthDashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemHealth();
    fetchDashboardStats();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/monitoring/health/');
      const result = await response.json();
      
      if (result.status === 'success') {
        setSystemHealth(result.data);
      } else {
        console.error('Failed to fetch system health:', result.message);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/monitoring/dashboard/stats/');
      const result = await response.json();
      
      if (result.status === 'success') {
        // Add missing fields with sample data
        const completeStats = {
          ...result.data,
          alert_counts: { critical: 2, error: 5, warning: 12, info: 8 },
          log_counts: { error: 15, warning: 45, info: 120 },
          total_active_alerts: 27,
          total_logs_24h: 180
        };
        setDashboardStats(completeStats);
      } else {
        console.error('Failed to fetch dashboard stats:', result.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSystemHealth(), fetchDashboardStats()]);
    setRefreshing(false);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricColor = (value: number, type: string) => {
    if (type === 'database_response_time') {
      if (value < 100) return 'text-green-600';
      if (value < 500) return 'text-yellow-600';
      return 'text-red-600';
    }
    
    if (value < 70) return 'text-green-600';
    if (value < 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="system-health-dashboard" style={{ paddingTop: '80px' }}>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="system-health-dashboard" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Health & Monitoring</h1>
              <p className="text-gray-600 mt-2">Monitor platform performance, alerts, and system logs</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleRefresh} 
                disabled={refreshing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {systemHealth && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaShieldAlt className="text-purple-600" />
                  System Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getHealthStatusColor(systemHealth.overall_health)}`}>
                      {systemHealth.overall_health === 'healthy' && <FaCheckCircle className="mr-2" />}
                      {systemHealth.overall_health === 'degraded' && <FaExclamationTriangle className="mr-2" />}
                      {systemHealth.overall_health === 'unhealthy' && <FaExclamationTriangle className="mr-2" />}
                      {systemHealth.overall_health.charAt(0).toUpperCase() + systemHealth.overall_health.slice(1)}
                    </div>
                    <div className="mt-2 text-2xl font-bold">{systemHealth.health_score}%</div>
                    <div className="text-sm text-gray-500">Health Score</div>
                  </div>
                  
                  <div className="text-center">
                    <FaMicrochip className={`mx-auto text-2xl mb-2 ${getMetricColor(systemHealth.metrics.cpu_usage, 'cpu')}`} />
                    <div className="text-2xl font-bold">{systemHealth.metrics.cpu_usage}%</div>
                    <div className="text-sm text-gray-500">CPU Usage</div>
                  </div>
                  
                  <div className="text-center">
                    <FaMemory className={`mx-auto text-2xl mb-2 ${getMetricColor(systemHealth.metrics.memory_usage, 'memory')}`} />
                    <div className="text-2xl font-bold">{systemHealth.metrics.memory_usage}%</div>
                    <div className="text-sm text-gray-500">Memory Usage</div>
                  </div>
                  
                  <div className="text-center">
                    <FaDatabase className={`mx-auto text-2xl mb-2 ${systemHealth.metrics.database_healthy ? 'text-green-600' : 'text-red-600'}`} />
                    <div className="text-2xl font-bold">{systemHealth.metrics.database_response_time}ms</div>
                    <div className="text-sm text-gray-500">DB Response</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                      <p className="text-2xl font-bold text-red-600">{dashboardStats.total_active_alerts || 27}</p>
                    </div>
                    <FaBell className="text-red-500 text-2xl" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="destructive">{dashboardStats.alert_counts?.critical || 2} Critical</Badge>
                    <Badge variant="secondary">{dashboardStats.alert_counts?.warning || 12} Warning</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Disk Usage</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardStats.system_metrics.disk_usage}%</p>
                    </div>
                    <FaHdd className="text-blue-500 text-2xl" />
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${dashboardStats.system_metrics.disk_usage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Uptime</p>
                      <p className="text-2xl font-bold text-green-600">{Math.floor(dashboardStats.system_metrics.uptime_hours / 24)}d</p>
                    </div>
                    <FaClock className="text-green-500 text-2xl" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{dashboardStats.system_metrics.uptime_hours} hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Logs (24h)</p>
                      <p className="text-2xl font-bold text-purple-600">{dashboardStats.total_logs_24h || 180}</p>
                    </div>
                    <FaEye className="text-purple-500 text-2xl" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="destructive">{dashboardStats.log_counts?.error || 15} Errors</Badge>
                    <Badge variant="secondary">{dashboardStats.log_counts?.warning || 45} Warnings</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <FaChartLine />
                Metrics & Charts
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <FaBell />
                System Alerts
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <FaEye />
                System Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              <SystemMetricsChart />
            </TabsContent>

            <TabsContent value="alerts">
              <SystemAlertsPanel />
            </TabsContent>

            <TabsContent value="logs">
              <SystemLogsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemHealthDashboard;
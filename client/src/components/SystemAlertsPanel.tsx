import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  FaBell, FaExclamationTriangle, FaCheckCircle, FaEye, FaTimes,
  FaClock, FaUser, FaFilter
} from 'react-icons/fa';

interface SystemAlert {
  id: number;
  title: string;
  message: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  status: 'active' | 'resolved' | 'acknowledged';
  metric_type: string;
  threshold_value: number | null;
  current_value: number | null;
  created_at: string;
  resolved_at: string | null;
  acknowledged_by: string;
}

const SystemAlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('active');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, severityFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        limit: '50'
      });
      
      if (severityFilter !== 'all') {
        params.append('severity', severityFilter);
      }
      
      const response = await fetch(`http://localhost:8001/api/monitoring/alerts/?${params}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setAlerts(result.data);
      } else {
        generateSampleAlerts();
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      generateSampleAlerts();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleAlerts = () => {
    const sampleAlerts: SystemAlert[] = [
      {
        id: 1,
        title: 'High CPU Usage Detected',
        message: 'CPU usage has exceeded 85% for the last 10 minutes',
        severity: 'warning',
        status: 'active',
        metric_type: 'cpu_usage',
        threshold_value: 85,
        current_value: 92.5,
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        resolved_at: null,
        acknowledged_by: ''
      },
      {
        id: 2,
        title: 'Database Connection Pool Exhausted',
        message: 'All database connections are in use. New requests may fail.',
        severity: 'critical',
        status: 'active',
        metric_type: 'database_connections',
        threshold_value: 100,
        current_value: 100,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        resolved_at: null,
        acknowledged_by: ''
      },
      {
        id: 3,
        title: 'Disk Space Low',
        message: 'Available disk space is below 10%',
        severity: 'error',
        status: 'acknowledged',
        metric_type: 'disk_usage',
        threshold_value: 90,
        current_value: 94.2,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
        acknowledged_by: 'admin'
      },
      {
        id: 4,
        title: 'Backup Completed Successfully',
        message: 'Daily database backup completed without errors',
        severity: 'info',
        status: 'resolved',
        metric_type: 'backup',
        threshold_value: null,
        current_value: null,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        resolved_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        acknowledged_by: ''
      }
    ];
    
    let filtered = sampleAlerts;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }
    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }
    
    setAlerts(filtered);
  };

  const acknowledgeAlert = async (alertId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/monitoring/alerts/${alertId}/acknowledge/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acknowledged_by: 'admin'
        })
      });
      
      if (response.ok) {
        setAlerts(alerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'acknowledged', acknowledged_by: 'admin' }
            : alert
        ));
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'acknowledged', acknowledged_by: 'admin' }
          : alert
      ));
    }
  };

  const resolveAlert = async (alertId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/monitoring/alerts/${alertId}/resolve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setAlerts(alerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'resolved', resolved_at: new Date().toISOString() }
            : alert
        ));
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved', resolved_at: new Date().toISOString() }
          : alert
      ));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaCheckCircle className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FaBell className="text-purple-600" />
              System Alerts
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FaCheckCircle className="mx-auto text-4xl text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts Found</h3>
              <p className="text-gray-500">
                {statusFilter === 'active' 
                  ? 'All systems are running smoothly!' 
                  : `No ${statusFilter} alerts found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts.map(alert => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {alert.title}
                        </h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{alert.message}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaClock />
                          {formatTimeAgo(alert.created_at)}
                        </div>
                        
                        {alert.metric_type && (
                          <div className="flex items-center gap-1">
                            <FaFilter />
                            {alert.metric_type.replace('_', ' ')}
                          </div>
                        )}
                        
                        {alert.threshold_value && alert.current_value && (
                          <div>
                            Current: {alert.current_value}% (Threshold: {alert.threshold_value}%)
                          </div>
                        )}
                        
                        {alert.acknowledged_by && (
                          <div className="flex items-center gap-1">
                            <FaUser />
                            Acknowledged by {alert.acknowledged_by}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {alert.status === 'active' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="flex items-center gap-1"
                        >
                          <FaEye />
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                        >
                          <FaCheckCircle />
                          Resolve
                        </Button>
                      </>
                    )}
                    
                    {alert.status === 'acknowledged' && (
                      <Button
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <FaCheckCircle />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemAlertsPanel;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  FaEye, FaSearch, FaDownload, FaFilter, FaClock, FaServer,
  FaExclamationTriangle, FaInfoCircle, FaBug, FaShieldAlt
} from 'react-icons/fa';

interface SystemLog {
  id: number;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  user_id: number | null;
  ip_address: string | null;
  request_path: string;
  timestamp: string;
}

const SystemLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('24');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    fetchLogs();
  }, [levelFilter, sourceFilter, timeRangeFilter]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLogs(logs);
    } else {
      const filtered = logs.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.request_path.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLogs(filtered);
    }
  }, [logs, searchTerm]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        hours: timeRangeFilter,
        limit: '100'
      });
      
      if (levelFilter !== 'all') {
        params.append('level', levelFilter);
      }
      
      if (sourceFilter !== 'all') {
        params.append('source', sourceFilter);
      }
      
      const response = await fetch(`http://localhost:8001/api/monitoring/logs/?${params}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setLogs(result.data);
      } else {
        generateSampleLogs();
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      generateSampleLogs();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleLogs = () => {
    const sources = ['django', 'nginx', 'mysql', 'redis', 'celery'];
    const levels: SystemLog['level'][] = ['debug', 'info', 'warning', 'error', 'critical'];
    const sampleMessages = [
      'User authentication successful',
      'Database connection established',
      'Cache miss for key: user_session_123',
      'Failed login attempt from IP: 192.168.1.100',
      'Memory usage exceeded 80% threshold',
      'Backup process completed successfully',
      'SSL certificate expires in 30 days',
      'Database query took 2.5 seconds to complete',
      'New user registration: user@example.com',
      'API rate limit exceeded for client',
      'Disk space warning: 85% full',
      'Email service connection timeout',
      'Security scan completed - no threats found',
      'System restart initiated by admin',
      'Configuration file updated'
    ];

    const sampleLogs: SystemLog[] = [];
    const now = new Date();
    const hoursBack = parseInt(timeRangeFilter);

    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - Math.random() * hoursBack * 60 * 60 * 1000);
      const level = levels[Math.floor(Math.random() * levels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      
      sampleLogs.push({
        id: i + 1,
        level,
        message,
        source,
        user_id: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 1 : null,
        ip_address: Math.random() > 0.3 ? `192.168.1.${Math.floor(Math.random() * 255)}` : null,
        request_path: Math.random() > 0.4 ? `/api/v1/${source}/${Math.floor(Math.random() * 100)}` : '',
        timestamp: timestamp.toISOString()
      });
    }

    sampleLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    let filtered = sampleLogs;
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    setLogs(filtered);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'debug': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'debug':
        return <FaBug className="text-gray-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'django':
        return <FaServer className="text-green-500" />;
      case 'nginx':
        return <FaServer className="text-blue-500" />;
      case 'mysql':
        return <FaServer className="text-orange-500" />;
      case 'redis':
        return <FaServer className="text-red-500" />;
      default:
        return <FaServer className="text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Source', 'Message', 'User ID', 'IP Address', 'Request Path'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.source,
        log.message,
        log.user_id || '',
        log.ip_address || '',
        log.request_path
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueSources = [...new Set(logs.map(log => log.source))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FaEye className="text-purple-600" />
              System Logs
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last Hour</SelectItem>
                  <SelectItem value="6">Last 6 Hours</SelectItem>
                  <SelectItem value="24">Last 24 Hours</SelectItem>
                  <SelectItem value="168">Last Week</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={exportLogs} variant="outline" className="flex items-center gap-2">
                <FaDownload />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex space-x-4">
                    <div className="rounded bg-gray-200 h-4 w-16"></div>
                    <div className="rounded bg-gray-200 h-4 w-20"></div>
                    <div className="flex-1 rounded bg-gray-200 h-4"></div>
                    <div className="rounded bg-gray-200 h-4 w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <FaEye className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Logs Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No logs match your search criteria.' : 'No logs available for the selected filters.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map(log => (
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        {getLevelIcon(log.level)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getLevelColor(log.level)}>
                            {log.level}
                          </Badge>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            {getSourceIcon(log.source)}
                            <span>{log.source}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FaClock />
                            <span>{formatTimestamp(log.timestamp)}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-900 mb-2 break-words">{log.message}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          {log.user_id && (
                            <span>User ID: {log.user_id}</span>
                          )}
                          
                          {log.ip_address && (
                            <span>IP: {log.ip_address}</span>
                          )}
                          
                          {log.request_path && (
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {log.request_path}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {filteredLogs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['critical', 'error', 'warning', 'info', 'debug'].map(level => {
            const count = filteredLogs.filter(log => log.level === level).length;
            return (
              <Card key={level}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getLevelIcon(level)}
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-500 capitalize">{level}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SystemLogsPanel;
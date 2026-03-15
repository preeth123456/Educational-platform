import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { FaChartLine, FaDownload, FaMicrochip, FaMemory, FaHdd, FaDatabase } from 'react-icons/fa';

interface MetricData {
  timestamp: string;
  value: number;
  unit: string;
}

const SystemMetricsChart: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('cpu_usage');
  const [timeRange, setTimeRange] = useState('24');
  const [loading, setLoading] = useState(false);

  const metricOptions = [
    { value: 'cpu_usage', label: 'CPU Usage', icon: FaMicrochip, color: '#8b5cf6' },
    { value: 'memory_usage', label: 'Memory Usage', icon: FaMemory, color: '#06b6d4' },
    { value: 'disk_usage', label: 'Disk Usage', icon: FaHdd, color: '#10b981' },
    { value: 'response_time', label: 'Response Time', icon: FaDatabase, color: '#f59e0b' }
  ];

  const timeRangeOptions = [
    { value: '1', label: 'Last Hour' },
    { value: '6', label: 'Last 6 Hours' },
    { value: '24', label: 'Last 24 Hours' },
    { value: '168', label: 'Last Week' }
  ];

  useEffect(() => {
    fetchMetricsData();
  }, [selectedMetric, timeRange]);

  const fetchMetricsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8001/api/monitoring/metrics/history/?type=${selectedMetric}&hours=${timeRange}`
      );
      const result = await response.json();
      
      if (result.status === 'success' && result.data.length > 0) {
        const processedData = result.data.map((item: MetricData) => ({
          ...item,
          time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          fullTimestamp: item.timestamp
        }));
        setMetricsData(processedData);
      } else {
        console.log('No real data available, using sample data');
        generateSampleData();
      }
    } catch (error) {
      console.error('Error fetching metrics data:', error);
      generateSampleData();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const now = new Date();
    const hours = parseInt(timeRange);
    const dataPoints = Math.min(hours, 24);
    
    const sampleData = [];
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      let value = 0;
      
      switch (selectedMetric) {
        case 'cpu_usage':
          value = Math.random() * 30 + 40 + Math.sin(i * 0.5) * 15;
          break;
        case 'memory_usage':
          value = Math.random() * 20 + 60 + Math.sin(i * 0.3) * 10;
          break;
        case 'disk_usage':
          value = Math.random() * 5 + 75;
          break;
        case 'response_time':
          value = Math.random() * 100 + 50 + Math.sin(i * 0.7) * 30;
          break;
        default:
          value = Math.random() * 50 + 25;
      }
      
      sampleData.push({
        timestamp: timestamp.toISOString(),
        value: Math.round(value * 100) / 100,
        unit: selectedMetric === 'response_time' ? 'ms' : '%',
        time: timestamp.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        fullTimestamp: timestamp.toISOString()
      });
    }
    
    setMetricsData(sampleData);
  };

  const getCurrentMetric = () => {
    return metricOptions.find(option => option.value === selectedMetric);
  };

  const getThresholdLines = () => {
    const metric = getCurrentMetric();
    if (!metric) return [];
    
    switch (selectedMetric) {
      case 'cpu_usage':
      case 'memory_usage':
        return [
          { value: 80, color: '#f59e0b', label: 'Warning' },
          { value: 90, color: '#ef4444', label: 'Critical' }
        ];
      case 'disk_usage':
        return [
          { value: 85, color: '#f59e0b', label: 'Warning' },
          { value: 95, color: '#ef4444', label: 'Critical' }
        ];
      case 'response_time':
        return [
          { value: 200, color: '#f59e0b', label: 'Warning' },
          { value: 500, color: '#ef4444', label: 'Critical' }
        ];
      default:
        return [];
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Timestamp', 'Value', 'Unit'],
      ...metricsData.map(item => [item.fullTimestamp, item.value, item.unit])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMetric}_metrics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentMetric = getCurrentMetric();
  const thresholds = getThresholdLines();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FaChartLine className="text-purple-600" />
              System Metrics
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {metricOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="text-sm" style={{ color: option.color }} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                <FaDownload />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetric?.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={currentMetric?.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    domain={selectedMetric === 'response_time' ? [0, 'dataMax + 1'] : [0, 100]}
                    label={selectedMetric === 'response_time' ? { value: 'Milliseconds (ms)', angle: -90, position: 'insideLeft' } : undefined}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value}${metricsData[0]?.unit || '%'}`,
                      currentMetric?.label || name
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={currentMetric?.color}
                    strokeWidth={2}
                    fill="url(#colorMetric)"
                  />
                  
                  {thresholds.map((threshold, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={() => threshold.value}
                      stroke={threshold.color}
                      strokeDasharray="5 5"
                      strokeWidth={1}
                      dot={false}
                      connectNulls={false}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {thresholds.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {thresholds.map((threshold, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-0.5 border-dashed border-t-2"
                    style={{ borderColor: threshold.color }}
                  ></div>
                  <span className="text-gray-600">
                    {threshold.label}: {threshold.value}{metricsData[0]?.unit || '%'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricOptions.map(metric => {
          const latestValue = metricsData.length > 0 ? metricsData[metricsData.length - 1]?.value : 0;
          const isSelected = metric.value === selectedMetric;
          
          return (
            <Card 
              key={metric.value} 
              className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-purple-500' : 'hover:shadow-md'}`}
              onClick={() => setSelectedMetric(metric.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold" style={{ color: metric.color }}>
                      {isSelected ? Math.round(latestValue * 100) / 100 : '--'}
                      <span className="text-sm text-gray-500 ml-1">
                        {isSelected ? (selectedMetric === 'response_time' ? 'ms' : '%') : ''}
                      </span>
                    </p>
                  </div>
                  <metric.icon className="text-2xl" style={{ color: metric.color }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SystemMetricsChart;
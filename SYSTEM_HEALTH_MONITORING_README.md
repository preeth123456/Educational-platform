# System Health, Monitoring & Logs Feature

## Overview

The System Health, Monitoring & Logs feature provides comprehensive visibility into platform performance and stability. It includes real-time system metrics, alerting, and centralized logging to ensure platform reliability and uptime.

## Features

### 🔍 System Health Dashboard
- **Real-time Metrics**: CPU, Memory, Disk usage, and Database response times
- **Health Score**: Overall system health percentage with visual indicators
- **Modern UI**: Clean, responsive dashboard with interactive charts
- **Auto-refresh**: Automatic updates every 30 seconds

### 📊 Advanced Metrics & Charts
- **Historical Data**: View metrics over different time periods (1h, 6h, 24h, 1 week)
- **Interactive Charts**: Modern area charts with threshold indicators
- **Multiple Metrics**: CPU, Memory, Disk, Database response time tracking
- **Export Functionality**: Download metrics data as CSV

### 🚨 Intelligent Alerting System
- **Severity Levels**: Critical, Error, Warning, Info alerts
- **Smart Thresholds**: Automatic alert generation based on configurable thresholds
- **Alert Management**: Acknowledge and resolve alerts with admin tracking
- **Real-time Notifications**: Immediate alerts for critical system issues

### 📝 Centralized Logging
- **Multi-source Logs**: Django, Nginx, MySQL, Redis, and custom application logs
- **Advanced Filtering**: Filter by log level, source, time range, and search terms
- **Real-time Search**: Instant search across all log messages
- **Export Capability**: Export filtered logs for analysis

## Architecture

### Backend Components

#### Models (`system_monitoring/models.py`)
- **SystemMetric**: Stores time-series metrics data
- **SystemAlert**: Manages system alerts and notifications
- **SystemLog**: Centralized logging storage
- **HealthCheck**: Service health status tracking

#### Views (`system_monitoring/views.py`)
- **Health Dashboard API**: Real-time system health data
- **Metrics API**: Historical metrics with filtering
- **Alerts API**: Alert management and CRUD operations
- **Logs API**: Log retrieval with advanced filtering

#### Management Commands
- **collect_metrics**: Automated system metrics collection
- Configurable collection intervals
- Automatic alert generation based on thresholds

### Frontend Components

#### Main Dashboard (`SystemHealthDashboard.tsx`)
- Modern React component with TypeScript
- Responsive design with Tailwind CSS
- Real-time data updates
- Tabbed interface for different views

#### Metrics Visualization (`SystemMetricsChart.tsx`)
- Interactive charts using Recharts library
- Multiple metric types with color coding
- Threshold indicators and warnings
- Export functionality

#### Alert Management (`SystemAlertsPanel.tsx`)
- Real-time alert display
- Severity-based color coding
- Alert acknowledgment and resolution
- Advanced filtering options

#### Log Viewer (`SystemLogsPanel.tsx`)
- Real-time log streaming
- Advanced search and filtering
- Multi-source log aggregation
- Export capabilities

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to Django backend directory
cd django_backend

# Install required dependencies
pip install psutil==5.9.8

# Run the setup script
python setup_system_monitoring.py
```

### 2. Manual Setup (Alternative)

```bash
# Add system_monitoring to INSTALLED_APPS in settings.py
# Run migrations
python manage.py makemigrations system_monitoring
python manage.py migrate

# Start metrics collection (optional)
python manage.py collect_metrics --interval 60
```

### 3. Frontend Integration

The frontend components are automatically integrated into the admin dashboard. Access via:
- **URL**: `/admin/system-health`
- **Menu**: Admin Sidebar → System Settings → System Health

## Usage

### Accessing the Dashboard

1. **Login as Admin**: Use admin credentials to access the platform
2. **Navigate**: Go to Admin Dashboard → System Settings → System Health
3. **Monitor**: View real-time metrics, alerts, and logs

### Metrics Collection

#### Automatic Collection
```bash
# Start continuous metrics collection
python manage.py collect_metrics

# Custom interval (default: 60 seconds)
python manage.py collect_metrics --interval 30

# One-time collection
python manage.py collect_metrics --once
```

#### Manual Collection
The system automatically collects metrics when accessing the dashboard, but for continuous monitoring, set up the management command as a background service.

### Alert Management

#### Viewing Alerts
- **Active Alerts**: Shows current system issues
- **Acknowledged**: Alerts that have been seen by admins
- **Resolved**: Completed alerts

#### Alert Actions
- **Acknowledge**: Mark alert as seen
- **Resolve**: Mark issue as fixed
- **Filter**: By severity, status, or time period

### Log Analysis

#### Filtering Options
- **Log Level**: Debug, Info, Warning, Error, Critical
- **Source**: Django, Nginx, MySQL, Redis, etc.
- **Time Range**: Last hour, 6 hours, 24 hours, week
- **Search**: Full-text search across messages

#### Export Features
- **CSV Export**: Download filtered logs
- **Metrics Export**: Download historical metrics data

## API Endpoints

### Health & Metrics
```
GET /api/monitoring/health/                    # System health overview
GET /api/monitoring/metrics/history/           # Historical metrics
GET /api/monitoring/dashboard/stats/           # Dashboard statistics
```

### Alerts
```
GET /api/monitoring/alerts/                    # List alerts
POST /api/monitoring/alerts/{id}/acknowledge/  # Acknowledge alert
POST /api/monitoring/alerts/{id}/resolve/      # Resolve alert
```

### Logs
```
GET /api/monitoring/logs/                      # List logs with filtering
```

## Configuration

### Thresholds
Default alert thresholds can be customized in the management command:

```python
# CPU Usage
if cpu_percent > 90:    # Critical
if cpu_percent > 80:    # Warning

# Memory Usage  
if memory_percent > 90: # Critical
if memory_percent > 80: # Warning

# Disk Usage
if disk_percent > 95:   # Critical
if disk_percent > 85:   # Warning
```

### Collection Intervals
- **Default**: 60 seconds
- **Minimum**: 10 seconds (not recommended for production)
- **Maximum**: No limit

## User Journey

### Platform Admin Workflow
1. **Login** → Access admin dashboard
2. **Monitor** → View system health overview
3. **Investigate** → Check metrics and logs for issues
4. **Respond** → Acknowledge/resolve alerts
5. **Analyze** → Export data for further analysis

### Organization Admin Workflow
1. **View** → Limited health indicators
2. **Report** → Escalate issues to platform admin

### Support User Workflow
1. **Respond** → React to incident alerts
2. **Investigate** → Use logs to diagnose issues
3. **Resolve** → Take corrective action

## Monitoring Best Practices

### 1. Regular Monitoring
- Check dashboard daily
- Set up automated alerts
- Monitor trends over time

### 2. Alert Management
- Acknowledge alerts promptly
- Investigate root causes
- Document resolutions

### 3. Log Analysis
- Regular log review
- Search for error patterns
- Export logs for compliance

### 4. Performance Optimization
- Monitor resource usage trends
- Plan capacity upgrades
- Optimize based on metrics

## Troubleshooting

### Common Issues

#### Metrics Not Collecting
```bash
# Check if psutil is installed
pip list | grep psutil

# Test manual collection
python manage.py collect_metrics --once

# Check database connectivity
python manage.py dbshell
```

#### Dashboard Not Loading
- Verify Django backend is running
- Check browser console for errors
- Ensure proper admin authentication

#### High Resource Usage
- Adjust collection intervals
- Archive old metrics data
- Optimize database queries

### Performance Considerations

#### Database Optimization
- Regular cleanup of old metrics (>30 days)
- Index optimization for time-based queries
- Consider time-series database for high-volume deployments

#### Frontend Performance
- Implement data pagination for large datasets
- Use WebSocket for real-time updates (future enhancement)
- Optimize chart rendering for mobile devices

## Future Enhancements

### Planned Features
- **WebSocket Integration**: Real-time updates without polling
- **Custom Dashboards**: User-configurable metric displays
- **Advanced Analytics**: Machine learning-based anomaly detection
- **Mobile App**: Native mobile monitoring application
- **Integration APIs**: Third-party monitoring tool integration

### Scalability Improvements
- **Time-series Database**: InfluxDB or TimescaleDB integration
- **Distributed Monitoring**: Multi-server metric collection
- **Cloud Integration**: AWS CloudWatch, Azure Monitor support

## Security Considerations

### Access Control
- Admin-only access to monitoring dashboard
- Role-based permissions for different admin levels
- Audit logging for all monitoring actions

### Data Privacy
- No sensitive user data in logs
- Configurable log retention periods
- Secure API endpoints with authentication

## Support & Maintenance

### Regular Tasks
- **Weekly**: Review alert trends and thresholds
- **Monthly**: Archive old metrics and logs
- **Quarterly**: Performance optimization review

### Monitoring the Monitor
- Set up external health checks
- Monitor the monitoring system itself
- Backup monitoring configuration

---

## Technical Specifications

### Dependencies
- **Backend**: Django 4.x, psutil 5.9.8
- **Frontend**: React 18, TypeScript, Recharts, Tailwind CSS
- **Database**: MySQL 8.0+ (with proper indexing)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Metrics
- **Dashboard Load Time**: < 2 seconds
- **Chart Rendering**: < 1 second
- **API Response Time**: < 500ms
- **Real-time Updates**: 30-second intervals

This comprehensive system monitoring solution ensures platform reliability, provides early warning of issues, and enables proactive maintenance for optimal user experience.
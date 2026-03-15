import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import './RemindersPanel.css';

interface Reminder {
  id: number;
  title: string;
  due_date: string;
  status: 'pending' | 'done' | 'snoozed';
  event_type: 'assessment' | 'class' | 'custom';
  created_at: string;
}

interface RemindersPanelProps {
  userId: number;
}

const RemindersPanel: React.FC<RemindersPanelProps> = ({ userId }) => {
  // Static reminders set by teachers/admins
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'Submit Web Development Assignment',
      due_date: '2025-01-17T14:00:00Z',
      status: 'pending',
      event_type: 'assessment',
      created_at: '2025-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Attend Mathematics Class',
      due_date: '2025-01-16T09:00:00Z',
      status: 'pending',
      event_type: 'class',
      created_at: '2025-01-15T08:00:00Z'
    },
    {
      id: 3,
      title: 'Complete React Project',
      due_date: '2025-01-20T23:59:00Z',
      status: 'pending',
      event_type: 'assessment',
      created_at: '2025-01-15T08:00:00Z'
    },
    {
      id: 4,
      title: 'Physics Lab Session',
      due_date: '2025-01-18T10:00:00Z',
      status: 'pending',
      event_type: 'class',
      created_at: '2025-01-15T08:00:00Z'
    },
    {
      id: 5,
      title: 'Submit Essay Draft',
      due_date: '2025-01-19T17:00:00Z',
      status: 'pending',
      event_type: 'assessment',
      created_at: '2025-01-15T08:00:00Z'
    }
  ]);





  const getTimeUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Due soon';
  };

  const activeReminders = reminders.filter(r => r.status === 'pending');

  return (
    <div className="reminders-panel">
      <div className="reminders-header">
        <h3><FaClock /> Reminders</h3>
      </div>

      <div className="reminders-list">
        {activeReminders.length === 0 ? (
          <div className="no-reminders">No active reminders</div>
        ) : (
          activeReminders.map(reminder => (
            <div key={reminder.id} className="reminder-item">
              <div className="reminder-content">
                <h4>{reminder.title}</h4>
                <span className="reminder-time">{getTimeUntilDue(reminder.due_date)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersPanel;

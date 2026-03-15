// Usage Tracking Service - Mock API with localStorage
// Tracks user activities for billing purposes

export type UsageAction = 
  | 'course_enrollment'
  | 'video_watch'
  | 'assignment_submission'
  | 'quiz_attempt'
  | 'live_class_attendance'
  | 'document_download'
  | 'storage_usage'
  | 'course_creation';

export interface UsageEvent {
  id: string;
  userId: number;
  userType: 'student' | 'teacher' | 'admin';
  action: UsageAction;
  resourceId: string;
  quantity: number;
  unit: 'minutes' | 'count' | 'MB' | 'GB';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UsageSummary {
  userId: number;
  userName: string;
  userType: 'student' | 'teacher';
  period: string;
  coursesEnrolled: number;
  videoWatchTime: number;
  assignmentsSubmitted: number;
  quizzesTaken: number;
  storageUsed: number;
  liveClassesAttended: number;
  coursesCreated: number;
  totalCost: number;
}

const STORAGE_KEY = 'eduyata_usage_events';

const PRICING = {
  courseEnrollment: 99,
  videoWatchHour: 5,
  storageGB: 10,
  liveClassHour: 50,
  courseCreation: 0, // Free for teachers
};

class UsageTrackingService {
  // Track a usage event
  trackUsage(event: Omit<UsageEvent, 'id' | 'timestamp'>): Promise<UsageEvent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent: UsageEvent = {
          ...event,
          id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        };

        const events = this.getStoredEvents();
        events.push(newEvent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

        resolve(newEvent);
      }, 300);
    });
  }

  // Get usage summary for a user
  getUserUsage(userId: number, period?: string): Promise<UsageSummary> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = this.getStoredEvents();
        const targetPeriod = period || this.getCurrentPeriod();
        
        const userEvents = events.filter(
          (e) => e.userId === userId && e.timestamp.startsWith(targetPeriod)
        );

        const summary = this.calculateSummary(userId, userEvents, targetPeriod);
        resolve(summary);
      }, 300);
    });
  }

  // Get all users' usage (for admin)
  getAllUsage(period?: string): Promise<UsageSummary[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = this.getStoredEvents();
        const targetPeriod = period || this.getCurrentPeriod();
        
        const periodEvents = events.filter((e) => 
          e.timestamp.startsWith(targetPeriod)
        );

        const userIds = [...new Set(periodEvents.map((e) => e.userId))];
        const summaries = userIds.map((userId) => {
          const userEvents = periodEvents.filter((e) => e.userId === userId);
          return this.calculateSummary(userId, userEvents, targetPeriod);
        });

        resolve(summaries);
      }, 500);
    });
  }

  // Get usage by date range
  getUsageByDateRange(startDate: string, endDate: string): Promise<UsageEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = this.getStoredEvents();
        const filtered = events.filter(
          (e) => e.timestamp >= startDate && e.timestamp <= endDate
        );
        resolve(filtered);
      }, 300);
    });
  }

  // Generate mock data for testing
  generateMockData(userId: number, userType: 'student' | 'teacher'): void {
    const mockEvents: Omit<UsageEvent, 'id' | 'timestamp'>[] = [];
    const now = new Date();

    if (userType === 'student') {
      // Course enrollments
      for (let i = 0; i < 5; i++) {
        mockEvents.push({
          userId,
          userType: 'student',
          action: 'course_enrollment',
          resourceId: `course_${i + 1}`,
          quantity: 1,
          unit: 'count',
          metadata: { courseName: `Course ${i + 1}` },
        });
      }

      // Video watch time
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        mockEvents.push({
          userId,
          userType: 'student',
          action: 'video_watch',
          resourceId: `video_${i + 1}`,
          quantity: Math.floor(Math.random() * 60) + 10,
          unit: 'minutes',
          metadata: { videoTitle: `Lecture ${i + 1}` },
        });
      }

      // Assignments
      for (let i = 0; i < 15; i++) {
        mockEvents.push({
          userId,
          userType: 'student',
          action: 'assignment_submission',
          resourceId: `assignment_${i + 1}`,
          quantity: 1,
          unit: 'count',
        });
      }

      // Quizzes
      for (let i = 0; i < 10; i++) {
        mockEvents.push({
          userId,
          userType: 'student',
          action: 'quiz_attempt',
          resourceId: `quiz_${i + 1}`,
          quantity: 1,
          unit: 'count',
        });
      }
    } else {
      // Teacher: courses created
      for (let i = 0; i < 3; i++) {
        mockEvents.push({
          userId,
          userType: 'teacher',
          action: 'course_creation',
          resourceId: `course_${i + 1}`,
          quantity: 1,
          unit: 'count',
          metadata: { courseName: `My Course ${i + 1}` },
        });
      }
    }

    // Save all mock events
    mockEvents.forEach((event) => {
      this.trackUsage(event);
    });
  }

  // Private helper methods
  private getStoredEvents(): UsageEvent[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getCurrentPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private calculateSummary(
    userId: number,
    events: UsageEvent[],
    period: string
  ): UsageSummary {
    const coursesEnrolled = events.filter((e) => e.action === 'course_enrollment').length;
    const videoWatchTime = events
      .filter((e) => e.action === 'video_watch')
      .reduce((sum, e) => sum + e.quantity, 0);
    const assignmentsSubmitted = events.filter((e) => e.action === 'assignment_submission').length;
    const quizzesTaken = events.filter((e) => e.action === 'quiz_attempt').length;
    const storageUsed = events
      .filter((e) => e.action === 'storage_usage')
      .reduce((sum, e) => sum + e.quantity, 0);
    const liveClassesAttended = events.filter((e) => e.action === 'live_class_attendance').length;
    const coursesCreated = events.filter((e) => e.action === 'course_creation').length;

    const userType = events[0]?.userType || 'student';

    const totalCost =
      coursesEnrolled * PRICING.courseEnrollment +
      (videoWatchTime / 60) * PRICING.videoWatchHour +
      (storageUsed / 1024) * PRICING.storageGB +
      liveClassesAttended * PRICING.liveClassHour;

    return {
      userId,
      userName: `User ${userId}`,
      userType,
      period,
      coursesEnrolled,
      videoWatchTime,
      assignmentsSubmitted,
      quizzesTaken,
      storageUsed,
      liveClassesAttended,
      coursesCreated,
      totalCost: Math.round(totalCost * 100) / 100,
    };
  }

  // Clear all usage data (for testing)
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const usageTrackingService = new UsageTrackingService();

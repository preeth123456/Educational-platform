import { useState, useCallback } from 'react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  difficulty: string;
  points: number;
  color: string;
}

interface BadgeCheckResult {
  newly_earned_badges: Badge[];
  count: number;
}

export const useBadgeService = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  const checkBadgeTriggers = useCallback(async (
    studentId: number,
    triggerType: string,
    context: any = {}
  ): Promise<Badge[]> => {
    setIsChecking(true);
    
    try {
      const response = await fetch('http://localhost:8001/api/auth/badges/check-triggers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          trigger_type: triggerType,
          context: context
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        const earnedBadges = data.data.newly_earned_badges;
        if (earnedBadges.length > 0) {
          setNewBadges(earnedBadges);
        }
        return earnedBadges;
      }
      
      return [];
    } catch (error) {
      console.error('Error checking badge triggers:', error);
      return [];
    } finally {
      setIsChecking(false);
    }
  }, []);

  const clearNewBadges = useCallback(() => {
    setNewBadges([]);
  }, []);

  // Trigger badge checks for common student actions
  const triggerLessonComplete = useCallback((studentId: number, context: any) => {
    return checkBadgeTriggers(studentId, 'lesson_complete', context);
  }, [checkBadgeTriggers]);

  const triggerQuizComplete = useCallback((studentId: number, context: any) => {
    return checkBadgeTriggers(studentId, 'quiz_complete', context);
  }, [checkBadgeTriggers]);

  const triggerCourseComplete = useCallback((studentId: number, context: any) => {
    return checkBadgeTriggers(studentId, 'course_complete', context);
  }, [checkBadgeTriggers]);

  const triggerVideoComplete = useCallback((studentId: number, context: any) => {
    return checkBadgeTriggers(studentId, 'video_complete', context);
  }, [checkBadgeTriggers]);

  const triggerStudyStreak = useCallback((studentId: number, context: any) => {
    return checkBadgeTriggers(studentId, 'study_streak', context);
  }, [checkBadgeTriggers]);

  return {
    isChecking,
    newBadges,
    clearNewBadges,
    checkBadgeTriggers,
    triggerLessonComplete,
    triggerQuizComplete,
    triggerCourseComplete,
    triggerVideoComplete,
    triggerStudyStreak
  };
};

export default useBadgeService;
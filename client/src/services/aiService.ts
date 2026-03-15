export interface StudyContent {
  topic: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class AIStudyService {
  private static instance: AIStudyService;
  private baseUrl = 'http://localhost:8001/api/ai';

  static getInstance(): AIStudyService {
    if (!AIStudyService.instance) {
      AIStudyService.instance = new AIStudyService();
    }
    return AIStudyService.instance;
  }

  async summarizeContent(content: StudyContent): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/summarize/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: content.topic,
          content: content.content,
          difficulty: content.difficulty
        })
      });
      const data = await response.json();
      return data.success ? data.summary : 'Error generating summary';
    } catch (error) {
      return 'AI service unavailable. Please try again later.';
    }
  }

  async explainTopic(topic: string, difficulty: string = 'intermediate'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/explain/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await response.json();
      return data.success ? data.explanation : 'Error generating explanation';
    } catch (error) {
      return 'AI service unavailable. Please try again later.';
    }
  }

  async generatePracticeQuestions(topic: string, count: number = 3): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/questions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count })
      });
      const data = await response.json();
      return data.success ? data.questions_text : 'Error generating questions';
    } catch (error) {
      return 'AI service unavailable. Please try again later.';
    }
  }

  async getStudyTips(topic: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/tips/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await response.json();
      return data.success ? data.tips : 'Error generating study tips';
    } catch (error) {
      return 'AI service unavailable. Please try again later.';
    }
  }
}

export const aiService = AIStudyService.getInstance();

interface NavigationCommand {
  command: string;
  user_id?: string;
  user_role?: string;
  is_quick_command?: boolean;
}

interface NavigationResponse {
  success: boolean;
  action: string;
  route?: string;
  message: string;
  suggestions?: string[];
}

interface Suggestion {
  text: string;
  command: string;
  type: string;
}

class NavigationService {
  private baseUrl = 'http://localhost:8001/api/ai';

  async processCommand(command: NavigationCommand): Promise<NavigationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/navigate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Navigation service error:', error);
      return {
        success: false,
        action: 'error',
        message: 'Sorry, I couldn\'t process that command right now. Please try again.',
      };
    }
  }

  async getSuggestions(userId?: string): Promise<Suggestion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suggestions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.suggestions : [];
    } catch (error) {
      console.error('Suggestions service error:', error);
      return this.getDefaultSuggestions();
    }
  }

  private getDefaultSuggestions(): Suggestion[] {
    return [
      { text: 'Hi', command: 'hi', type: 'greeting' },
      { text: 'Study tips', command: 'study tips', type: 'guidance' },
      { text: 'Find courses', command: 'show my courses', type: 'course' },
      { text: 'Check assignments', command: 'go to assignments', type: 'task' },
      { text: 'View progress', command: 'show my progress', type: 'progress' },
      { text: 'How to learn effectively', command: 'how to learn effectively', type: 'guidance' },
    ];
  }

  // Voice recognition utilities
  isVoiceSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  createSpeechRecognition(): any {
    if (!this.isVoiceSupported()) {
      return null;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    return recognition;
  }

  // Command parsing utilities
  parseQuickCommands(input: string): string | null {
    const lowerInput = input.toLowerCase().trim();
    
    // Course continuation commands
    if (lowerInput.includes('continue')) {
      if (lowerInput.includes('advanced calculus') || lowerInput.includes('calculus')) {
        return 'continue advanced calculus & applications';
      }
      if (lowerInput.includes('artificial intelligence') || lowerInput.includes('ai')) {
        return 'continue introduction to artificial intelligence';
      }
      if (lowerInput.includes('web development') || lowerInput.includes('bootcamp')) {
        return 'continue web development bootcamp';
      }
    }
    
    // Quick shortcuts
    const shortcuts: { [key: string]: string } = {
      'home': 'go to dashboard',
      'courses': 'show my courses',
      'assignments': 'show my assignments',
      'performance': 'show my progress',
      'settings': 'open my profile',
      'math': 'find math courses',
      'physics': 'find physics courses',
      'chemistry': 'find chemistry courses',
      'programming': 'find programming courses',
      'games': 'play games',
      'maze': 'play math maze',
      'chef': 'play fraction chef',
      'balloon': 'play fraction balloon',
      'help': 'help',
      'tips': 'study tips',
      'motivation': 'motivation tips',
      'learn': 'how to learn effectively',
    };

    return shortcuts[lowerInput] || null;
  }

  // Context-aware suggestions based on current page
  getContextualSuggestions(currentPath: string): Suggestion[] {
    const pathSuggestions: { [key: string]: Suggestion[] } = {
      '/dashboard': [
        { text: 'Study tips', command: 'study tips', type: 'guidance' },
        { text: 'Show my courses', command: 'show my courses', type: 'course' },
        { text: 'Check assignments', command: 'show assignments', type: 'task' },
        { text: 'Time management', command: 'time management', type: 'guidance' },
      ],
      '/courses': [
        { text: 'Course guidance', command: 'course guidance', type: 'guidance' },
        { text: 'Learning strategies', command: 'learning strategies', type: 'guidance' },
        { text: 'Check assignments', command: 'go to assignments', type: 'task' },
        { text: 'Back to dashboard', command: 'go to dashboard', type: 'navigation' },
      ],
      '/assignments': [
        { text: 'Study tips', command: 'study tips', type: 'guidance' },
        { text: 'Time management', command: 'time management', type: 'guidance' },
        { text: 'Go to courses', command: 'show my courses', type: 'course' },
        { text: 'Check progress', command: 'show my progress', type: 'progress' },
      ],
      '/performance': [
        { text: 'Motivation tips', command: 'motivation tips', type: 'guidance' },
        { text: 'Study strategies', command: 'study strategies', type: 'guidance' },
        { text: 'Go to courses', command: 'show my courses', type: 'course' },
        { text: 'Play games', command: 'play games', type: 'game' },
      ],
    };

    return pathSuggestions[currentPath] || this.getDefaultSuggestions();
  }
}

export const navigationService = new NavigationService();
export type { NavigationCommand, NavigationResponse, Suggestion };
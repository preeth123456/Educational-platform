import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { navigationService, type NavigationResponse, type Suggestion } from '../services/navigationService';

interface UseNavigationAIProps {
  userId?: string;
  userRole?: string;
  autoSuggestions?: boolean;
}

interface NavigationAIState {
  isListening: boolean;
  isProcessing: boolean;
  command: string;
  response: string;
  suggestions: Suggestion[];
  error: string | null;
}

export const useNavigationAI = ({ userId, userRole = 'student', autoSuggestions = true }: UseNavigationAIProps = {}) => {
  const [location, setLocation] = useLocation();
  const [state, setState] = useState<NavigationAIState>({
    isListening: false,
    isProcessing: false,
    command: '',
    response: '',
    suggestions: [],
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize speech recognition
  useEffect(() => {
    if (navigationService.isVoiceSupported()) {
      recognitionRef.current = navigationService.createSpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.trim();
          setState(prev => ({ ...prev, command: transcript, isListening: false }));
          // Process voice commands as quick commands (navigate directly)
          if (transcript) {
            processCommand(transcript, true);
          }
        };

        recognitionRef.current.onend = () => {
          setState(prev => ({ ...prev, isListening: false }));
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          let errorMessage = 'Voice recognition error. Please try typing your command.';
          
          if (event.error === 'no-speech') {
            errorMessage = 'No speech detected. Please try speaking again.';
          } else if (event.error === 'network') {
            errorMessage = 'Network error. Please check your connection.';
          } else if (event.error === 'not-allowed') {
            errorMessage = 'Microphone access denied. Please allow microphone access.';
          }
          
          setState(prev => ({ 
            ...prev, 
            isListening: false, 
            error: errorMessage
          }));
        };
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Load suggestions on mount and location change
  useEffect(() => {
    if (autoSuggestions) {
      loadSuggestions();
    }
  }, [location, userId, autoSuggestions]);

  const loadSuggestions = useCallback(async () => {
    try {
      const suggestions = await navigationService.getSuggestions(userId);
      const contextualSuggestions = navigationService.getContextualSuggestions(location);
      
      // Merge personalized and contextual suggestions
      const allSuggestions = [...suggestions, ...contextualSuggestions]
        .filter((suggestion, index, self) => 
          index === self.findIndex(s => s.command === suggestion.command)
        )
        .slice(0, 6); // Limit to 6 suggestions

      setState(prev => ({ ...prev, suggestions: allSuggestions }));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  }, [userId, location]);

  const processCommand = useCallback(async (inputCommand: string, isQuickCommand: boolean = false) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Check for quick shortcuts first
      const quickCommand = navigationService.parseQuickCommands(inputCommand);
      const commandToProcess = quickCommand || inputCommand;

      const result: NavigationResponse = await navigationService.processCommand({
        command: commandToProcess,
        user_id: userId,
        user_role: userRole,
        is_quick_command: isQuickCommand,
      });

      setState(prev => ({ ...prev, response: result.message, isProcessing: false }));

      if (result.success && result.action === 'navigate' && result.route) {
        // Show response briefly before navigating
        timeoutRef.current = setTimeout(() => {
          setLocation(result.route!);
          setState(prev => ({ ...prev, response: '', command: '' }));
        }, 1500);
      } else if (result.suggestions) {
        // Update suggestions with command-specific ones
        const newSuggestions = result.suggestions.map(s => ({
          text: s,
          command: s.toLowerCase(),
          type: 'suggestion'
        }));
        setState(prev => ({ ...prev, suggestions: newSuggestions }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Failed to process command. Please try again.',
        response: ''
      }));
    }
  }, [userId, userRole, setLocation]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      try {
        setState(prev => ({ ...prev, isListening: true, command: '', response: '', error: null }));
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setState(prev => ({ 
          ...prev, 
          isListening: false, 
          error: 'Failed to start microphone. Please try again.' 
        }));
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const setCommand = useCallback((command: string) => {
    setState(prev => ({ ...prev, command }));
  }, []);

  const clearResponse = useCallback(() => {
    setState(prev => ({ ...prev, response: '', error: null }));
  }, []);

  const executeCommand = useCallback((command: string) => {
    setState(prev => ({ ...prev, command }));
    processCommand(command, false); // Text input - provide suggestions
  }, [processCommand]);

  const executeQuickCommand = useCallback((command: string) => {
    setState(prev => ({ ...prev, command }));
    processCommand(command, true); // Quick command - navigate directly
  }, [processCommand]);

  return {
    // State
    ...state,
    isVoiceSupported: navigationService.isVoiceSupported(),
    
    // Actions
    startListening,
    stopListening,
    processCommand,
    setCommand,
    clearResponse,
    executeCommand,
    executeQuickCommand,
    loadSuggestions,
  };
};
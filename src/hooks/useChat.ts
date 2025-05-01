import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatState } from '../types';
import chatService from '../api/chatService';

const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    // Set up message listener
    chatService.onMessage((message: Message) => {
      setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    });

    // Set up loading state listener
    chatService.onLoading((isLoading: boolean) => {
      setState(prevState => ({
        ...prevState,
        isLoading,
      }));
    });

    // Set up error listener
    chatService.onError((error: string) => {
      setState(prevState => ({
        ...prevState,
        error,
        isLoading: false,
      }));
    });

    // Initial welcome message
    const welcomeMessage: Message = {
      id: uuidv4(),
      content: "Hello! I'm GlassChat AI. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    };

    setState(prevState => ({
      ...prevState,
      messages: [welcomeMessage],
    }));

    // Cleanup on unmount
    return () => {
      chatService.disconnect();
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Create and add user message to state
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // For demo purposes, we'll use the simulated response
      // In a real app, this would use chatService.sendMessage()
      const response = await chatService.simulateResponse(content);
      
      setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, response],
        isLoading: false,
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: typeof error === 'string' ? error : 'Failed to send message',
        isLoading: false,
      }));
    }
  }, []);

  const clearMessages = useCallback(() => {
    const welcomeMessage: Message = {
      id: uuidv4(),
      content: "Hello! I'm GlassChat AI. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    };

    setState({
      messages: [welcomeMessage],
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      error: null,
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
    clearError,
  };
};

export default useChat;
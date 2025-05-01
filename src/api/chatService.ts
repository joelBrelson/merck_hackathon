import { Message } from '../types';
import { io, Socket } from 'socket.io-client';

class ChatService {
  private socket: Socket | null = null;
  private messageCallback: ((message: Message) => void) | null = null;
  private loadingCallback: ((isLoading: boolean) => void) | null = null;
  private errorCallback: ((error: string) => void) | null = null;

  constructor() {
    this.initialize();
  }

  initialize() {
    // In a real app, you'd use an environment variable for the URL
    this.socket = io('http://localhost:3001');

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('message', (message: Message) => {
      if (this.messageCallback) {
        this.messageCallback(message);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      if (this.errorCallback) {
        this.errorCallback('Failed to connect to server. Please try again later.');
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      if (this.errorCallback) {
        this.errorCallback('An error occurred. Please try again.');
      }
    });
  }

  sendMessage(message: Omit<Message, 'id'>) {
    if (!this.socket?.connected) {
      if (this.errorCallback) {
        this.errorCallback('Not connected to server. Please try again.');
      }
      return Promise.reject('Not connected to server');
    }

    if (this.loadingCallback) {
      this.loadingCallback(true);
    }

    return new Promise<void>((resolve, reject) => {
      this.socket?.emit('message', message, (error: any) => {
        if (this.loadingCallback) {
          this.loadingCallback(false);
        }

        if (error) {
          if (this.errorCallback) {
            this.errorCallback(error);
          }
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  onMessage(callback: (message: Message) => void) {
    this.messageCallback = callback;
  }

  onLoading(callback: (isLoading: boolean) => void) {
    this.loadingCallback = callback;
  }

  onError(callback: (error: string) => void) {
    this.errorCallback = callback;
  }

  disconnect() {
    this.socket?.disconnect();
  }

  // For testing and demo purposes - simulate AI response
  async simulateResponse(message: string): Promise<Message> {
    if (this.loadingCallback) {
      this.loadingCallback(true);
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (this.loadingCallback) {
      this.loadingCallback(false);
    }

    const response: Message = {
      id: Math.random().toString(36).substring(2, 11),
      content: this.generateResponse(message),
      role: 'assistant',
      timestamp: new Date(),
    };

    return response;
  }

  private generateResponse(message: string): string {
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return "Hello! I'm GlassChat AI. How can I assist you today?";
    }
    
    if (message.toLowerCase().includes('help')) {
      return "I'd be happy to help! You can ask me questions, request information, or just chat. What would you like to know?";
    }
    
    if (message.toLowerCase().includes('feature') || message.toLowerCase().includes('do')) {
      return "I can have conversations, answer questions, provide information, and assist with various tasks. Currently, I'm a demo showing off the beautiful glassmorphism UI design.";
    }

    if (message.toLowerCase().includes('weather')) {
      return "I don't have real-time weather data in this demo, but in a full implementation, I could connect to a weather API to provide forecasts.";
    }

    return "That's an interesting message. In a complete implementation, I would connect to a more sophisticated backend to generate relevant responses. How else can I assist you with this demo?";
  }
}

export const chatService = new ChatService();
export default chatService;
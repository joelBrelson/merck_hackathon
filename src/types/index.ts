

export interface Message {
  id: string;
  message_text: string;
  source_agent: string;
  message_type: string;
  sender: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
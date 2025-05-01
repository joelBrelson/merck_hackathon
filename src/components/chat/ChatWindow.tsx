import React from 'react';
import { motion } from 'framer-motion';
import MessageList from './MessageList';
import ChatInput from '../input/ChatInput';
import { Message } from '../../types';
import { AlertTriangle, X } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onClearError: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearError,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col h-[70vh] md:h-[80vh] bg-white/30 backdrop-blur-lg rounded-xl border border-white/50 shadow-lg overflow-hidden"
    >
      {/* Error notification */}
      {error && (
        <div className="bg-error-500 text-white px-4 py-2 text-sm flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
          <button
            onClick={onClearError}
            className="text-white hover:text-error-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Messages area */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input area */}
      <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </motion.div>
  );
};

export default ChatWindow;
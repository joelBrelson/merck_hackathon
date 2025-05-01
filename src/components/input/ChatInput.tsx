import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SendHorizonal, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end rounded-lg backdrop-blur-sm bg-white/70 shadow-sm border border-gray-200/50 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-200 transition-all">
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isLoading}
          rows={1}
          className="block w-full px-4 py-3 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none"
          style={{ minHeight: '48px', maxHeight: '150px' }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`flex-shrink-0 p-3 mr-1 mb-1 rounded-md ${
            !message.trim() || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          } transition-colors`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default ChatInput;
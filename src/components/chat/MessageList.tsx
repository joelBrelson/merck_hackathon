import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message as MessageType } from '../../types';
import MessageItem from './Message';

interface MessageListProps {
  messages: MessageType[];
  dailaogfunction: (data:any)=> void;
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading,dailaogfunction }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);



  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-6">
      {messages.map((message) => (
        <motion.div
          key={message?.timestamp?.toString()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageItem message={message} dialogfunction={dailaogfunction} />
        </motion.div>
      ))}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-start"
        >
          <div className="bg-white/60 backdrop-blur-md rounded-lg max-w-[80%] p-4 shadow-sm border border-gray-200/50">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <div className="h-2 w-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
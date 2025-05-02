import React from 'react';
import { Message } from '../../types';
import { User, Bot,File,Download } from 'lucide-react';
import axios from 'axios';
import {nodedomain} from '../../config'

interface MessageItemProps {
  message: Message;
  dialogfunction: (data:any)=> void
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender!= 'agent';



  const downloadFile = async (filePath: string) => {
    const response = await axios.get(`${nodedomain}/downloadfile`,{
      "params":{
        filePath: filePath
      }
    });
    const data = response.data;
    
    
    if (data.url) {
      const a = document.createElement('a');
      a.href = data.url;
      a.download = ''; // optional: set filename
      a.target = '_blank';
      a.click();
    } else {
      alert('Failed to get download link');
    }
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
            isUser ? 'ml-3 bg-primary-500' : 'mr-3 bg-accent-500'
          }`}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        
        <div
          className={`
            ${
              isUser
                ? 'bg-primary-500 text-white rounded-t-lg rounded-bl-lg'
                : 'bg-white/60 backdrop-blur-md text-gray-800 rounded-t-lg rounded-br-lg border border-gray-200/50'
            }
            p-4 shadow-sm
          `}
        >
          
           { message?.message_type != 'generic' ? (
             
             <div className="text-sm whitespace-pre-wrap">{message?.message_text}
              <div className="text-red-blue text-md mt-1 flex flex-row items-center gap-2">
               {message?.message_type}
              
                  <File className="h-4 w-4 mr-1" />
                  <button onClick={()=>{downloadFile('users/a30rCFz2ExRrCEKUn59BR0eHbbp2/retrosynthesis/retrosyn/rebolt_agent_retrosythesis2329130710_flow_1.json')}} >
                    <Download className="h-4 w-4 mr-1" />
                  </button>
              </div>        
              </div>          
            )
            : <div className="text-sm whitespace-pre-wrap">{message?.message_text}</div>

          }
          <div
            className={`text-xs mt-1 ${
              isUser ? 'text-primary-200' : 'text-gray-400'
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (date: Date): string => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default MessageItem;
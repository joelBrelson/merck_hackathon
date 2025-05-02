import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatState } from '../types';
import chatService from '../api/chatService'; // Assuming this path is correct
import axios from 'axios';
import {nodedomain} from '../config'

// Helper to generate the initial welcome message
const createWelcomeMessage = (): Message => ({
  id: uuidv4(),
  message_text: "Hello! I'm GlassChat AI. How can I help you today?",
  message_type: "generic",
  sender: 'assistant',
  source_agent: 'synagents', // Corrected source_agent based on usage
  timestamp: new Date(),
});

const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // --- Refactored Initial Fetch Logic ---
  const fetchAndSetInitialMessages = useCallback(async () => {
      setState(prevState => ({ ...prevState, isLoading: true, error: null })); // Set loading before fetch
      try {
          const res = await axios.get(`${nodedomain}/getdoc/65fba10e7d3c2b1f0e8d6a54`, {
              params: { collection: 'AgentConversationLogs' },
          });
          console.log('Initial fetch result:', res);
          const Datas = res?.data?.data?.conversation;

          // Create welcome message
          const welcomeMessage = createWelcomeMessage();

          if (Array.isArray(Datas)) {
               setState(prevState => ({
                  ...prevState,
                  // Prepend the welcome message to the fetched history
                  messages: [welcomeMessage, ...Datas],
                  isLoading: false, // Turn off loading
              }));
          } else {
               console.warn('Initial fetch data is not an array:', Datas);
               setState(prevState => ({
                  ...prevState,
                  // Just show the welcome message if fetch fails or returns invalid data
                  messages: [welcomeMessage],
                  isLoading: false,
               }));
          }
      } catch (err: any) {
          console.error('Error fetching initial messages:', err);
          // Still show welcome message even on error
          const welcomeMessage = createWelcomeMessage();
          setState(prevState => ({
              ...prevState,
              error: err.response?.data?.message || err.message || 'Failed to load document',
              messages: [welcomeMessage], // Show welcome message on error
              isLoading: false, // Turn off loading
          }));
      }
  }, []); // Empty dependency array - this function is designed to run once

  // --- Main Effect for Setup and Cleanup ---
  useEffect(() => {
      console.log('useChat useEffect running'); // Confirm useEffect runs

      // --- Execute Initial Fetch ---
      // This will populate the messages state initially (including welcome message)
      fetchAndSetInitialMessages();

      // --- Set up Socket Listeners ---
      // Set up the SINGLE message listener that updates the whole array
      // KEEP THIS BLOCK:
      chatService.onMessage((updatedMessages: any[]) => { // Assuming ChatService passes the full array
          console.log('useChat messageCallback received:', updatedMessages);
           if (Array.isArray(updatedMessages)) {
              setState(prevState => ({
                ...prevState,
                // Directly assign the new array to replace the old one
                messages: updatedMessages,
              }));
           } else {
              console.warn('onMessage received non-array data:', updatedMessages);
           }
      });

      // --- REMOVE THE PROBLEMATIC SECOND LISTENER ---
      // This listener caused the array to be appended as a single item.
      // REMOVE THIS BLOCK entirely:
      // chatService.onMessage((message: any) => {
      //   setState(prevState => ({
      //     ...prevState,
      //     messages: [...prevState.messages, message],
      //   }));
      // });


      // Set up loading state listener
      chatService.onLoading((isLoading: boolean) => {
           console.log('onLoading triggered:', isLoading);
           setState(prevState => ({
               ...prevState,
               isLoading,
           }));
       });

      // Set up error listener
      chatService.onError((error: string | null) => { // Accept null to allow clearing error
           console.error('onError triggered:', error);
           setState(prevState => ({
               ...prevState,
               error,
               isLoading: false,
           }));
       });


      // --- Initialize the Chat Service ---
      // This connects the socket. Do this *after* setting up listeners.
      chatService.initialize();
      console.log('chatService.initialize() called from useEffect');


      // --- Cleanup on Unmount ---
      return () => {
          console.log('useChat useEffect cleanup running, disconnecting socket.');
          chatService.disconnect();
          // Optional: Clear callbacks in chatService on disconnect to prevent memory leaks
          // chatService.onMessage(null as any);
          // chatService.onLoading(null as any);
          // chatService.onError(null as any);
      };
  }, [fetchAndSetInitialMessages]); // Dependency array: fetchAndSetInitialMessages is used here

  // --- Moved welcome message logic into fetchAndSetInitialMessages ---
  // Removed the separate welcome message state update block from here.


  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: uuidv4(), // Ensure message ID is unique
      message_text: content,
      source_agent: '', // Assuming user messages have no source_agent or similar
      message_type: 'generic', // Or a specific type for user messages
      sender: 'user',
      timestamp: new Date(),
    };


     setState(prevState => ({
       ...prevState,
       messages: [...prevState.messages, userMessage],
       isLoading: true, // Set loading while waiting for AI response
       error: null,
     }));


    try {
      

      await axios.put(`${nodedomain}/messageinsert`,{
         id:'65fba10e7d3c2b1f0e8d6a54',
         collectionsUsed:'AgentConversationLogs',
         fieldname:'conversation',
         data: userMessage // Use the userMessage object created above
      });
      console.log('User message inserted via PUT');

       const aiResponse = await axios.post('https://vrzcr3naj7.execute-api.us-east-1.amazonaws.com/newstage/synagentsv4',
         {
           user_input: {
             query: content,
             conv_id: "65fba10e7d3c2b1f0e8d6a54"
           },
           task_name: "synagents"
         });
       console.log('AI trigger POST successful:', aiResponse.data);
       
        setState(prevState => ({
            ...prevState,
            isLoading: false, // Turn off loading after sending message/triggering AI
            error: null,
        }));


    } catch (error: any) {
      console.error('Error sending message or triggering AI:', error);
      // Rollback optimistic user message if needed, or just show error
      setState(prevState => ({
        ...prevState,
        error: error.response?.data?.message || error.message || 'Failed to send message',
        isLoading: false,
         // Optional: Remove the optimistically added user message if the send failed
         // messages: prevState.messages.filter(msg => msg.id !== userMessage.id)
      }));
    }
  }, []); // Dependencies: If userMessage structure or state updates depend on other hooks/props, add them here

  // clearMessages logic seems fine as is, it resets to just the welcome message
  const clearMessages = useCallback(() => {
     const welcomeMessage = createWelcomeMessage();
     setState({
       messages: [welcomeMessage],
       isLoading: false,
       error: null,
     });
  }, []); // Dependencies might be needed if createWelcomeMessage used external values

  // clearError logic seems fine as is
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
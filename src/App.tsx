import AppLayout from './components/layout/AppLayout';
import ChatWindow from './components/chat/ChatWindow';
import useChat from './hooks/useChat';

function App() {
  const { messages, isLoading, error, sendMessage, clearError } = useChat();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Chat with AI Assistant
        </h2>
        <ChatWindow 
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={sendMessage}
          onClearError={clearError}
        />
        <p className="mt-4 text-center text-sm text-gray-500">
          This is a demonstration of a glassmorphism chat UI. Type a message to see the AI respond.
        </p>
      </div>
    </AppLayout>
  );
}

export default App;
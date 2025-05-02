import React from 'react';
import { MessageCircle } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background shapes for visual interest */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-[20%] w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-success-200 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="backdrop-blur-md bg-slate-400/70 border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-primary-600" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900">Boltzmann synthesis</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
import React, { useState } from 'react';
import { MessageSquare, CheckSquare, FileText, Settings } from 'lucide-react';
import Chat from './components/Chat';
import Tasks from './components/Tasks';
import Notes from './components/Notes';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">Radhee</h1>
          <p className="text-purple-200 text-xs md:text-base">Your intelligent companion for tasks, notes, and conversations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-4 md:mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 flex gap-1 md:gap-2 w-full md:w-auto overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200 flex-1 md:flex-none ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} className="md:hidden" />
                  <Icon size={20} className="hidden md:block" />
                  <span className="text-xs md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-2xl">
          {activeTab === 'chat' && <Chat />}
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'notes' && <Notes />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}

export default App;

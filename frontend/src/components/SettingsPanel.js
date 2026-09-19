import React, { useState } from 'react';
import { Save, RefreshCw, Info } from 'lucide-react';

function SettingsPanel() {
  const [settings, setSettings] = useState({
    aiProvider: 'openai',
    openaiApiKey: '',
    openaiModel: 'gpt-4',
    ollamaBaseUrl: 'http://localhost:11434',
    ollamaModel: 'llama2',
    voiceEnabled: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend or localStorage
    localStorage.setItem('aiSettings', JSON.stringify(settings));
    alert('Settings saved! (In production, this would update the backend .env file)');
  };

  const handleReset = () => {
    setSettings({
      aiProvider: 'openai',
      openaiApiKey: '',
      openaiModel: 'gpt-4',
      ollamaBaseUrl: 'http://localhost:11434',
      ollamaModel: 'llama2',
      voiceEnabled: true
    });
  };

  return (
    <div className="flex flex-col h-[600px]">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        {/* AI Provider */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">AI Provider</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-white">
              <input
                type="radio"
                name="aiProvider"
                value="openai"
                checked={settings.aiProvider === 'openai'}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>OpenAI (GPT-4, GPT-3.5)</span>
            </label>
            <label className="flex items-center gap-3 text-white">
              <input
                type="radio"
                name="aiProvider"
                value="ollama"
                checked={settings.aiProvider === 'ollama'}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Ollama (Local LLM)</span>
            </label>
          </div>
        </div>

        {/* OpenAI Settings */}
        {settings.aiProvider === 'openai' && (
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">OpenAI Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">API Key</label>
                <input
                  type="password"
                  name="openaiApiKey"
                  value={settings.openaiApiKey}
                  onChange={handleChange}
                  placeholder="sk-..."
                  className="w-full bg-white/20 text-white placeholder-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-2">Model</label>
                <select
                  name="openaiModel"
                  value={settings.openaiModel}
                  onChange={handleChange}
                  className="w-full bg-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Ollama Settings */}
        {settings.aiProvider === 'ollama' && (
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Ollama Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Base URL</label>
                <input
                  type="text"
                  name="ollamaBaseUrl"
                  value={settings.ollamaBaseUrl}
                  onChange={handleChange}
                  className="w-full bg-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-2">Model</label>
                <input
                  type="text"
                  name="ollamaModel"
                  value={settings.ollamaModel}
                  onChange={handleChange}
                  className="w-full bg-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Voice Settings */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Voice Features</h3>
          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              name="voiceEnabled"
              checked={settings.voiceEnabled}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Enable Voice Input/Output</span>
          </label>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-start gap-3">
            <Info className="text-blue-300 mt-1" size={20} />
            <div>
              <h4 className="text-blue-200 font-semibold mb-1">Setup Instructions</h4>
              <p className="text-blue-300 text-sm">
                To configure the AI provider, update the <code className="bg-blue-500/20 px-1 rounded">.env</code> file in the backend directory with your API keys and settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save size={18} />
          Save Settings
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
        >
          <RefreshCw size={18} />
          Reset
        </button>
      </div>
    </div>
  );
}

export default SettingsPanel;

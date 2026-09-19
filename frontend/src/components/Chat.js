import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Trash2, Paperclip } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !attachedFile) return;

    const userMessage = input;
    setInput('');
    setAttachedFile(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage, file: attachedFile }]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userMessage);
      if (attachedFile) {
        formData.append('file', attachedFile);
      }

      const response = await axios.post(`${API_URL}/api/chat`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check if the backend is running.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = async () => {
    try {
      await axios.delete(`${API_URL}/api/conversations`);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const startRecording = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      alert('Speech recognition error: ' + event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">AI Chat</h2>
        <button
          onClick={clearConversation}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <Trash2 size={18} />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center text-purple-200 py-20">
            <p className="text-lg">Start a conversation with your AI assistant</p>
            <p className="text-sm mt-2">Ask me anything about tasks, notes, or general questions!</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              {message.file && (
                <div className="mb-2 p-2 bg-white/10 rounded-lg">
                  <p className="text-sm font-medium">📎 {message.file.name}</p>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/20 rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <button
          onClick={startRecording}
          className={`p-3 rounded-xl transition-colors ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Mic size={20} />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className={`p-3 rounded-xl transition-colors ${
            attachedFile
              ? 'bg-purple-600 text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Paperclip size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx"
        />

        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full bg-white/20 text-white placeholder-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          {attachedFile && (
            <div className="absolute top-full left-0 mt-2 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <span className="text-sm text-white">📎 {attachedFile.name}</span>
              <button
                onClick={removeFile}
                className="text-red-300 hover:text-red-200"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          onClick={sendMessage}
          disabled={isLoading || (!input.trim() && !attachedFile)}
          className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default Chat;

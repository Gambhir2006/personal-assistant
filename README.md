# 🤖 AI Personal Assistant

A complete, ready-to-run AI personal assistant with modern frontend, powerful backend, and intelligent features.

## ✨ Features

- 🎨 **Modern UI** - Beautiful React frontend with TailwindCSS
- 🧠 **AI Chat** - Intelligent conversations with OpenAI or Ollama
- 🎙️ **Voice Support** - Voice input and output capabilities
- ✅ **Task Management** - Create, track, and complete tasks with priorities
- 📝 **Notes System** - Organize your thoughts with searchable notes
- 💾 **SQLite Database** - Persistent storage for all your data
- 🔐 **Secure** - Environment variable configuration for API keys
- 📡 **REST APIs** - Full-featured backend with FastAPI
- 📚 **API Documentation** - Auto-generated Swagger/OpenAPI docs

## 📁 Project Structure

```
PERSNOL ASSISTAT/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # SQLAlchemy models & database setup
│   ├── config.py            # Configuration settings
│   └── ai_service.py        # AI integration (OpenAI/Ollama)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js      # AI chat interface
│   │   │   ├── Tasks.js     # Task management
│   │   │   ├── Notes.js     # Notes system
│   │   │   └── SettingsPanel.js  # Settings configuration
│   │   ├── App.js           # Main React app
│   │   ├── index.js         # React entry point
│   │   └── index.css Tailwind styles
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   └── postcss.config.js    # PostCSS configuration
├── database/                # SQLite database (auto-created)
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Step 1: Install Dependencies

**Backend:**
```bash
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment

Copy the example environment file and add your API keys:

```bash
copy .env.example .env
```

Edit `.env` and configure:

**For OpenAI:**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
```

**For Ollama (Local LLM):**
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

### Step 3: Run the Application

**Start Backend (Terminal 1):**
```bash
python -m backend.main
```

Backend will run on: `http://localhost:8000`

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

### Step 4: Access Your Assistant

Open your browser and navigate to: `http://localhost:3000`

## 📖 API Documentation

Once the backend is running, access the interactive API documentation at:

**Swagger UI:** `http://localhost:8000/docs`

**ReDoc:** `http://localhost:8000/redoc`

### Available Endpoints

- `POST /api/chat` - Send message to AI
- `GET /api/conversations` - Get conversation history
- `DELETE /api/conversations` - Clear conversations
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/notes` - Create note
- `GET /api/notes` - Get all notes
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note
- `POST /api/voice-to-text` - Convert voice to text
- `POST /api/text-to-voice` - Convert text to voice

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| AI_PROVIDER | AI provider (openai/ollama) | openai |
| OPENAI_API_KEY | OpenAI API key | - |
| OPENAI_MODEL | OpenAI model | gpt-4 |
| OLLAMA_BASE_URL | Ollama server URL | http://localhost:11434 |
| OLLAMA_MODEL | Ollama model | llama2 |
| DATABASE_URL | Database connection string | sqlite:///./database/assistant.db |
| VOICE_ENABLED | Enable voice features | True |

## 🎯 Usage Guide

### AI Chat
- Type your message in the chat input
- Press Enter or click Send to get AI response
- Use the microphone button for voice input (placeholder)
- Clear conversation history with the Clear button

### Tasks
- Click "Add Task" to create a new task
- Set title, description, priority, and due date
- Click the checkmark to mark tasks as complete
- Edit or delete tasks using the action buttons
- Tasks are color-coded by priority (red=high, yellow=medium, green=low)

### Notes
- Click "Add Note" to create a new note
- Add title and content
- Search notes using the search bar
- Edit or delete notes using the action buttons
- Notes are sorted by creation date

### Settings
- Choose between OpenAI or Ollama as AI provider
- Configure API keys and model settings
- Enable/disable voice features
- Settings are saved to localStorage (in production, update .env)

## 🔮 Future Upgrades

Planned features for future releases:

- 📧 **Gmail Integration** - Email management and automation
- 📅 **Calendar Integration** - Schedule management and reminders
- 💬 **WhatsApp-style Commands** - Natural language task creation
- 📄 **PDF/RAG Support** - Document analysis and retrieval
- 🔍 **Web Search** - Real-time information retrieval
- 🎯 **Smart Reminders** - Intelligent notification system
- 📊 **Analytics Dashboard** - Usage statistics and insights
- 🔗 **Multi-platform Support** - Mobile apps and browser extensions

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **OpenAI SDK** - AI integration
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Database
- **SQLite** - Lightweight, file-based database

## 🐛 Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify Python dependencies are installed
- Check .env file exists and is configured

### Frontend won't start
- Check if port 3000 is already in use
- Verify Node.js dependencies are installed
- Clear npm cache: `npm cache clean --force`

### AI not responding
- Verify API key is correct in .env
- Check if you have API credits available
- For Ollama, ensure Ollama server is running

### Database errors
- Ensure database directory exists
- Check file permissions
- Delete database file to reset (will lose data)

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📧 Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.

---

**Built with ❤️ for productivity and automation**

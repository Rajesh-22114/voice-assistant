# 🤖 LEO AI Assistant - Enterprise Voice-Controlled Productivity System

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![OpenAI API](https://img.shields.io/badge/OpenAI_API-Supported-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Speech Recognition](https://img.shields.io/badge/Speech_Recognition-Web_Speech_API-007ACC?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Text-to-Speech](https://img.shields.io/badge/TTS-Web_Speech_Synthesis-FF6F00?style=for-the-badge&logo=speaker&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-LEO_AI_Assistant-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

**LEO AI Assistant** is a full-stack, enterprise-grade, voice-controlled productivity platform built with Python (FastAPI backend) and a modern, high-performance React 18 frontend dashboard. Featuring multi-provider AI engine integration, continuous hands-free wake-word detection (`"Hey Leo"`), automated WhatsApp messaging, direct YouTube media playback, system vitals telemetry, and Windows boot autostart management.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Workflow](#-architecture--workflow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [🔒 Security Notes & Protocol](#--security-notes--protocol)
- [Usage Guide](#-usage-guide)
- [Supported Voice Commands](#-supported-voice-commands)
- [Deployment Guide](#-deployment-guide)
  - [Deploying on Render](#1-deploying-on-render)
  - [Deploying on Railway](#2-deploying-on-railway)
  - [Deploying on VPS / Linux Server](#3-deploying-on-a-vps--linux-server)
- [Screenshots](#-screenshots)
- [🔮 Future Scope & Roadmap](#-future-scope--roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🚀 Overview

LEO AI Assistant transforms traditional text interfaces into a fluid, hands-free voice experience. Designed with privacy, modularity, and low-latency performance in mind, LEO operates in **Dual Modes**:

1. **Local Offline Mode (Default)**: Completely offline voice interaction without requiring API keys or internet access for core system actions.
2. **AI Provider Cloud Mode**: Seamlessly toggle between **Google Gemini**, **OpenAI (GPT-4o)**, **Groq**, **Anthropic Claude**, **OpenRouter**, or local **Ollama** LLMs for instant general knowledge queries.

---

## ✨ Key Features

- 🧠 **AI Provider Toggle System**: Switch dynamically between Local Mode and Cloud AI providers via a secure settings dashboard with live connection testing (`POST /api/config/ai/test`).
- 🎙️ **Hands-Free Wake Word Detection**: Continuous background listener detecting `"Hey Leo"`, `"Leo"`, or `"Hi Leo"`. Plays an audio chime, speaks `"Yes Boss, how can I help you"`, and opens a 10-second active listening window.
- ⚡ **Direct YouTube Playback**: Uses `pywhatkit.playonyt()` to launch and stream music or videos directly on YouTube.
- 💬 **Contacts Directory & WhatsApp Messaging**: Manage contacts (with Name, Phone, Email, Nickname, and Notes), export data to CSV/JSON, and initiate automated WhatsApp Web voice messages.
- 🔮 **Interactive 6-State Visual Orb**: Real-time visual feedback for orb states: `idle`, `wake_word`, `listening`, `processing`, `speaking`, and `error`. Tapping the orb immediately interrupts speech output.
- 🖥️ **Windows Registry Autostart Manager**: Integrated toggle button to manage Windows startup boot (`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`) with `--minimized` background launch.
- 📊 **Real-time System Vitals Telemetry**: Live dashboard monitoring for CPU load, Memory usage, Battery percentage/plug status, and Network data throughput.
- 📜 **Activity History Logging**: Full persistent log of voice commands, system responses, timestamps, and execution statuses.

---

## 🏗️ Architecture & Workflow

LEO follows a clean, decoupled client-server architecture. The speech processing workflow operates as follows:

```
┌─────────────┐      ┌────────────────────┐      ┌───────────────────┐
│ User Voice  │ ───► │ Speech Recognition │ ───► │ Intent Processing │
│   Input     │      │ (Web Speech API)   │      │   & Dispatcher    │
└─────────────┘      └────────────────────┘      └─────────┬─────────┘
                                                           │
                                                           ▼
┌─────────────┐      ┌────────────────────┐      ┌───────────────────┐
│ Audio Sound │ ◄─── │   Text-to-Speech   │ ◄─── │  AI Provider /    │
│   Output    │      │ (SpeechSynthesis)  │      │ System Action Engine│
└─────────────┘      └────────────────────┘      └───────────────────┘
```

### Step-by-Step Execution Sequence

1. **User Voice Input**: User speaks naturally into the microphone or triggers the wake word `"Hey Leo"`.
2. **Speech Recognition**: The browser's `SpeechRecognition` API streams interim audio results and extracts text.
3. **Intent Processing**: FastAPI backend processes text, extracts targets/entities (e.g., song names, query topics, contact names).
4. **AI Model / Command Engine**: Intent dispatcher routes query to system actions (YouTube, Time, WhatsApp, Battery) or active AI provider (Gemini/OpenAI/Groq).
5. **Response Generation**: Server constructs a concise, natural response tailored for text-to-speech output.
6. **Text-to-Speech (TTS)**: Web Speech Synthesis engine (`SpeechSynthesisUtterance`) converts response text to spoken audio.
7. **Audio Output**: Voice audio plays through system speakers while updating visual orb state to `speaking`.

---

## 🛠️ Tech Stack

### Backend Infrastructure
- **Python 3.10+**: Core backend runtime environment.
- **FastAPI & Uvicorn**: High-performance asynchronous REST API server.
- **PyWhatKit**: Direct YouTube playback and media automation.
- **Wikipedia-API**: Secondary offline fallback query engine.
- **PSUtil & WinReg**: System vitals metrics and Windows Registry startup manager.
- **python-dotenv**: Environment variable management.

### Frontend Dashboard
- **React 18**: UI component architecture.
- **Tailwind CSS**: Glassmorphism dark-mode UI styling.
- **Lucide Icons**: Modern vector icon set.
- **Web Speech API**: Browser-native speech recognition engine.
- **Web Audio API**: Synthesized audio chime feedback.
- **Babel Standalone**: In-browser JSX transpilation.

---

## 📁 Project Structure

```
voice-assistant/
├── app.py                  # Core application launcher script
├── server.py               # FastAPI backend server & API endpoints
├── requirements.txt        # Python package dependencies
├── settings.json           # Application configurations (AI mode, autostart)
├── contacts.json           # Local contacts database
├── history.json            # Persistent activity logs database
├── sample_contacts.csv     # Sample CSV import template
├── sample_contacts.json    # Sample JSON import template
├── babel_standalone.js     # Standalone Babel compiler for frontend
├── .env                    # Private environment keys (git-ignored)
├── .gitignore              # Repository file exclusion rules
├── README.md               # Project documentation
└── static/                 # Static web dashboard assets
    ├── index.html          # Main HTML entry point
    ├── app.js              # React frontend application source
    └── styles.css          # Custom CSS glassmorphism & orb animations
```

---

## 📥 Installation & Setup

### Prerequisites
- **Python 3.10 or higher**: Download from [python.org](https://www.python.org/downloads/).
- **Git**: Installed on your operating system.
- **Google Chrome / Microsoft Edge**: Recommended browsers for full Web Speech API compatibility.

### 1. Clone the Repository
```bash
git clone https://github.com/Rajesh-22114/voice-assistant.git
cd voice-assistant
```

### 2. Create and Activate Virtual Environment

**Windows (PowerShell / CMD):**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

LEO AI Assistant supports multi-provider integration through environment variables.

### 1. Create `.env` File
Create a file named `.env` in the root directory:

```bash
touch .env
```

### 2. Configure Your API Keys
Add your preferred API keys to `.env`:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# Anthropic Claude API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> **Note**: If operating in **Local Mode**, API keys are optional.

---

## 🔒 Security Notes & Protocol

> [!IMPORTANT]
> **API Key Safety & Credentials Protection Protocol**:
> 1. **Zero Secret Hardcoding**: API keys are NEVER hardcoded into source code (`server.py`, `app.py`, or `static/app.js`).
> 2. **Environment Isolation**: Keys are dynamically loaded into runtime memory strictly through environment variables (`os.getenv`) via `.env`.
> 3. **Non-Duplicating Key Storage**: Backend update functions safely replace key values without creating duplicate keys in `.env`.

### Setting up `.gitignore`
To prevent accidental leaks of sensitive credentials, ensure your `.gitignore` file includes:

```gitignore
# Secret Environment Files
.env
*.env

# Python Cache & Bytecode
__pycache__/
*.pyc
*.pyo
*.pyd

# OS Files
.DS_Store
Thumbs.db

# Virtual Environments
venv/
env/
ENV/

# IDE Settings
.idea/
.vscode/
```

> [!CAUTION]
> **Never commit API keys, tokens, passwords, database credentials, or `.env` files to public GitHub repositories.**

---

## 🎮 Usage Guide

Start the LEO AI Assistant backend server and launch the Dashboard:

```bash
python app.py
```

The terminal will display startup information and automatically open `http://127.0.0.1:8000` in your default browser:

```
==================================================================
 >>> LEO AI Assistant Server is LIVE & Running!
 >>> Dashboard URL: http://127.0.0.1:8000
 >>> Keep this terminal open while using the assistant.
==================================================================
```

To launch silently in background mode on system startup:
```bash
python app.py --minimized
```

---

## 💬 Supported Voice Commands

| Category | Natural Voice Command | System Action / Response |
| :--- | :--- | :--- |
| **Wake Word** | `"Hey Leo"` / `"Leo"` | Plays chime, speaks *"Yes Boss, how can I help you"*, opens 10s mic window |
| **Clock / Time** | `"Leo what is the time"` | Announces current system time |
| **YouTube Media** | `"Leo play Shape of You"` | Streams song directly on YouTube via `pywhatkit` |
| **Google Search** | `"Leo search Python tutorials"` | Opens Google search in new browser tab |
| **Wikipedia / AI** | `"Leo who is Elon Musk"` | Fetches Groq AI / Wikipedia summary |
| **WhatsApp Message**| `"Leo message Rajesh"` | Prompts for message content and opens WhatsApp Web |
| **Battery Status** | `"Leo battery status"` | Announces battery level and charging state |
| **Network Speed** | `"Leo network speed"` | Reports live network bytes sent/received |
| **Capabilities** | `"Leo what can you do"` | Lists assistant voice capabilities |
| **Stop Assistant** | `"Leo stop"` | Gracefully terminates active voice session |

---

## 🌐 Deployment Guide

### 1. Deploying on Render

1. Fork or push this repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add `GEMINI_API_KEY`, `GROQ_API_KEY`, etc.
6. Click **Create Web Service**.

---

### 2. Deploying on Railway

1. Log into [Railway.app](https://railway.app/).
2. Click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
3. Select your repository.
4. Add Environment Variables under **Variables** tab.
5. Railway automatically detects `requirements.txt`. Set **Start Command**:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}
   ```
6. Click **Deploy**.

---

### 3. Deploying on a VPS / Linux Server

1. **Clone project on Linux VPS**:
   ```bash
   git clone https://github.com/your-username/voice-assistant.git
   cd voice-assistant
   ```
2. **Setup virtual environment & dependencies**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt gunicorn
   ```
3. **Configure Systemd Service (`/etc/systemd/system/leo-assistant.service`)**:
   ```ini
   [Unit]
   Description=LEO AI Assistant FastAPI Backend
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/voice-assistant
   ExecStart=/home/ubuntu/voice-assistant/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app --bind 127.0.0.1:8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```
4. **Start and enable service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start leo-assistant
   sudo systemctl enable leo-assistant
   ```
5. **Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/leo`)**:
   ```nginx
   server {
       listen 80;
       server_name your-domain-or-ip;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

## 🖼️ Screenshots

| Dashboard Overview | Voice Assistant Visual Orb |
| :---: | :---: |
| *(Main System Vitals & Quick Commands)* | *(6-State Visual Orb & Real-time Transcript)* |

| Contacts Directory | AI Settings & Startup Manager |
| :---: | :---: |
| *(CRUD Contacts, Export CSV/JSON)* | *(AI Provider Toggle & Windows Autostart)* |

---

## 🔮 Future Scope & Roadmap

- 🤖 **Agentic AI Capabilities**: ReAct autonomous agent execution for multi-step tasks and file manipulation.
- 🧠 **Long-Term Memory Graph**: Persistent conversational memory storing user preferences across sessions.
- 🌐 **Real-time Deep Web Search**: Integration with Tavily/SerpAPI for real-time live web browsing answers.
- ⚡ **Native OS & Smart Automation**: Cross-platform system automation (app launching, volume control, IoT smart home controls).
- 🖼️ **Multi-Modal Vision Support**: Image analysis and visual camera input understanding via Gemini Vision / GPT-4o.
- 📱 **Mobile Application**: Native mobile clients built with Flutter / React Native for Android & iOS.

---

## 👤 Author

**LEO AI Assistant Team**
- **GitHub**: [@Rajesh-22114](https://github.com/Rajesh-22114)
- **Project Repository**: [voice-assistant](https://github.com/your-username/voice-assistant)

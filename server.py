import os
import sys
import json
import uuid
import time
import re
import urllib.request
import urllib.parse
import webbrowser
import datetime as dt
from typing import Optional, List, Dict
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, Response
from pydantic import BaseModel
import psutil
import wikipedia
import pywhatkit
from dotenv import load_dotenv

# Load .env configuration
load_dotenv()

app = FastAPI(title="LEO AI Assistant Backend API", version="2.5.0")

ENV_FILE = os.path.join(os.path.dirname(__file__), ".env")
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "settings.json")
CONTACTS_FILE = os.path.join(os.path.dirname(__file__), "contacts.json")
HISTORY_FILE = os.path.join(os.path.dirname(__file__), "history.json")

# --- WINDOWS REGISTRY STARTUP HELPERS ---

def get_startup_status() -> bool:
    if os.name != 'nt':
        return False
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_READ)
        try:
            val, _ = winreg.QueryValueEx(key, "LEO_AI_Assistant")
            winreg.CloseKey(key)
            return bool(val)
        except Exception:
            winreg.CloseKey(key)
            return False
    except Exception:
        return False

def set_startup_status(enable: bool) -> bool:
    if os.name != 'nt':
        return False
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_ALL_ACCESS)
        if enable:
            python_exe = sys.executable
            app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "app.py"))
            cmd = f'"{python_exe}" "{app_path}" --minimized'
            winreg.SetValueEx(key, "LEO_AI_Assistant", 0, winreg.REG_SZ, cmd)
        else:
            try:
                winreg.DeleteValue(key, "LEO_AI_Assistant")
            except Exception:
                pass
        winreg.CloseKey(key)
        return True
    except Exception as e:
        print("Startup registry error:", e)
        return False

# --- SETTINGS MANAGEMENT HELPERS ---

def load_settings():
    default_settings = {
        "ai_mode": "local",
        "active_provider": "gemini",
        "provider_models": {
            "gemini": "gemini-2.5-flash",
            "openai": "gpt-4o-mini",
            "groq": "openai/gpt-oss-20b",
            "anthropic": "claude-3-5-sonnet-20241022",
            "openrouter": "google/gemini-2.5-flash",
            "ollama": "llama3"
        },
        "wake_word": {
            "enabled": True,
            "word": "Hey Leo",
            "sensitivity": 0.8,
            "noise_filtering": True,
            "timeout_sec": 7
        },
        "startup": {
            "autostart_enabled": get_startup_status(),
            "start_minimized": True,
            "enable_wake_word": True,
            "run_in_background": True
        }
    }
    if not os.path.exists(SETTINGS_FILE):
        save_settings(default_settings)
        return default_settings
    try:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if "startup" in data:
                data["startup"]["autostart_enabled"] = get_startup_status()
            return data
    except Exception:
        return default_settings

def save_settings(settings_dict):
    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(settings_dict, f, indent=2)

# --- ENVIRONMENT FILE HELPERS ---

def update_env_file(key: str, value: str):
    key = key.strip().upper()
    value = value.strip()
    lines = []
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
    
    found = False
    new_lines = []
    for line in lines:
        if line.strip().startswith(f"{key}="):
            new_lines.append(f'{key}="{value}"\n')
            found = True
        else:
            new_lines.append(line)
            
    if not found:
        new_lines.append(f'{key}="{value}"\n')
        
    with open(ENV_FILE, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
        
    os.environ[key] = value
    load_dotenv(ENV_FILE, override=True)

def delete_env_key(key: str):
    key = key.strip().upper()
    if not os.path.exists(ENV_FILE):
        return
    with open(ENV_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    new_lines = [line for line in lines if not line.strip().startswith(f"{key}=")]
    with open(ENV_FILE, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
        
    if key in os.environ:
        del os.environ[key]
    load_dotenv(ENV_FILE, override=True)

# --- MULTI-PROVIDER AI DISPATCHER ---

def query_gemini(prompt: str, model: str, api_key: str) -> Optional[str]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": f"You are Leo, a smart, friendly voice-controlled assistant. Provide clear, concise answers suitable for text-to-speech reading (2 to 3 sentences maximum).\n\nUser Question: {prompt}"}]}]
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        candidates = res_data.get("candidates", [])
        if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            if parts:
                return parts[0].get("text", "").strip()
    return None

def query_openai(prompt: str, model: str, api_key: str) -> Optional[str]:
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are Leo, a smart, friendly voice-controlled assistant. Provide clear, concise answers suitable for text-to-speech reading (2 to 3 sentences maximum)."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 160,
        "temperature": 0.7
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    })
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        choices = res_data.get("choices", [])
        if choices:
            return choices[0]["message"]["content"].strip()
    return None

def query_anthropic(prompt: str, model: str, api_key: str) -> Optional[str]:
    url = "https://api.anthropic.com/v1/messages"
    payload = {
        "model": model,
        "max_tokens": 160,
        "system": "You are Leo, a smart, friendly voice-controlled assistant. Provide clear, concise answers suitable for text-to-speech reading (2 to 3 sentences maximum).",
        "messages": [{"role": "user", "content": prompt}]
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={
        'Content-Type': 'application/json',
        'x-api-key': api_key,
        'anthropic-version': '2023-06-01'
    })
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        content = res_data.get("content", [])
        if content and "text" in content[0]:
            return content[0]["text"].strip()
    return None

def query_openrouter(prompt: str, model: str, api_key: str) -> Optional[str]:
    url = "https://openrouter.ai/api/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are Leo, a smart, friendly voice-controlled assistant. Provide clear, concise answers suitable for text-to-speech reading (2 to 3 sentences maximum)."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 160
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
        'HTTP-Referer': 'http://127.0.0.1:8000',
        'X-Title': 'LEO AI Assistant'
    })
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        choices = res_data.get("choices", [])
        if choices:
            raw = choices[0]["message"]["content"].strip()
            return re.sub(r'<think>.*?</think>', '', raw, flags=re.DOTALL).strip()
    return None

def query_ollama(prompt: str, model: str) -> Optional[str]:
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": f"You are Leo, a smart, friendly voice-controlled assistant. Provide clear, concise answers suitable for text-to-speech reading (2 to 3 sentences maximum).\n\nUser: {prompt}\nLeo:",
        "stream": False
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        return res_data.get("response", "").strip()
    return None

def ask_groq_ai(prompt: str) -> Optional[str]:
    """Query Groq API if GROQ_API_KEY is configured in .env with robust model fallbacks."""
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        return None
    
    models = [
        "openai/gpt-oss-20b",
        "qwen/qwen3.6-27b",
        "groq/compound-mini",
        "llama-3.3-70b-versatile",
        "llama3-8b-8192"
    ]
    
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        
        for m in models:
            try:
                completion = client.chat.completions.create(
                    model=m,
                    messages=[
                        {
                            "role": "system", 
                            "content": "You are Leo, a smart, friendly voice-controlled assistant. Provide clear, concise answers suitable for text-to-speech reading (2 to 3 sentences maximum)."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=160
                )
                if completion.choices and len(completion.choices) > 0:
                    raw_text = completion.choices[0].message.content.strip()
                    cleaned = re.sub(r'<think>.*?</think>', '', raw_text, flags=re.DOTALL).strip()
                    if cleaned:
                        return cleaned
            except Exception as model_err:
                print(f"Groq API model {m} notice:", model_err)
                continue
    except Exception as e:
        print("Groq API Execution Warning:", e)
    return None

def test_ai_provider_call(provider: str, model: str, api_key: str, prompt: str) -> Optional[str]:
    p = provider.lower()
    if p == "gemini":
        return query_gemini(prompt, model, api_key)
    elif p == "openai":
        return query_openai(prompt, model, api_key)
    elif p == "groq":
        return ask_groq_ai(prompt)
    elif p == "anthropic":
        return query_anthropic(prompt, model, api_key)
    elif p == "openrouter":
        return query_openrouter(prompt, model, api_key)
    elif p == "ollama":
        return query_ollama(prompt, model)
    return None

def query_active_ai_provider(prompt: str) -> Optional[str]:
    settings = load_settings()
    if settings.get("ai_mode") == "local":
        return None # Local offline mode
        
    provider = settings.get("active_provider", "gemini").lower()
    models = settings.get("provider_models", {})
    model = models.get(provider, "gemini-2.5-flash")
    
    env_map = {
        "gemini": "GEMINI_API_KEY",
        "openai": "OPENAI_API_KEY",
        "groq": "GROQ_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "openrouter": "OPENROUTER_API_KEY"
    }
    
    key = ""
    if provider in env_map:
        key = os.getenv(env_map[provider], "").strip()
        if not key:
            return None
            
    try:
        return test_ai_provider_call(provider, model, key, prompt)
    except Exception as e:
        print(f"AI Provider ({provider}) error:", e)
        return None

def get_wiki_summary(query: str) -> Optional[str]:
    """Fetch Wikipedia summary with multi-stage search fallback."""
    query = query.strip()
    if not query:
        return None
    try:
        wikipedia.set_lang("en")
        return wikipedia.summary(query, sentences=3, auto_suggest=True)
    except wikipedia.DisambiguationError as e:
        if e.options:
            try:
                return wikipedia.summary(e.options[0], sentences=3)
            except Exception:
                pass
    except wikipedia.PageError:
        pass
    except Exception:
        pass
        
    try:
        results = wikipedia.search(query)
        if results and len(results) > 0:
            return wikipedia.summary(results[0], sentences=3)
    except Exception:
        pass

    return None

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class SpeakRequest(BaseModel):
    text: str

class PlayRequest(BaseModel):
    query: str

class SearchRequest(BaseModel):
    query: str

class WikiRequest(BaseModel):
    query: str

class MessageRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    message: Optional[str] = "Hello from Leo AI Assistant"

class CommandRequest(BaseModel):
    command: str

class Contact(BaseModel):
    id: Optional[str] = None
    name: str
    phone: str
    email: Optional[str] = ""
    nickname: Optional[str] = ""
    whatsapp_enabled: Optional[bool] = True
    last_message_sent: Optional[str] = "Never"
    notes: Optional[str] = ""

# Helpers
def load_contacts():
    if not os.path.exists(CONTACTS_FILE):
        return []
    try:
        with open(CONTACTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_contacts(contacts):
    with open(CONTACTS_FILE, "w", encoding="utf-8") as f:
        json.dump(contacts, f, indent=2)

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_history(history):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

def log_activity(command: str, response: str, status: str = "Success", category: str = "General"):
    history = load_history()
    now_str = dt.datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")
    entry = {
        "id": f"act-{uuid.uuid4().hex[:6]}",
        "timestamp": now_str,
        "command": command,
        "response": response,
        "status": status,
        "type": category
    }
    history.insert(0, entry) # insert at top
    save_history(history[:100]) # keep last 100 entries

# --- API ENDPOINTS ---

@app.get("/api/status")
def get_system_status():
    battery = psutil.sensors_battery()
    net = psutil.net_io_counters()
    cpu_percent = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory()
    
    return {
        "assistant_name": "Leo",
        "status": "Online",
        "version": "2.0.0",
        "microphone_status": "Active",
        "voice_recognition_status": "Web Speech API / Native Python Engine",
        "current_time": dt.datetime.now().strftime("%I:%M:%S %p"),
        "battery": {
            "percent": battery.percent if battery else 100,
            "power_plugged": battery.power_plugged if battery else True,
            "secsleft": battery.secsleft if battery else -1
        },
        "network": {
            "bytes_sent": net.bytes_sent,
            "bytes_recv": net.bytes_recv,
            "total_mbs": round((net.bytes_sent + net.bytes_recv) / (1024 * 1024), 2)
        },
        "cpu_percent": cpu_percent,
        "memory_percent": memory.percent
    }

@app.post("/listen")
@app.post("/api/listen")
def listen_audio():
    """Trigger microphone listening endpoint."""
    log_activity("Microphone Listen Triggered", "Listening for user voice prompt...", "Pending", "Voice")
    return {
        "status": "listening",
        "message": "Listening active on frontend / system microphone",
        "timestamp": dt.datetime.now().strftime("%I:%M:%S %p")
    }

@app.post("/speak")
@app.post("/api/speak")
def speak_text(req: SpeakRequest):
    """Text to speech endpoint."""
    text = req.text.strip()
    log_activity(f"Leo speak: '{text}'", f"Spoke: {text}", "Success", "TTS")
    return {
        "status": "spoken",
        "text": text,
        "timestamp": dt.datetime.now().strftime("%I:%M:%S %p")
    }

@app.post("/play")
@app.post("/api/play")
def play_youtube(req: PlayRequest):
    """Play song/video on YouTube directly using pywhatkit.playonyt()."""
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    yt_url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    try:
        pywhatkit.playonyt(query)
        res_msg = f"Playing '{query}' directly on YouTube"
    except Exception as e:
        webbrowser.open(yt_url)
        res_msg = f"Opened YouTube search for '{query}'"

    log_activity(f"Play YouTube: {query}", res_msg, "Success", "YouTube")
    return {
        "status": "success",
        "query": query,
        "response": res_msg,
        "url": yt_url
    }

@app.post("/search")
@app.post("/api/search")
def google_search(req: SearchRequest):
    """Search Google for query."""
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    search_url = f"https://www.google.com/search?q={urllib.parse.quote(query)}"
    try:
        webbrowser.open(search_url)
    except Exception:
        pass
    res_msg = f"Searching Google for '{query}'"
        
    log_activity(f"Google Search: {query}", res_msg, "Success", "Search")
    return {
        "status": "success",
        "query": query,
        "response": res_msg,
        "url": search_url
    }

@app.post("/wiki")
@app.post("/api/wiki")
def wiki_summary(req: WikiRequest):
    """Fetch Wikipedia or Groq AI summary."""
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # 1. Try Groq AI first if API key is present
    groq_resp = ask_groq_ai(f"Tell me about {query}")
    if groq_resp:
        log_activity(f"Groq AI: {query}", groq_resp, "Success", "Groq AI")
        return {"status": "success", "query": query, "summary": groq_resp, "response": groq_resp}

    # 2. Try Wikipedia fallback
    summary = get_wiki_summary(query)
    if summary:
        res_msg = f"{query}: {summary}"
        log_activity(f"Wikipedia: {query}", res_msg, "Success", "Wikipedia")
        return {"status": "success", "query": query, "summary": summary, "response": res_msg}
    else:
        res_msg = f"Could not find information for '{query}'. Add a GROQ_API_KEY to your .env file to enable instant AI answers!"
        log_activity(f"Knowledge Search: {query}", res_msg, "Warning", "Knowledge")
        return {"status": "error", "query": query, "response": res_msg, "summary": res_msg}

@app.post("/message")
@app.post("/api/message")
def send_whatsapp_message(req: MessageRequest):
    """Send WhatsApp message to contact name or phone number."""
    contacts = load_contacts()
    target_contact = None
    
    # Search by name first
    if req.name:
        for c in contacts:
            if req.name.lower() in c["name"].lower():
                target_contact = c
                break
                
    phone_number = req.phone
    contact_name = req.name or "Contact"
    
    if target_contact:
        phone_number = target_contact["phone"]
        contact_name = target_contact["name"]
        
    if not phone_number and not target_contact:
        raise HTTPException(status_code=404, detail="Contact not found in directory")
        
    clean_phone = phone_number.replace(" ", "").replace("-", "")
    message = req.message or f"Hi {contact_name}, sent via Leo AI Assistant!"
    
    wa_url = f"https://api.whatsapp.com/send?phone={urllib.parse.quote(clean_phone)}&text={urllib.parse.quote(message)}"
    
    # Update last message sent timestamp
    if target_contact:
        for c in contacts:
            if c["id"] == target_contact["id"]:
                c["last_message_sent"] = dt.datetime.now().strftime("%Y-%m-%d %I:%M %p")
                break
        save_contacts(contacts)
        
    res_msg = f"Sending WhatsApp message to {contact_name} ({clean_phone}): '{message}'"
    webbrowser.open(wa_url)
    
    log_activity(f"WhatsApp to {contact_name}", res_msg, "Success", "WhatsApp")
    return {
        "status": "success",
        "contact_name": contact_name,
        "phone": clean_phone,
        "message": message,
        "response": res_msg,
        "url": wa_url
    }

@app.get("/battery")
@app.get("/api/battery")
def get_battery():
    battery = psutil.sensors_battery()
    if battery is None:
        res = {"percent": 100, "power_plugged": True, "secsleft": -1, "status": "Desktop power supply"}
    else:
        res = {
            "percent": battery.percent,
            "power_plugged": battery.power_plugged,
            "secsleft": battery.secsleft,
            "status": f"{battery.percent}% ({'Plugged in' if battery.power_plugged else 'On Battery'})"
        }
    log_activity("Leo battery status", f"Battery is {res['percent']}%", "Success", "Battery")
    return res

@app.get("/network")
@app.get("/api/network")
def get_network():
    net = psutil.net_io_counters()
    res = {
        "bytes_sent": net.bytes_sent,
        "bytes_recv": net.bytes_recv,
        "packets_sent": net.packets_sent,
        "packets_recv": net.packets_recv,
        "human_sent": f"{round(net.bytes_sent / (1024 * 1024), 2)} MB",
        "human_recv": f"{round(net.bytes_recv / (1024 * 1024), 2)} MB",
        "speed_text": f"Network sent: {round(net.bytes_sent / (1024 * 1024), 2)} MB, received: {round(net.bytes_recv / (1024 * 1024), 2)} MB"
    }
    log_activity("Leo network speed", res["speed_text"], "Success", "Network")
    return res

# --- CONTACTS CRUD APIs ---

@app.get("/contacts")
@app.get("/api/contacts")
def get_contacts_list(search: Optional[str] = None):
    contacts = load_contacts()
    if search:
        s = search.lower()
        contacts = [c for c in contacts if s in c["name"].lower() or s in c["phone"] or s in c.get("nickname", "").lower() or s in c.get("email", "").lower()]
    return contacts

@app.get("/contacts/export")
@app.get("/api/contacts/export")
def export_contacts(format: str = Query("json")):
    contacts = load_contacts()
    if format.lower() == "csv":
        import io, csv
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Name", "Phone", "Email", "Nickname", "WhatsApp Enabled", "Notes"])
        for c in contacts:
            writer.writerow([
                c.get("name", ""),
                c.get("phone", ""),
                c.get("email", ""),
                c.get("nickname", ""),
                c.get("whatsapp_enabled", True),
                c.get("notes", "")
            ])
        output.seek(0)
        return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=leo_contacts.csv"})
    else:
        return JSONResponse(content=contacts, headers={"Content-Disposition": "attachment; filename=leo_contacts.json"})

@app.post("/contacts")
@app.post("/api/contacts")
def create_contact(contact: Contact):
    contacts = load_contacts()
    new_contact = {
        "id": f"cnt-{uuid.uuid4().hex[:6]}",
        "name": contact.name.strip(),
        "phone": contact.phone.strip(),
        "email": (contact.email or "").strip(),
        "nickname": (contact.nickname or "").strip(),
        "whatsapp_enabled": contact.whatsapp_enabled,
        "last_message_sent": "Never",
        "notes": contact.notes or ""
    }
    contacts.append(new_contact)
    save_contacts(contacts)
    log_activity(f"Add Contact: {contact.name}", f"Added {contact.name} ({contact.phone})", "Success", "Contacts")
    return new_contact

@app.put("/contacts/{contact_id}")
@app.put("/api/contacts/{contact_id}")
def update_contact(contact_id: str, updated: Contact):
    contacts = load_contacts()
    found = False
    updated_obj = None
    for i, c in enumerate(contacts):
        if c["id"] == contact_id:
            contacts[i]["name"] = updated.name.strip()
            contacts[i]["phone"] = updated.phone.strip()
            contacts[i]["email"] = (updated.email or "").strip()
            contacts[i]["nickname"] = (updated.nickname or "").strip()
            contacts[i]["whatsapp_enabled"] = updated.whatsapp_enabled
            if updated.notes is not None:
                contacts[i]["notes"] = updated.notes
            updated_obj = contacts[i]
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    save_contacts(contacts)
    log_activity(f"Update Contact: {updated.name}", f"Updated contact {updated.name}", "Success", "Contacts")
    return updated_obj

@app.delete("/contacts/{contact_id}")
@app.delete("/api/contacts/{contact_id}")
def delete_contact(contact_id: str):
    contacts = load_contacts()
    new_list = [c for c in contacts if c["id"] != contact_id]
    if len(new_list) == len(contacts):
        raise HTTPException(status_code=404, detail="Contact not found")
    save_contacts(new_list)
    log_activity(f"Delete Contact: {contact_id}", "Deleted contact from database", "Success", "Contacts")
    return {"status": "deleted", "contact_id": contact_id}

@app.post("/contacts/import")
@app.post("/api/contacts/import")
async def import_contacts(file: UploadFile = File(...)):
    filename = file.filename.lower()
    content = await file.read()
    imported_count = 0
    contacts = load_contacts()
    
    try:
        if filename.endswith(".json"):
            data = json.loads(content.decode("utf-8"))
            if isinstance(data, list):
                for item in data:
                    if "name" in item and "phone" in item:
                        contacts.append({
                            "id": f"cnt-{uuid.uuid4().hex[:6]}",
                            "name": str(item["name"]).strip(),
                            "phone": str(item["phone"]).strip(),
                            "email": str(item.get("email", "")).strip(),
                            "nickname": str(item.get("nickname", "")).strip(),
                            "whatsapp_enabled": item.get("whatsapp_enabled", True),
                            "last_message_sent": "Never",
                            "notes": item.get("notes", "Imported via JSON")
                        })
                        imported_count += 1
                        
        elif filename.endswith(".csv"):
            text = content.decode("utf-8")
            lines = text.strip().split("\n")
            header = [h.strip().lower() for h in lines[0].split(",")]
            name_idx = header.index("name") if "name" in header else 0
            phone_idx = header.index("phone") if "phone" in header else 1
            email_idx = header.index("email") if "email" in header else -1
            nickname_idx = header.index("nickname") if "nickname" in header else -1
            
            for line in lines[1:]:
                parts = [p.strip() for p in line.split(",")]
                if len(parts) > max(name_idx, phone_idx):
                    email_val = parts[email_idx] if (email_idx != -1 and len(parts) > email_idx) else ""
                    nickname_val = parts[nickname_idx] if (nickname_idx != -1 and len(parts) > nickname_idx) else ""
                    contacts.append({
                        "id": f"cnt-{uuid.uuid4().hex[:6]}",
                        "name": parts[name_idx],
                        "phone": parts[phone_idx],
                        "email": email_val,
                        "nickname": nickname_val,
                        "whatsapp_enabled": True,
                        "last_message_sent": "Never",
                        "notes": "Imported via CSV"
                    })
                    imported_count += 1
                    
        elif filename.endswith(".xlsx"):
            import openpyxl
            import io
            wb = openpyxl.load_workbook(io.BytesIO(content))
            sheet = wb.active
            rows = list(sheet.iter_rows(values_only=True))
            if rows:
                header = [str(cell).strip().lower() for cell in rows[0] if cell]
                name_idx = header.index("name") if "name" in header else 0
                phone_idx = header.index("phone") if "phone" in header else 1
                email_idx = header.index("email") if "email" in header else -1
                nickname_idx = header.index("nickname") if "nickname" in header else -1
                for row in rows[1:]:
                    if row and len(row) > max(name_idx, phone_idx) and row[name_idx] and row[phone_idx]:
                        email_val = str(row[email_idx]).strip() if (email_idx != -1 and len(row) > email_idx and row[email_idx]) else ""
                        nickname_val = str(row[nickname_idx]).strip() if (nickname_idx != -1 and len(row) > nickname_idx and row[nickname_idx]) else ""
                        contacts.append({
                            "id": f"cnt-{uuid.uuid4().hex[:6]}",
                            "name": str(row[name_idx]).strip(),
                            "phone": str(row[phone_idx]).strip(),
                            "email": email_val,
                            "nickname": nickname_val,
                            "whatsapp_enabled": True,
                            "last_message_sent": "Never",
                            "notes": "Imported via Excel"
                        })
                        imported_count += 1
                        
        save_contacts(contacts)
        log_activity("Import Contacts", f"Imported {imported_count} contacts from {file.filename}", "Success", "Contacts")
        return {"status": "success", "imported_count": imported_count, "filename": file.filename}
    except Exception as e:
        log_activity("Import Contacts Failed", str(e), "Error", "Contacts")
        raise HTTPException(status_code=400, detail=f"Import failed: {str(e)}")

# --- AI CONFIGURATION APIs ---

class AIConfigRequest(BaseModel):
    ai_mode: str # "local" or "ai"
    active_provider: Optional[str] = "gemini"
    provider: Optional[str] = None
    model: Optional[str] = None
    api_key: Optional[str] = None

class AITestRequest(BaseModel):
    provider: str
    model: str
    api_key: Optional[str] = None

class StartupSettingsRequest(BaseModel):
    autostart_enabled: Optional[bool] = None
    start_minimized: Optional[bool] = None
    enable_wake_word: Optional[bool] = None
    run_in_background: Optional[bool] = None

@app.get("/api/config/ai")
def get_ai_config():
    settings = load_settings()
    providers = ["gemini", "openai", "groq", "anthropic", "openrouter", "ollama"]
    keys_status = {}
    env_keys = {
        "gemini": "GEMINI_API_KEY",
        "openai": "OPENAI_API_KEY",
        "groq": "GROQ_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "openrouter": "OPENROUTER_API_KEY",
        "ollama": "OLLAMA_HOST"
    }
    for p in providers:
        if p == "ollama":
            keys_status[p] = True
        else:
            val = os.getenv(env_keys[p], "").strip()
            keys_status[p] = bool(val)
            
    return {
        "ai_mode": settings.get("ai_mode", "local"),
        "active_provider": settings.get("active_provider", "gemini"),
        "provider_models": settings.get("provider_models", {}),
        "keys_configured": keys_status
    }

@app.post("/api/config/ai")
def update_ai_config(req: AIConfigRequest):
    settings = load_settings()
    settings["ai_mode"] = req.ai_mode
    if req.active_provider:
        settings["active_provider"] = req.active_provider
    if req.provider and req.model:
        if "provider_models" not in settings:
            settings["provider_models"] = {}
        settings["provider_models"][req.provider] = req.model

    save_settings(settings)

    if req.provider and req.api_key and req.api_key.strip():
        env_map = {
            "gemini": "GEMINI_API_KEY",
            "openai": "OPENAI_API_KEY",
            "groq": "GROQ_API_KEY",
            "anthropic": "ANTHROPIC_API_KEY",
            "openrouter": "OPENROUTER_API_KEY"
        }
        if req.provider in env_map:
            update_env_file(env_map[req.provider], req.api_key.strip())

    return {"status": "success", "message": "AI configuration updated successfully", "config": get_ai_config()}

@app.post("/api/config/ai/test")
def test_ai_provider_endpoint(req: AITestRequest):
    provider = req.provider.lower()
    model = req.model.strip()
    key = (req.api_key or "").strip()
    
    if not key and provider != "ollama":
        env_map = {
            "gemini": "GEMINI_API_KEY",
            "openai": "OPENAI_API_KEY",
            "groq": "GROQ_API_KEY",
            "anthropic": "ANTHROPIC_API_KEY",
            "openrouter": "OPENROUTER_API_KEY"
        }
        key = os.getenv(env_map.get(provider, ""), "").strip()
        if not key:
            return {"status": "error", "message": f"No API Key configured for {provider.capitalize()}"}

    try:
        test_prompt = "Hello! Please confirm connection in 1 short sentence."
        res = test_ai_provider_call(provider, model, key, test_prompt)
        if res:
            return {"status": "success", "message": f"Successfully connected to {provider.capitalize()} ({model})!", "response": res}
        else:
            return {"status": "error", "message": f"Failed to get response from {provider.capitalize()}."}
    except Exception as e:
        return {"status": "error", "message": f"Connection error: {str(e)}"}

@app.delete("/api/config/ai/key")
def delete_ai_key(provider: str = Query(...)):
    provider = provider.lower()
    env_map = {
        "gemini": "GEMINI_API_KEY",
        "openai": "OPENAI_API_KEY",
        "groq": "GROQ_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "openrouter": "OPENROUTER_API_KEY"
    }
    if provider in env_map:
        delete_env_key(env_map[provider])
        return {"status": "success", "message": f"API Key for {provider.capitalize()} deleted."}
    return {"status": "error", "message": "Invalid provider"}

# --- SYSTEM STARTUP MANAGER APIs ---

@app.get("/api/startup/settings")
def get_startup_settings():
    settings = load_settings()
    st = settings.get("startup", {})
    st["autostart_enabled"] = get_startup_status()
    return st

@app.post("/api/startup/toggle")
def toggle_autostart(enable: bool = Query(...)):
    res = set_startup_status(enable)
    settings = load_settings()
    if "startup" not in settings:
        settings["startup"] = {}
    settings["startup"]["autostart_enabled"] = get_startup_status()
    save_settings(settings)
    log_activity("Toggle Auto-Start", f"System autostart {'enabled' if enable else 'disabled'}", "Success", "System")
    return {"status": "success", "autostart_enabled": get_startup_status(), "registry_updated": res}

@app.post("/api/startup/settings")
def update_startup_settings(req: StartupSettingsRequest):
    settings = load_settings()
    if "startup" not in settings:
        settings["startup"] = {}
    if req.autostart_enabled is not None:
        set_startup_status(req.autostart_enabled)
        settings["startup"]["autostart_enabled"] = get_startup_status()
    if req.start_minimized is not None:
        settings["startup"]["start_minimized"] = req.start_minimized
    if req.enable_wake_word is not None:
        settings["startup"]["enable_wake_word"] = req.enable_wake_word
    if req.run_in_background is not None:
        settings["startup"]["run_in_background"] = req.run_in_background
    save_settings(settings)
    return {"status": "success", "startup": settings["startup"]}

# --- CENTRAL INTENT DISPATCHER ---

@app.post("/api/command")
def process_command(req: CommandRequest):
    cmd_raw = req.command.strip()
    cmd = cmd_raw.lower()
    
    # Remove leading wake word 'leo' if present
    if cmd.startswith("leo"):
        cmd_text = cmd[3:].strip()
    else:
        cmd_text = cmd
        
    if "stop" in cmd_text:
        res = "Thank you for using Leo AI Assistant. Have a great day!"
        log_activity(cmd_raw, res, "Success", "System")
        return {"action": "stop", "response": res}
        
    elif "time" in cmd_text:
        cur_time = dt.datetime.now().strftime("%I:%M %p")
        res = f"The current time is {cur_time}"
        log_activity(cmd_raw, res, "Success", "Time")
        return {"action": "time", "response": res, "data": {"time": cur_time}}
        
    elif "play" in cmd_text:
        song = cmd_text.replace("play", "").replace("leo", "").strip()
        if not song:
            song = "top music hits"
        yt_url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(song)}"
        try:
            pywhatkit.playonyt(song)
            res = f"Playing '{song}' directly on YouTube"
        except Exception:
            webbrowser.open(yt_url)
            res = f"Playing {song} on YouTube"
        log_activity(cmd_raw, res, "Success", "YouTube")
        return {"action": "play", "response": res, "url": yt_url}
        
    elif "search" in cmd_text or "google" in cmd_text:
        q = cmd_text.replace("search", "").replace("google", "").replace("leo", "").strip()
        search_url = f"https://www.google.com/search?q={urllib.parse.quote(q)}"
        webbrowser.open(search_url)
        res = f"Searching Google for {q}"
        log_activity(cmd_raw, res, "Success", "Search")
        return {"action": "search", "response": res, "url": search_url}
        
    elif "message" in cmd_text:
        parts = cmd_text.replace("message", "").replace("leo", "").strip().split()
        target_name = parts[0] if parts else ""
        contacts = load_contacts()
        matched_contact = None
        for c in contacts:
            if target_name and (target_name.lower() in c["name"].lower() or (c.get("nickname") and target_name.lower() in c["nickname"].lower())):
                matched_contact = c
                break
                
        if matched_contact:
            msg_body = " ".join(parts[1:]) if len(parts) > 1 else ""
            if not msg_body:
                res = f"I found {matched_contact['name']}. What message would you like to send?"
                log_activity(cmd_raw, res, "Pending", "WhatsApp")
                return {"action": "prompt_message", "recipient": matched_contact, "response": res}

            clean_phone = matched_contact['phone'].replace(" ", "").replace("-", "")
            wa_url = f"https://api.whatsapp.com/send?phone={urllib.parse.quote(clean_phone)}&text={urllib.parse.quote(msg_body)}"
            webbrowser.open(wa_url)
            res = f"Sending WhatsApp message to {matched_contact['name']} ({clean_phone}): '{msg_body}'"
            log_activity(cmd_raw, res, "Success", "WhatsApp")
            return {"action": "message", "response": res, "contact": matched_contact, "url": wa_url}
        else:
            res = f"Could not find contact '{target_name}' in directory. Please add contact first."
            log_activity(cmd_raw, res, "Warning", "WhatsApp")
            return {"action": "message", "response": res, "error": "Contact not found"}
            
    elif "battery" in cmd_text:
        b = psutil.sensors_battery()
        pct = b.percent if b else 100
        res = f"Battery status is {pct}% {'(Plugged in)' if b and b.power_plugged else ''}"
        log_activity(cmd_raw, res, "Success", "Battery")
        return {"action": "battery", "response": res, "percent": pct}
        
    elif "speed" in cmd_text or "network" in cmd_text:
        net = psutil.net_io_counters()
        mb_sent = round(net.bytes_sent / (1024*1024), 2)
        mb_recv = round(net.bytes_recv / (1024*1024), 2)
        res = f"Current network traffic: Sent {mb_sent} MB, Received {mb_recv} MB"
        log_activity(cmd_raw, res, "Success", "Network")
        return {"action": "network", "response": res, "sent_mb": mb_sent, "recv_mb": mb_recv}
        
    elif "what can you do" in cmd_text or "who are you" in cmd_text or "help" in cmd_text:
        res = "I am LEO, your AI Voice Controlled Assistant. I can tell time, play songs on YouTube, search Google, summarize Wikipedia topics, message contacts on WhatsApp, check battery status, and answer questions using AI Providers."
        log_activity(cmd_raw, res, "Success", "Info")
        return {"action": "info", "response": res}
        
    elif "who is" in cmd_text or "what is" in cmd_text or "tell me about" in cmd_text:
        topic = cmd_text.replace("who is", "").replace("what is", "").replace("tell me about", "").replace("leo", "").strip()
        
        # 1. Try active AI provider first if enabled
        ai_resp = query_active_ai_provider(cmd_raw)
        if ai_resp:
            log_activity(cmd_raw, ai_resp, "Success", "AI Provider")
            return {"action": "groq", "response": ai_resp}
            
        # 2. Try Wikipedia search fallback
        wiki_resp = get_wiki_summary(topic or cmd_text)
        if wiki_resp:
            res = wiki_resp
            log_activity(cmd_raw, res, "Success", "Wikipedia")
            return {"action": "wiki", "response": res, "summary": wiki_resp}
            
        res = f"I searched for '{topic}', but couldn't retrieve exact info. Enable AI Mode in Settings for instant AI answers!"
        log_activity(cmd_raw, res, "Warning", "Knowledge")
        return {"action": "info", "response": res}
        
    else:
        # Unknown info / general query: Try active AI provider
        ai_resp = query_active_ai_provider(cmd_raw)
        if ai_resp:
            log_activity(cmd_raw, ai_resp, "Success", "AI Provider")
            return {"action": "groq", "response": ai_resp}
            
        # Try Wikipedia fallback
        wiki_resp = get_wiki_summary(cmd_text)
        if wiki_resp:
            log_activity(cmd_raw, wiki_resp, "Success", "Wikipedia")
            return {"action": "wiki", "response": wiki_resp, "summary": wiki_resp}
            
        res = f"I heard: '{cmd_raw}'. You can configure AI Mode in Settings to enable AI responses!"
        log_activity(cmd_raw, res, "Success", "AI")
        return {"action": "general", "response": res}

# --- ACTIVITY LOGS APIs ---

@app.get("/api/history")
def get_history():
    return load_history()

@app.delete("/api/history")
def clear_history():
    save_history([])
    return {"status": "cleared"}

# --- MOUNT STATIC FILES ---
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

from fastapi.responses import FileResponse, JSONResponse, Response

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

@app.get("/babel_standalone.js", include_in_schema=False)
def serve_babel():
    babel_path = os.path.join(os.path.dirname(__file__), "babel_standalone.js")
    if os.path.exists(babel_path):
        return FileResponse(babel_path, media_type="application/javascript")
    return Response(status_code=404)

@app.get("/")
def read_root():
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "LEO AI Assistant Backend Server is Running", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    import socket
    port = 8000
    for p in range(8000, 8020):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', p)) != 0:
                port = p
                break
    uvicorn.run("server:app", host="127.0.0.1", port=port, reload=False)


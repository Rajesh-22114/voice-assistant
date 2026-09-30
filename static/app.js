// LEO AI Assistant - Enterprise React 18 Frontend Application (v3.2.0)

const { useState, useEffect, useRef } = React;

// Play Web Audio Chime Sound
const playChimeSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio chime playback notice:", e);
  }
};

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assistantOnline, setAssistantOnline] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [assistantState, setAssistantState] = useState('idle'); // 'idle' | 'wake_word' | 'listening' | 'processing' | 'speaking' | 'error' | 'offline'
  
  // System Vitals
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  const [batteryInfo, setBatteryInfo] = useState({ percent: 88, power_plugged: true, status: '88% (Plugged in)' });
  const [networkInfo, setNetworkInfo] = useState({ bytes_sent: 14200000, bytes_recv: 48500000, speed_text: 'Sent 14.2 MB, Recv 48.5 MB' });
  const [cpuUsage, setCpuUsage] = useState(18);
  const [memoryUsage, setMemoryUsage] = useState(42);

  // Live Speech Recognition Feedback
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceErrorMsg, setVoiceErrorMsg] = useState('');

  // Data collections
  const [contacts, setContacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [transcript, setTranscript] = useState([
    { sender: 'assistant', text: 'Hello! I am LEO, your voice controlled productivity assistant. How can I help you today?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [textInput, setTextInput] = useState('');

  // Settings & Configuration
  const [settings, setSettings] = useState({
    assistantName: 'Leo',
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    voiceIndex: 0,
    theme: 'dark',
    micSource: 'Default Microphone',
    apiUrl: 'http://127.0.0.1:8000'
  });

  const [aiConfig, setAiConfig] = useState({
    ai_mode: 'local',
    active_provider: 'gemini',
    provider_models: {
      gemini: 'gemini-2.5-flash',
      openai: 'gpt-4o-mini',
      groq: 'openai/gpt-oss-20b',
      anthropic: 'claude-3-5-sonnet-20241022',
      openrouter: 'google/gemini-2.5-flash',
      ollama: 'llama3'
    },
    keys_configured: {}
  });

  const [startupSettings, setStartupSettings] = useState({
    autostart_enabled: false,
    start_minimized: true,
    enable_wake_word: true,
    run_in_background: true
  });
  
  const [wakeWordActive, setWakeWordActive] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', nickname: '', whatsapp_enabled: true, notes: '' });

  // Interactive Message Prompt Modal
  const [pendingMessageContact, setPendingMessageContact] = useState(null);
  const [customMessageContent, setCustomMessageContent] = useState('');
  const [isMessagePromptOpen, setIsMessagePromptOpen] = useState(false);

  // Web Speech Recognition references & Synchronous Execution Locks
  const recognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);
  const listenTimeoutRef = useRef(null);

  // SYNCHRONOUS LOCK REFS TO PREVENT RACE CONDITIONS & MIC CONTENTION
  const isWakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // Initialize Voices & Real-time Clock & Battery/Network sync
  useEffect(() => {
    // Clock tick
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    }, 1000);

    // Fetch SpeechSynthesis Voices
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Fetch initial server configs & data
    fetchContacts();
    fetchHistory();
    fetchSystemVitals();
    fetchAIConfig();
    fetchStartupSettings();

    // Vitals polling interval
    const vitalsInterval = setInterval(fetchSystemVitals, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(vitalsInterval);
    };
  }, []);

  // Background Wake Word Detection Loop ("Hey Leo" / "Leo" / "Hi Leo")
  useEffect(() => {
    if (!wakeWordActive) {
      if (wakeWordRecognitionRef.current) {
        try { wakeWordRecognitionRef.current.abort(); } catch(e) {}
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let wakeRecog = wakeWordRecognitionRef.current;
    if (!wakeRecog) {
      wakeRecog = new SpeechRecognition();
      wakeRecog.continuous = true;
      wakeRecog.interimResults = true;
      wakeRecog.lang = navigator.language || 'en-US';

      wakeRecog.onresult = (event) => {
        // Synchronous check: Ignore if waking, listening for command, or assistant is speaking
        if (isWakingRef.current || isListeningRef.current || isSpeakingRef.current) return;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const rawSpeech = event.results[i][0].transcript.toLowerCase();
          const cleanSpeech = rawSpeech.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
          
          if (cleanSpeech.includes('hey leo') || cleanSpeech.includes('hi leo') || cleanSpeech === 'leo' || cleanSpeech.startsWith('leo ') || cleanSpeech.includes('leo')) {
            console.log('Wake Word Triggered Clean:', cleanSpeech);
            
            // Immediately set synchronous lock to prevent wakeRecog.onend from restarting
            isWakingRef.current = true;
            try { wakeRecog.abort(); } catch(e) {}

            // Check if full command was spoken in one go (e.g. "hey leo play shape of you")
            let extractedCommand = "";
            if (cleanSpeech.startsWith('hey leo ')) extractedCommand = cleanSpeech.replace('hey leo ', '').trim();
            else if (cleanSpeech.startsWith('hi leo ')) extractedCommand = cleanSpeech.replace('hi leo ', '').trim();
            else if (cleanSpeech.startsWith('leo ')) extractedCommand = cleanSpeech.replace('leo ', '').trim();

            setAssistantState('wake_word');
            playChimeSound();

            if (extractedCommand && extractedCommand.length > 2) {
              setInterimTranscript(`Recognized: "${cleanSpeech}"`);
              speakText(`Yes Boss, executing ${extractedCommand}`, () => {
                isWakingRef.current = false;
                handleExecuteCommand(extractedCommand);
              });
            } else {
              setInterimTranscript('Wake word detected! "Yes Boss, how can I help you"');
              speakText("Yes Boss, how can I help you", () => {
                isWakingRef.current = false;
                setTimeout(() => {
                  startListening();
                }, 200);
              });
            }
            break;
          }
        }
      };

      wakeRecog.onerror = (event) => {
        console.warn('Wake word error notice:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceErrorMsg("Microphone permission blocked. Please click the mic icon in your browser URL bar!");
        }
      };

      wakeRecog.onend = () => {
        // SYNCHRONOUS LOCK CHECK: Only restart if NOT waking, listening, or speaking!
        if (wakeWordActive && !isWakingRef.current && !isListeningRef.current && !isSpeakingRef.current) {
          try { wakeRecog.start(); } catch(e) {}
        }
      };

      wakeWordRecognitionRef.current = wakeRecog;
    }

    if (!isWakingRef.current && !isListeningRef.current && !isSpeakingRef.current) {
      try { wakeRecog.start(); } catch(e) {}
    } else {
      try { wakeRecog.abort(); } catch(e) {}
    }
  }, [wakeWordActive, assistantState]);

  // Fetch server vitals
  const fetchSystemVitals = async () => {
    try {
      const res = await fetch(`${settings.apiUrl}/api/status`);
      if (res.ok) {
        const data = await res.json();
        setBatteryInfo(data.battery);
        setNetworkInfo(data.network);
        setCpuUsage(data.cpu_percent || 24);
        setMemoryUsage(data.memory_percent || 45);
      }
    } catch (e) {
      if ('getBattery' in navigator) {
        navigator.getBattery().then(b => {
          setBatteryInfo({
            percent: Math.round(b.level * 100),
            power_plugged: b.charging,
            status: `${Math.round(b.level * 100)}% (${b.charging ? 'Plugged in' : 'Battery'})`
          });
        });
      }
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${settings.apiUrl}/api/contacts`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (e) {
      const defaultContacts = [
        { id: 'cnt-101', name: 'Rajesh', phone: '+919876543210', email: 'rajesh@example.com', nickname: 'Raj', whatsapp_enabled: true, last_message_sent: '2026-09-08 10:15 AM', notes: 'Work Lead' },
        { id: 'cnt-102', name: 'Ravi', phone: '+919999999999', email: 'ravi@example.com', nickname: 'Rav', whatsapp_enabled: true, last_message_sent: '2026-09-07 04:30 PM', notes: 'College Friend' },
        { id: 'cnt-103', name: 'Priya', phone: '+919812345678', email: 'priya@example.com', nickname: 'Pree', whatsapp_enabled: true, last_message_sent: '2026-09-06 09:12 AM', notes: 'Designer' }
      ];
      setContacts(defaultContacts);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${settings.apiUrl}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      setHistory([
        { id: 'act-001', timestamp: '2026-09-08 10:30:15 AM', command: 'Leo what is the time', response: 'The current time is 10:30 AM', status: 'Success', type: 'Time' }
      ]);
    }
  };

  const fetchAIConfig = async () => {
    try {
      const res = await fetch(`${settings.apiUrl}/api/config/ai`);
      if (res.ok) {
        const data = await res.json();
        setAiConfig(data);
      }
    } catch (e) {}
  };

  const fetchStartupSettings = async () => {
    try {
      const res = await fetch(`${settings.apiUrl}/api/startup/settings`);
      if (res.ok) {
        const data = await res.json();
        setStartupSettings(data);
        if (data.enable_wake_word !== undefined) {
          setWakeWordActive(data.enable_wake_word);
        }
      }
    } catch (e) {}
  };

  // Speak Text Function with optional completion callback
  const speakText = (text, onComplete = null) => {
    if (!('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }
    window.speechSynthesis.cancel(); // cancel any active speech immediately
    
    isSpeakingRef.current = true;
    setAssistantState('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceSpeed;
    utterance.pitch = settings.voicePitch;
    
    if (availableVoices.length > 0) {
      utterance.voice = availableVoices[settings.voiceIndex] || availableVoices[0];
    }
    
    const handleSpeechEnd = () => {
      isSpeakingRef.current = false;
      if (onComplete) {
        onComplete();
      } else {
        setAssistantState('idle');
      }
    };

    utterance.onend = handleSpeechEnd;
    utterance.onerror = handleSpeechEnd;

    window.speechSynthesis.speak(utterance);
  };

  // Execute Voice / Text Command
  const handleExecuteCommand = async (cmdText) => {
    if (!cmdText || !cmdText.trim()) return;

    const userMsg = { sender: 'user', text: cmdText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setTranscript(prev => [...prev, userMsg]);
    setTextInput('');
    setAssistantState('processing');
    setInterimTranscript('');

    let responseText = "";
    let openUrl = null;

    try {
      const res = await fetch(`${settings.apiUrl}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdText })
      });

      if (res.ok) {
        const data = await res.json();
        responseText = data.response;

        if (data.action === "prompt_message" && data.recipient) {
          setPendingMessageContact(data.recipient);
          setCustomMessageContent('');
          setIsMessagePromptOpen(true);
        }

        if (data.url) {
          openUrl = data.url;
          try {
            window.open(data.url, '_blank');
          } catch (winErr) {
            console.warn('Browser popup blocked:', winErr);
          }
        }
      } else {
        throw new Error('API server returned error');
      }
    } catch (e) {
      // Offline / Client-side Fallback
      const clean = cmdText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
      
      if (clean.includes('time') || clean.includes('clock')) {
        responseText = `The current time is ${new Date().toLocaleTimeString()}`;
      } else if (clean.includes('play') || clean.includes('youtube')) {
        const song = clean.replace('play', '').replace('youtube', '').replace('song', '').replace('leo', '').trim();
        openUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song || 'popular music')}`;
        window.open(openUrl, '_blank');
        responseText = `Playing ${song || 'music'} on YouTube`;
      } else if (clean.includes('search') || clean.includes('google')) {
        const q = clean.replace('search', '').replace('google', '').replace('find', '').replace('leo', '').trim();
        openUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
        window.open(openUrl, '_blank');
        responseText = `Searching Google for ${q}`;
      } else if (clean.includes('message') || clean.includes('whatsapp')) {
        const words = clean.replace('message', '').replace('whatsapp', '').replace('leo', '').replace('send', '').replace('to', '').trim().split(' ');
        const nameQuery = words[0] || '';
        const target = contacts.find(c => c.name.toLowerCase().includes(nameQuery) || (c.nickname && c.nickname.toLowerCase().includes(nameQuery)));
        if (target) {
          setPendingMessageContact(target);
          setCustomMessageContent(words.slice(1).join(' ') || '');
          setIsMessagePromptOpen(true);
          responseText = `Found ${target.name}. Please enter your message content in the prompt modal.`;
        } else {
          responseText = `Could not find contact '${nameQuery}' in your contacts list.`;
        }
      } else if (clean.includes('battery')) {
        responseText = `Battery level is ${batteryInfo.percent}%`;
      } else if (clean.includes('network') || clean.includes('speed')) {
        responseText = `Current network throughput: ${networkInfo.speed_text}`;
      } else if (clean.includes('stop')) {
        responseText = `Leo assistant stopped. Have a productive day!`;
      } else {
        responseText = `I heard: "${cmdText}". I can help you search Google, play YouTube videos, check system vitals, or message contacts.`;
      }
    }

    const leoMsg = { sender: 'assistant', text: responseText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setTranscript(prev => [...prev, leoMsg]);

    fetchHistory();
    fetchContacts();

    speakText(responseText);
  };

  // Send WhatsApp Message Handler (Modal Confirmation)
  const handleConfirmSendMessage = async () => {
    if (!pendingMessageContact) return;
    const msg = customMessageContent.trim() || `Hello ${pendingMessageContact.name}, sent via LEO AI Assistant!`;

    try {
      const res = await fetch(`${settings.apiUrl}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pendingMessageContact.name,
          phone: pendingMessageContact.phone,
          message: msg
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) window.open(data.url, '_blank');
        const confirmText = `WhatsApp message dispatched to ${pendingMessageContact.name}: "${msg}"`;
        setTranscript(prev => [...prev, { sender: 'assistant', text: confirmText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        speakText(confirmText);
      }
    } catch (e) {
      const cleanPhone = pendingMessageContact.phone.replace(/ /g, "").replace(/-/g, "");
      const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    }

    setIsMessagePromptOpen(false);
    setPendingMessageContact(null);
    setCustomMessageContent('');
    fetchContacts();
  };

  // Mic Listen Trigger for Command Speech Recognition
  const startListening = async () => {
    setVoiceErrorMsg('');
    if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);

    // Abort wake word recognizer to guarantee zero mic contention
    if (wakeWordRecognitionRef.current) {
      try { wakeWordRecognitionRef.current.abort(); } catch(e) {}
    }

    // Interrupt active TTS response immediately if user speaks or taps
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech Recognition API is not supported in this browser. You can type commands in the text prompt!");
      return;
    }

    if (isListeningRef.current) {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e) {}
      }
      isListeningRef.current = false;
      setAssistantState('idle');
      setInterimTranscript('');
      return;
    }

    // Request browser mic stream
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (err) {
      console.warn('Microphone permission request failed:', err);
      setVoiceErrorMsg("Microphone permission denied. Please click the camera/mic icon in address bar!");
      setAssistantState('error');
      return;
    }

    isListeningRef.current = true;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setAssistantState('listening');
      setInterimTranscript('Listening for your command...');

      // 10-second timeout waiting for input voice
      listenTimeoutRef.current = setTimeout(() => {
        console.log('Command listening timeout - returning to idle');
        try { recognition.abort(); } catch(e) {}
        isListeningRef.current = false;
        setInterimTranscript('No voice command heard.');
        setAssistantState('idle');
      }, 10000);
    };

    recognition.onresult = (event) => {
      if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);

      let interim = '';
      let finalSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (interim) {
        setInterimTranscript(`Hearing: "${interim}"...`);
      }

      if (finalSpeech) {
        isListeningRef.current = false;
        setInterimTranscript(`Recognized: "${finalSpeech}"`);
        setAssistantState('processing');
        handleExecuteCommand(finalSpeech);
      }
    };

    recognition.onerror = (event) => {
      if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
      console.error('Speech recognition error:', event.error);
      isListeningRef.current = false;

      if (event.error === 'no-speech') {
        setVoiceErrorMsg("No speech heard. Click the Orb to speak again!");
      } else if (event.error === 'not-allowed') {
        setVoiceErrorMsg("Microphone access blocked in browser URL bar.");
      } else {
        setVoiceErrorMsg(`Voice notice: ${event.error}. Click Orb to try again.`);
      }
      setAssistantState('idle');
    };

    recognition.onend = () => {
      if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
      isListeningRef.current = false;
      if (assistantState === 'listening') {
        setAssistantState('idle');
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error('Failed to start command recognition:', e);
      isListeningRef.current = false;
      setAssistantState('idle');
    }
  };

  // Contacts handlers
  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;

    const payload = {
      name: contactForm.name.trim(),
      phone: contactForm.phone.trim(),
      email: contactForm.email ? contactForm.email.trim() : "",
      nickname: contactForm.nickname ? contactForm.nickname.trim() : "",
      whatsapp_enabled: Boolean(contactForm.whatsapp_enabled),
      notes: contactForm.notes ? contactForm.notes.trim() : ""
    };

    if (editingContact && editingContact.id) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...payload } : c));
      
      try {
        const res = await fetch(`${settings.apiUrl}/api/contacts/${editingContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          if (updated && updated.id) {
            setContacts(prev => prev.map(c => c.id === editingContact.id ? updated : c));
          }
        }
      } catch (err) {
        console.warn('Backend contact update warning:', err);
      }
    } else {
      const tempContact = { id: `cnt-${Date.now()}`, ...payload, last_message_sent: 'Never' };
      setContacts(prev => [...prev, tempContact]);

      try {
        const res = await fetch(`${settings.apiUrl}/api/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          if (created && created.id) {
            setContacts(prev => prev.map(c => c.id === tempContact.id ? created : c));
          }
        }
      } catch (err) {
        console.warn('Backend contact save warning:', err);
      }
    }

    setIsContactModalOpen(false);
    setEditingContact(null);
    setContactForm({ name: '', phone: '', email: '', nickname: '', whatsapp_enabled: true, notes: '' });
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await fetch(`${settings.apiUrl}/api/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (e) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${settings.apiUrl}/api/contacts/import`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Successfully imported contacts!`);
        fetchContacts();
      } else {
        alert("Failed to import file. Ensure file contains Name and Phone headers.");
      }
    } catch (err) {
      alert("Server import error. Operating in offline mode.");
    }
    setIsImportModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-slate-800 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col justify-between`}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                <i data-lucide="bot" className="w-6 h-6 text-white"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-white tracking-wide">LEO <span className="text-cyan-400">AI</span></h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Voice Assistant</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
              { id: 'assistant', label: 'Voice Assistant', icon: 'mic' },
              { id: 'commands', label: 'Commands', icon: 'terminal' },
              { id: 'contacts', label: 'Contacts', icon: 'users' },
              { id: 'history', label: 'Activity History', icon: 'history' },
              { id: 'settings', label: 'Settings', icon: 'settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <i data-lucide={item.icon} className={`w-5 h-5 ${activeTab === item.id ? 'text-cyan-400' : 'text-slate-400'}`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Status */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center space-x-3">
              <span className={`w-2.5 h-2.5 rounded-full ${assistantOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-rose-500'}`}></span>
              <div>
                <p className="text-xs font-semibold text-white">{assistantOnline ? 'Assistant Online' : 'Offline Mode'}</p>
                <p className="text-[10px] text-slate-400">v2.5.0 Enterprise</p>
              </div>
            </div>
            <button 
              onClick={() => setAssistantOnline(!assistantOnline)}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Toggle
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
              <i data-lucide="menu" className="w-6 h-6"></i>
            </button>
            <h2 className="font-display font-bold text-xl text-white capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Wake Word Indicator Toggle */}
            <button
              onClick={() => setWakeWordActive(!wakeWordActive)}
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                wakeWordActive 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle continuous 'Hey Leo' wake word recognition"
            >
              <i data-lucide="ear" className="w-3.5 h-3.5"></i>
              <span>Wake Word: {wakeWordActive ? 'ON' : 'OFF'}</span>
            </button>

            {/* Quick Voice Trigger */}
            <button
              onClick={startListening}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg ${
                assistantState === 'listening'
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <i data-lucide={assistantState === 'listening' ? 'square' : 'mic'} className="w-4 h-4"></i>
              <span>{assistantState === 'listening' ? 'Stop Listening' : 'Speak to Leo'}</span>
            </button>

            {/* Time Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <i data-lucide="clock" className="w-3.5 h-3.5 text-cyan-400"></i>
              <span>{currentTime}</span>
            </div>
          </div>
        </header>

        {/* PAGE VIEWS SWITCHER */}
        <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardHome vitals={{ batteryInfo, networkInfo, currentTime, currentDate, cpuUsage, memoryUsage, assistantOnline, micActive }} startListening={startListening} assistantState={assistantState} handleExecuteCommand={handleExecuteCommand} aiConfig={aiConfig} startupSettings={startupSettings} />}
          {activeTab === 'assistant' && (
            <VoiceAssistantPanel 
              assistantState={assistantState} 
              startListening={startListening} 
              transcript={transcript} 
              textInput={textInput} 
              setTextInput={setTextInput} 
              handleExecuteCommand={handleExecuteCommand} 
              interimTranscript={interimTranscript}
              voiceErrorMsg={voiceErrorMsg}
            />
          )}
          {activeTab === 'commands' && <CommandCenter handleExecuteCommand={handleExecuteCommand} />}
          {activeTab === 'contacts' && (
            <ContactsManager 
              contacts={contacts} 
              onAdd={() => { setEditingContact(null); setContactForm({ name: '', phone: '', email: '', nickname: '', whatsapp_enabled: true, notes: '' }); setIsContactModalOpen(true); }}
              onEdit={(c) => { setEditingContact(c); setContactForm({ name: c.name || '', phone: c.phone || '', email: c.email || '', nickname: c.nickname || '', whatsapp_enabled: c.whatsapp_enabled !== false, notes: c.notes || '' }); setIsContactModalOpen(true); }}
              onDelete={handleDeleteContact}
              onImport={() => setIsImportModalOpen(true)}
              onSendMessage={(contact) => {
                setPendingMessageContact(contact);
                setCustomMessageContent('');
                setIsMessagePromptOpen(true);
              }}
              apiUrl={settings.apiUrl}
            />
          )}
          {activeTab === 'history' && <ActivityHistory history={history} onClear={() => setHistory([])} />}
          {activeTab === 'settings' && (
            <SettingsPage 
              settings={settings} 
              setSettings={setSettings} 
              availableVoices={availableVoices}
              aiConfig={aiConfig}
              setAiConfig={setAiConfig}
              startupSettings={startupSettings}
              setStartupSettings={setStartupSettings}
              wakeWordActive={wakeWordActive}
              setWakeWordActive={setWakeWordActive}
              fetchAIConfig={fetchAIConfig}
              fetchStartupSettings={fetchStartupSettings}
            />
          )}
        </div>
      </main>

      {/* CONTACT EDIT / CREATE MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setIsContactModalOpen(false); setEditingContact(null); } }}>
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-md space-y-4 relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>
              <button 
                type="button"
                onClick={() => { setIsContactModalOpen(false); setEditingContact(null); }} 
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={contactForm.name} 
                  onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="e.g. Rajesh Sharma"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Phone Number (with Country Code) *</label>
                <input 
                  type="text" 
                  required 
                  value={contactForm.phone} 
                  onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="+919876543210"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={contactForm.email || ''} 
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-xs"
                    placeholder="rajesh@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Nickname</label>
                  <input 
                    type="text" 
                    value={contactForm.nickname || ''} 
                    onChange={e => setContactForm({...contactForm, nickname: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-xs"
                    placeholder="Raj"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="wa_chk"
                  checked={contactForm.whatsapp_enabled} 
                  onChange={e => setContactForm({...contactForm, whatsapp_enabled: e.target.checked})}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="wa_chk" className="text-xs text-slate-300 font-medium">WhatsApp Enabled</label>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Notes / Relationship</label>
                <input 
                  type="text" 
                  value={contactForm.notes || ''} 
                  onChange={e => setContactForm({...contactForm, notes: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="e.g. Work colleague"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => { setIsContactModalOpen(false); setEditingContact(null); }} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT CONTACTS MODAL WITH TOP CORNER X BUTTON */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setIsImportModalOpen(false); }}>
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-md space-y-4 relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Import Contacts File</h3>
              <button 
                type="button"
                onClick={() => setIsImportModalOpen(false)} 
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>
            <p className="text-xs text-slate-400">Supported formats: CSV, Excel (.xlsx), or JSON files containing Name and Phone headers.</p>

            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900/40 relative">
              <input type="file" accept=".csv,.xlsx,.json" onChange={handleFileUpload} className="hidden" id="file_import_input" />
              <label htmlFor="file_import_input" className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                  <i data-lucide="upload-cloud" className="w-6 h-6"></i>
                </div>
                <p className="text-xs font-semibold text-slate-200">Click to upload or drag & drop</p>
                <p className="text-[10px] text-slate-500">CSV, XLSX, or JSON</p>
              </label>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-3">
                <a href="/sample_contacts.csv" download className="text-cyan-400 hover:underline flex items-center space-x-1">
                  <i data-lucide="download" className="w-3.5 h-3.5"></i>
                  <span>Sample CSV</span>
                </a>
                <a href="/sample_contacts.json" download className="text-cyan-400 hover:underline flex items-center space-x-1">
                  <i data-lucide="download" className="w-3.5 h-3.5"></i>
                  <span>Sample JSON</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE WHATSAPP MESSAGE PROMPT MODAL */}
      {isMessagePromptOpen && pendingMessageContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setIsMessagePromptOpen(false); }}>
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-md space-y-4 relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <i data-lucide="message-square" className="w-5 h-5 text-emerald-400"></i>
                <h3 className="text-lg font-bold text-white">Send WhatsApp Message</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsMessagePromptOpen(false)} 
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                {pendingMessageContact.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{pendingMessageContact.name}</p>
                <p className="text-xs font-mono text-slate-400">{pendingMessageContact.phone}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Message Content</label>
              <textarea 
                rows="3"
                value={customMessageContent}
                onChange={e => setCustomMessageContent(e.target.value)}
                placeholder={`Type message to ${pendingMessageContact.name}...`}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsMessagePromptOpen(false)} 
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmSendMessage}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5"
              >
                <i data-lucide="send" className="w-3.5 h-3.5"></i>
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// 1. DASHBOARD HOME VIEW
function DashboardHome({ vitals, startListening, assistantState, handleExecuteCommand, aiConfig, startupSettings }) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* HERO BANNER SECTION */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-cyan-950/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Next-Gen Voice Intelligence</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              LEO <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI Assistant</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              "Your Personal Voice Controlled Productivity Assistant"
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={startListening}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <i data-lucide="mic" className="w-5 h-5"></i>
              <span>Activate Voice</span>
            </button>
          </div>
        </div>
      </div>

      {/* ANIMATED SYSTEM VITALS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Assistant Status */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assistant Status</p>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${vitals.assistantOnline ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-rose-500'}`}></span>
              <p className="text-lg font-bold text-white">{vitals.assistantOnline ? 'Online' : 'Offline'}</p>
            </div>
            <p className="text-[11px] text-slate-500">
              {aiConfig.ai_mode === 'ai' ? `AI Mode (${aiConfig.active_provider})` : 'Local Offline Mode'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <i data-lucide="cpu" className="w-6 h-6"></i>
          </div>
        </div>

        {/* Card 2: Microphone & Wake Word */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Voice Recognition</p>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${assistantState === 'listening' ? 'bg-cyan-400 animate-pulse' : assistantState === 'wake_word' ? 'bg-purple-400 animate-ping' : 'bg-blue-400'}`}></span>
              <p className="text-lg font-bold text-white">
                {assistantState === 'listening' ? 'Listening...' : assistantState === 'wake_word' ? 'Wake Word Detected' : 'Active'}
              </p>
            </div>
            <p className="text-[11px] text-slate-500">Continuous "Hey Leo" Detection</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <i data-lucide="mic" className="w-6 h-6"></i>
          </div>
        </div>

        {/* Card 3: Current Time */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Clock</p>
            <p className="text-lg font-bold text-white font-mono tracking-tight">{vitals.currentTime}</p>
            <p className="text-[11px] text-slate-500">{vitals.currentDate}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <i data-lucide="clock" className="w-6 h-6"></i>
          </div>
        </div>

        {/* Card 4: Battery Percentage */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1 w-full mr-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Battery Level</p>
              <span className="text-xs font-bold text-cyan-400">{vitals.batteryInfo.percent}%</span>
            </div>
            <p className="text-lg font-bold text-white">{vitals.batteryInfo.power_plugged ? 'Plugged In' : 'On Battery'}</p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${vitals.batteryInfo.percent}%` }}></div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <i data-lucide="battery-charging" className="w-6 h-6"></i>
          </div>
        </div>

        {/* Card 5: Network Usage */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Network Throughput</p>
            <p className="text-lg font-bold text-white">{roundMB(vitals.networkInfo.bytes_recv)} MB Recv</p>
            <p className="text-[11px] text-slate-500">{roundMB(vitals.networkInfo.bytes_sent)} MB Sent • Connected</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <i data-lucide="wifi" className="w-6 h-6"></i>
          </div>
        </div>

        {/* Card 6: Auto-Start Status */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Startup</p>
            <p className="text-lg font-bold text-white">
              {startupSettings.autostart_enabled ? 'Auto-Start ON' : 'Auto-Start OFF'}
            </p>
            <p className="text-[11px] text-slate-500">Windows Registry Startup</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${startupSettings.autostart_enabled ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
            <i data-lucide="power" className="w-6 h-6"></i>
          </div>
        </div>

      </div>

      {/* QUICK COMMAND LAUNCHER BAR */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <i data-lucide="zap" className="w-4 h-4 text-cyan-400"></i>
          <span>Popular Voice Commands</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'What is the time', cmd: 'Leo what is the time', icon: 'clock' },
            { label: 'Play Shape of You', cmd: 'Leo play shape of you', icon: 'play' },
            { label: 'Who is Elon Musk', cmd: 'Leo who is Elon Musk', icon: 'search' },
            { label: 'Check Battery', cmd: 'Leo battery status', icon: 'battery' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteCommand(item.cmd)}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:bg-slate-800/50 group"
            >
              <div className="flex items-center space-x-2 mb-1">
                <i data-lucide={item.icon} className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-bold text-white">{item.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">"{item.cmd}"</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// 2. VOICE ASSISTANT PANEL (ANIMATED AI ORB)
function VoiceAssistantPanel({ assistantState, startListening, transcript, textInput, setTextInput, handleExecuteCommand, interimTranscript, voiceErrorMsg }) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [transcript, interimTranscript, assistantState]);

  const stateColors = {
    idle: 'from-blue-600 to-cyan-500 orb-idle',
    wake_word: 'from-cyan-300 via-blue-500 to-purple-600 orb-wake_word',
    listening: 'from-cyan-400 to-blue-500 orb-listening',
    processing: 'from-purple-500 to-pink-500 orb-processing',
    speaking: 'from-emerald-400 to-cyan-500 orb-speaking',
    error: 'from-amber-500 to-rose-500 orb-error'
  };

  const stateLabels = {
    idle: 'Idle - Say "Hey Leo" or tap orb',
    wake_word: 'Wake Word Detected! "Yes Boss, how can I help you"',
    listening: 'Listening to your command...',
    processing: 'Processing command...',
    speaking: 'Speaking response (Tap to interrupt)...',
    error: 'Notice - Tap orb to reset'
  };

  return (
    <div className="space-y-6">
      
      {/* ORB STAGE CONTAINER */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
        
        {/* Background glow circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className={`w-80 h-80 rounded-full blur-3xl transition-colors duration-700 ${
            assistantState === 'speaking' ? 'bg-emerald-500/20' : assistantState === 'processing' ? 'bg-purple-500/20' : 'bg-cyan-500/20'
          }`}></div>
        </div>

        {/* Status Pill Badge */}
        <div className="mb-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-semibold text-cyan-400 shadow-inner">
          <span className={`w-2.5 h-2.5 rounded-full ${
            assistantState === 'listening' ? 'bg-cyan-400 animate-ping' : assistantState === 'wake_word' ? 'bg-purple-400 animate-ping' : assistantState === 'speaking' ? 'bg-emerald-400 animate-bounce' : assistantState === 'error' ? 'bg-amber-400' : 'bg-blue-400'
          }`}></span>
          <span>{stateLabels[assistantState] || 'Idle'}</span>
        </div>

        {/* Live Speech Recognition Feedback Banner */}
        {interimTranscript && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium font-mono animate-pulse max-w-lg">
            <i data-lucide="mic" className="w-3.5 h-3.5 inline mr-2 text-cyan-400"></i>
            <span>{interimTranscript}</span>
          </div>
        )}

        {/* Error / Help Banner */}
        {voiceErrorMsg && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium max-w-lg">
            <i data-lucide="alert-circle" className="w-3.5 h-3.5 inline mr-2 text-amber-400"></i>
            <span>{voiceErrorMsg}</span>
          </div>
        )}

        {/* Glowing Animated Orb Circle */}
        <div 
          onClick={startListening}
          className={`w-44 h-44 rounded-full bg-gradient-to-tr ${stateColors[assistantState] || stateColors.idle} cursor-pointer shadow-2xl transition-all duration-500 flex items-center justify-center relative my-4 group`}
          title={assistantState === 'speaking' ? 'Tap to Interrupt Speech' : 'Tap to Speak'}
        >
          <div className="w-36 h-36 rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-2 border border-white/20">
            <i data-lucide={
              assistantState === 'listening' ? 'mic' : assistantState === 'speaking' ? 'volume-x' : assistantState === 'processing' ? 'loader' : 'bot'
            } className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform"></i>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
              {assistantState === 'speaking' ? 'Tap to Interrupt' : assistantState === 'listening' ? 'Tap to Stop' : 'Tap to Speak'}
            </span>
          </div>
        </div>

        {/* Audio Waveform Visualization Bars */}
        <div className="flex items-center justify-center space-x-1.5 h-8 my-3">
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>

        <p className="text-slate-400 text-sm font-medium">"Say 'Hey Leo' or speak naturally"</p>
        <p className="text-slate-500 text-xs mt-1">Try: "Leo what is the time", "Leo play shape of you", or "Leo message Rajesh"</p>
      </div>

      {/* TRANSCRIPT & TEXT INPUT BAR */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversation Log</h3>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {transcript.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                msg.sender === 'user' 
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 rounded-br-none' 
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
              }`}>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-bold">{msg.sender === 'user' ? 'You' : 'LEO AI'}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Manual Text Prompt Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleExecuteCommand(textInput); }} className="flex space-x-2 pt-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your command here (e.g. Leo message Rajesh)..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1"
          >
            <span>Send</span>
            <i data-lucide="send" className="w-3.5 h-3.5"></i>
          </button>
        </form>
      </div>

    </div>
  );
}

// 3. COMMAND CENTER VIEW
function CommandCenter({ handleExecuteCommand }) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, []);

  const commandsList = [
    { title: 'Time Commands', voice: 'Leo what is the time', action: 'Returns current time.', icon: 'clock', category: 'System' },
    { title: 'YouTube Direct Play', voice: 'Leo play shape of you', action: 'Plays song directly on YouTube via pywhatkit.', icon: 'play-circle', category: 'Media' },
    { title: 'Google Search', voice: 'Leo search Python tutorials', action: 'Search query on Google.', icon: 'search', category: 'Web' },
    { title: 'Wikipedia / Groq AI', voice: 'Leo who is Elon Musk', action: 'Returns AI or Wikipedia summary.', icon: 'book-open', category: 'Knowledge' },
    { title: 'WhatsApp Messaging', voice: 'Leo message Rajesh', action: 'Prompts message content and opens WhatsApp Web.', icon: 'message-square', category: 'Social' },
    { title: 'Battery Status', voice: 'Leo battery status', action: 'Returns battery percentage.', icon: 'battery-charging', category: 'Hardware' },
    { title: 'Network Speed', voice: 'Leo network speed', action: 'Returns current network traffic.', icon: 'wifi', category: 'Network' },
    { title: 'Assistant Capabilities', voice: 'Leo what can you do', action: 'Lists all supported capabilities.', icon: 'info', category: 'System' },
    { title: 'Stop Assistant', voice: 'Leo stop', action: 'Terminates assistant session.', icon: 'power', category: 'System' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Command Center</h2>
          <p className="text-xs text-slate-400">Supported voice commands and actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {commandsList.map((cmd, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <i data-lucide={cmd.icon} className="w-5 h-5"></i>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {cmd.category}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{cmd.title}</h3>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs text-cyan-300">
                "{cmd.voice}"
              </div>
              <p className="text-xs text-slate-400">{cmd.action}</p>
            </div>

            <button
              onClick={() => handleExecuteCommand(cmd.voice)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-semibold text-xs transition-all flex items-center justify-center space-x-2"
            >
              <i data-lucide="play" className="w-3.5 h-3.5"></i>
              <span>Try Command</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. CONTACTS MANAGEMENT MODULE (WITH EXPORT & FULL EDIT)
function ContactsManager({ contacts, onAdd, onEdit, onDelete, onImport, onSendMessage, apiUrl }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [contacts]);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    (c.nickname && c.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExport = (format) => {
    window.open(`${apiUrl}/api/contacts/export?format=${format}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Contacts Directory</h2>
          <p className="text-xs text-slate-400 font-medium">Manage contacts for automated WhatsApp voice messaging</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Export Dropdown */}
          <div className="relative group">
            <button className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-2 border border-slate-700">
              <i data-lucide="download" className="w-4 h-4 text-cyan-400"></i>
              <span>Export</span>
            </button>
            <div className="absolute right-0 mt-1 w-32 glass-panel border border-slate-700 rounded-xl shadow-xl hidden group-hover:block z-50 p-1 space-y-1">
              <button onClick={() => handleExport('csv')} className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center space-x-2">
                <i data-lucide="file-text" className="w-3.5 h-3.5 text-cyan-400"></i>
                <span>CSV Format</span>
              </button>
              <button onClick={() => handleExport('json')} className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center space-x-2">
                <i data-lucide="code" className="w-3.5 h-3.5 text-cyan-400"></i>
                <span>JSON Format</span>
              </button>
            </div>
          </div>

          <button
            onClick={onImport}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-2 border border-slate-700"
          >
            <i data-lucide="file-up" className="w-4 h-4 text-cyan-400"></i>
            <span>Import</span>
          </button>

          <button
            onClick={onAdd}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <i data-lucide="user-plus" className="w-4 h-4"></i>
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <i data-lucide="search" className="w-4 h-4 text-slate-500 absolute left-4 top-3.5"></i>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name, nickname, phone, or email..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Contacts Data Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4 pl-6">Contact Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
                <th className="p-4">WhatsApp Status</th>
                <th className="p-4">Last Message</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(c => (
                  <tr key={c.id || c.phone} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-extrabold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span>{c.name}</span>
                        {c.nickname && <span className="ml-2 text-[10px] text-cyan-400 font-mono">({c.nickname})</span>}
                        {c.notes && <p className="text-[10px] text-slate-500 font-normal">{c.notes}</p>}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{c.phone}</td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">{c.email || '—'}</td>
                    <td className="p-4">
                      {c.whatsapp_enabled !== false ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          <i data-lucide="check-circle-2" className="w-3 h-3"></i>
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Disabled</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">{c.last_message_sent || 'Never'}</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button 
                        onClick={() => onSendMessage(c)}
                        title="Send Message"
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                      >
                        <i data-lucide="message-square" className="w-4 h-4"></i>
                      </button>
                      <button 
                        onClick={() => onEdit(c)}
                        title="Edit Contact"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <i data-lucide="edit" className="w-4 h-4"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(c.id)}
                        title="Delete Contact"
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <i data-lucide="trash-2" className="w-4 h-4"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No contacts found. Click "Add Contact" or "Import".</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 5. ACTIVITY HISTORY VIEW
function ActivityHistory({ history, onClear }) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [history]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Activity History</h2>
          <p className="text-xs text-slate-400">Logs of voice commands and system responses</p>
        </div>
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 flex items-center space-x-1.5"
        >
          <i data-lucide="trash" className="w-3.5 h-3.5"></i>
          <span>Clear Logs</span>
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Command</th>
                <th className="p-4">Response</th>
                <th className="p-4">Category</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 text-slate-400 font-mono text-[11px] whitespace-nowrap">{item.timestamp}</td>
                    <td className="p-4 font-semibold text-white font-mono">{item.command}</td>
                    <td className="p-4 text-slate-300 max-w-md">{item.response}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700">
                        {item.type || 'General'}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No activity logs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 6. SETTINGS PAGE (AI PROVIDER CONFIG & AUTOSTART BUTTON & WAKE WORD)
function SettingsPage({ settings, setSettings, availableVoices, aiConfig, setAiConfig, startupSettings, setStartupSettings, wakeWordActive, setWakeWordActive, fetchAIConfig, fetchStartupSettings }) {
  const [selectedProvider, setSelectedProvider] = useState(aiConfig.active_provider || 'gemini');
  const [selectedModel, setSelectedModel] = useState(aiConfig.provider_models?.[aiConfig.active_provider || 'gemini'] || 'gemini-2.5-flash');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  const [testStatus, setTestStatus] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [aiConfig, selectedProvider, testStatus]);

  const providerModels = {
    gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash'],
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    groq: ['openai/gpt-oss-20b', 'qwen/qwen3.6-27b', 'llama-3.3-70b-versatile', 'llama3-8b-8192'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    openrouter: ['google/gemini-2.5-flash', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct'],
    ollama: ['llama3', 'mistral', 'phi3', 'gemma2']
  };

  const handleProviderSelect = (p) => {
    setSelectedProvider(p);
    const defaultMod = providerModels[p]?.[0] || '';
    setSelectedModel(aiConfig.provider_models?.[p] || defaultMod);
    setApiKeyInput('');
    setTestStatus(null);
  };

  const handleSaveAIConfig = async (newMode = null) => {
    const mode = newMode || aiConfig.ai_mode;
    setSaveStatus({ type: 'loading', message: 'Saving configuration...' });

    const payload = {
      ai_mode: mode,
      active_provider: selectedProvider,
      provider: selectedProvider,
      model: selectedModel,
      api_key: apiKeyInput.trim() || undefined
    };

    try {
      const res = await fetch(`${settings.apiUrl}/api/config/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveStatus({ type: 'success', message: 'AI configuration saved successfully!' });
        fetchAIConfig();
        setApiKeyInput('');
      } else {
        setSaveStatus({ type: 'error', message: 'Failed to save configuration.' });
      }
    } catch (e) {
      setSaveStatus({ type: 'error', message: 'Network error saving configuration.' });
    }
  };

  const handleTestConnection = async () => {
    setTestStatus({ type: 'loading', message: `Testing connection to ${selectedProvider.toUpperCase()} (${selectedModel})...` });

    try {
      const res = await fetch(`${settings.apiUrl}/api/config/ai/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          api_key: apiKeyInput.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setTestStatus({ type: 'success', message: data.message + (data.response ? ` Response: "${data.response}"` : '') });
      } else {
        setTestStatus({ type: 'error', message: data.message || 'Connection test failed.' });
      }
    } catch (e) {
      setTestStatus({ type: 'error', message: 'Error connecting to test API endpoint.' });
    }
  };

  const handleDeleteKey = async () => {
    if (!confirm(`Are you sure you want to delete the stored API key for ${selectedProvider.toUpperCase()}?`)) return;

    try {
      const res = await fetch(`${settings.apiUrl}/api/config/ai/key?provider=${selectedProvider}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert(`API key for ${selectedProvider.toUpperCase()} removed.`);
        fetchAIConfig();
      }
    } catch (e) {
      alert("Error removing API key.");
    }
  };

  // Toggle Auto Start Button
  const handleToggleAutoStart = async () => {
    const targetState = !startupSettings.autostart_enabled;
    try {
      const res = await fetch(`${settings.apiUrl}/api/startup/toggle?enable=${targetState}`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchStartupSettings();
      }
    } catch (e) {
      alert("Failed to toggle Windows Registry autostart.");
    }
  };

  const handleUpdateStartupOptions = async (field, val) => {
    const updated = { ...startupSettings, [field]: val };
    setStartupSettings(updated);

    try {
      await fetch(`${settings.apiUrl}/api/startup/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white">System & AI Settings</h2>
        <p className="text-xs text-slate-400">Configure AI Providers, Auto-Start Manager, Voice Synthesizer & Wake Word</p>
      </div>

      {/* FEATURE 1: AI PROVIDER CONFIGURATION */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <i data-lucide="brain" className="w-5 h-5 text-cyan-400"></i>
              <span>AI Provider Configuration</span>
            </h3>
            <p className="text-xs text-slate-400">Switch between Local Mode and multi-provider Cloud AI</p>
          </div>

          {/* Local vs AI Mode Toggle */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setAiConfig({ ...aiConfig, ai_mode: 'local' });
                handleSaveAIConfig('local');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                aiConfig.ai_mode === 'local' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Local Mode
            </button>
            <button
              onClick={() => {
                setAiConfig({ ...aiConfig, ai_mode: 'ai' });
                handleSaveAIConfig('ai');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                aiConfig.ai_mode === 'ai' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Mode
            </button>
          </div>
        </div>

        {aiConfig.ai_mode === 'ai' ? (
          <div className="space-y-5">
            {/* Provider Grid */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">Select AI Provider</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'gemini', name: 'Gemini', desc: 'Google Gemini AI' },
                  { id: 'openai', name: 'OpenAI', desc: 'GPT-4o & Mini' },
                  { id: 'groq', name: 'Groq', desc: 'Fast Llama & Qwen' },
                  { id: 'anthropic', name: 'Claude', desc: 'Anthropic Sonnet' },
                  { id: 'openrouter', name: 'OpenRouter', desc: 'Multi-LLM Router' },
                  { id: 'ollama', name: 'Ollama', desc: 'Local Offline LLM' }
                ].map(p => {
                  const isSelected = selectedProvider === p.id;
                  const isConfigured = aiConfig.keys_configured?.[p.id];
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleProviderSelect(p.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-white">{p.name}</span>
                        {p.id === 'ollama' ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Local Ollama"></span>
                        ) : isConfigured ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="API Key Configured"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-600" title="Key Missing"></span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Selection Dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Model Selection for {selectedProvider.toUpperCase()}</label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              >
                {(providerModels[selectedProvider] || []).map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* API Key Input Field (Except Ollama) */}
            {selectedProvider !== 'ollama' && (
              <div>
                <div className="flex justify-between items-center max-w-md mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">API Key for {selectedProvider.toUpperCase()}</label>
                  {aiConfig.keys_configured?.[selectedProvider] ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Configured in .env</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">Not Set</span>
                  )}
                </div>
                
                <div className="relative max-w-md">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder={aiConfig.keys_configured?.[selectedProvider] ? "•••••••••••••••••••• (Leave blank to keep existing key)" : "Enter API key..."}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    <i data-lucide={showKey ? 'eye-off' : 'eye'} className="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Live Testing / Save Feedback Banners */}
            {testStatus && (
              <div className={`p-3 rounded-xl border text-xs font-mono max-w-md ${
                testStatus.type === 'loading' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 animate-pulse' :
                testStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {testStatus.message}
              </div>
            )}

            {saveStatus && (
              <div className={`p-3 rounded-xl border text-xs font-mono max-w-md ${
                saveStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {saveStatus.message}
              </div>
            )}

            {/* Provider Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleSaveAIConfig()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5"
              >
                <i data-lucide="check" className="w-4 h-4"></i>
                <span>Save Provider & Model</span>
              </button>

              <button
                onClick={handleTestConnection}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center space-x-1.5"
              >
                <i data-lucide="zap" className="w-4 h-4 text-cyan-400"></i>
                <span>Test Connection</span>
              </button>

              {aiConfig.keys_configured?.[selectedProvider] && selectedProvider !== 'ollama' && (
                <button
                  onClick={handleDeleteKey}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 flex items-center space-x-1.5"
                >
                  <i data-lucide="trash-2" className="w-4 h-4"></i>
                  <span>Delete Key</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-white">Local Offline Mode Active</p>
            <p>LEO AI Assistant is running completely offline without requiring any API keys. Basic voice commands (Time, YouTube direct play, Google search, Wikipedia, Battery, Network) remain active.</p>
          </div>
        )}
      </div>

      {/* FEATURE 2: SYSTEM STARTUP MANAGER (AUTO-START BUTTON) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <i data-lucide="power" className="w-5 h-5 text-cyan-400"></i>
            <span>System Startup Manager</span>
          </h3>
          <p className="text-xs text-slate-400">Configure Windows boot startup and background performance options</p>
        </div>

        {/* PROMINENT AUTO-START ENABLE / DISABLE BUTTON */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${startupSettings.autostart_enabled ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-slate-600'}`}></span>
              <p className="text-sm font-bold text-white">
                {startupSettings.autostart_enabled ? 'Auto-Start With System ENABLED' : 'Auto-Start With System DISABLED'}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Windows Registry Path: <span className="font-mono text-slate-300">HKCU\Software\Microsoft\Windows\CurrentVersion\Run</span>
            </p>
          </div>

          <button
            onClick={handleToggleAutoStart}
            className={`px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center space-x-2 ${
              startupSettings.autostart_enabled
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <i data-lucide="power" className="w-4 h-4"></i>
            <span>{startupSettings.autostart_enabled ? 'Disable Auto-Start' : 'Enable Auto-Start'}</span>
          </button>
        </div>

        {/* Startup Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700">
            <input 
              type="checkbox"
              checked={Boolean(startupSettings.start_minimized)}
              onChange={e => handleUpdateStartupOptions('start_minimized', e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <span className="text-xs text-slate-300 font-medium">Start Minimized (--minimized)</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700">
            <input 
              type="checkbox"
              checked={wakeWordActive}
              onChange={e => {
                setWakeWordActive(e.target.checked);
                handleUpdateStartupOptions('enable_wake_word', e.target.checked);
              }}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <span className="text-xs text-slate-300 font-medium">Enable "Hey Leo" Wake Word</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700">
            <input 
              type="checkbox"
              checked={Boolean(startupSettings.run_in_background)}
              onChange={e => handleUpdateStartupOptions('run_in_background', e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <span className="text-xs text-slate-300 font-medium">Run In Background</span>
          </label>
        </div>
      </div>

      {/* GENERAL SPEECH ENGINE SETTINGS */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <i data-lucide="volume-2" className="w-5 h-5 text-cyan-400"></i>
            <span>Speech Synthesizer Voice Settings</span>
          </h3>
        </div>

        {/* Assistant Name */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Assistant Trigger Name</label>
          <input
            type="text"
            value={settings.assistantName}
            onChange={e => setSettings({...settings, assistantName: e.target.value})}
            className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Voice Selection */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Voice Model / Speech Synthesizer</label>
          <select
            value={settings.voiceIndex}
            onChange={e => setSettings({...settings, voiceIndex: parseInt(e.target.value)})}
            className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
          >
            {availableVoices.length > 0 ? (
              availableVoices.map((v, idx) => (
                <option key={idx} value={idx}>{v.name} ({v.lang})</option>
              ))
            ) : (
              <option value={0}>System Default Speech Engine</option>
            )}
          </select>
        </div>

        {/* Voice Speed */}
        <div>
          <div className="flex justify-between items-center max-w-md mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Voice Speed Rate</label>
            <span className="text-xs font-mono text-cyan-400">{settings.voiceSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.voiceSpeed}
            onChange={e => setSettings({...settings, voiceSpeed: parseFloat(e.target.value)})}
            className="w-full max-w-md accent-cyan-500"
          />
        </div>

        {/* API Server Endpoint */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Python FastAPI Backend Server URL</label>
          <input
            type="text"
            value={settings.apiUrl}
            onChange={e => setSettings({...settings, apiUrl: e.target.value})}
            className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
          <p className="text-[10px] text-slate-500 mt-1">Default local server: http://127.0.0.1:8000</p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => alert("Speech settings saved successfully!")}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}

// Utility Helper
function roundMB(bytes) {
  if (!bytes) return 0;
  return (bytes / (1024 * 1024)).toFixed(1);
}

// Render Application
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

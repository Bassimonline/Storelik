import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Save, Play, Loader2, Smartphone, Bot, UserCheck, MapPin, Mic, Clock, Settings, Check, Send, PlayCircle, PauseCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { generateOrderConfirmationTemplate, generateSpeech, replyToCustomer } from '../services/geminiService';
import { AIOrderConfig as AIConfigType } from '../types';

interface AdvancedConfig extends AIConfigType {
  agentName: string;
  phoneNumber: string;
  confirmationPoints: string[];
  enableVoiceNote: boolean;
  requestLocation: boolean;
  smartDelay: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  audioUrl?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

const AIOrderConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testNumber, setTestNumber] = useState('');
  
  // Chat Simulation State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState<AdvancedConfig>({
    language: 'Darija (Moroccan)',
    tone: 'Friendly',
    includeDiscount: false,
    template: '',
    agentName: 'Mehdi',
    phoneNumber: '+212 600-000000',
    confirmationPoints: ['Name', 'City', 'Full Address'],
    enableVoiceNote: true,
    requestLocation: false,
    smartDelay: true
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleGeneratePreview = async () => {
    setLoading(true);
    setMessages([]); // Clear chat
    try {
      // 1. Generate Initial Greeting
      const msgText = await generateOrderConfirmationTemplate(
        config.language, 
        config.tone, 
        'Dukkani Store',
        config.agentName,
        config.confirmationPoints
      );

      setConfig(prev => ({ ...prev, template: msgText }));

      // 2. Add to chat
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: msgText,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'read'
      };

      setMessages([
        { id: 'sys', role: 'system', text: '📦 New Order #1024 Received', timestamp: '', status: 'sent' },
        newMsg
      ]);

      // 3. Generate Audio if enabled
      if (config.enableVoiceNote) {
        setIsTyping(true);
        const audioBase64 = await generateSpeech(msgText);
        setIsTyping(false);
        
        if (audioBase64) {
          // Convert base64 to blob url
          const byteCharacters = atob(audioBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(blob);

          setMessages(prev => [...prev, {
            id: Date.now().toString() + '_audio',
            role: 'model',
            text: '🎤 Voice Note',
            audioUrl: audioUrl,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: 'read'
          }]);
        }
      }

    } catch (error) {
      alert("Error generating template");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Get AI Reply
    try {
      const history = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role as 'user' | 'model',
        text: m.text
      }));

      const replyText = await replyToCustomer(history, userMsg.text, config);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'read'
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const togglePoint = (point: string) => {
    setConfig(prev => {
      const exists = prev.confirmationPoints.includes(point);
      return {
        ...prev,
        confirmationPoints: exists 
          ? prev.confirmationPoints.filter(p => p !== point)
          : [...prev.confirmationPoints, point]
      };
    });
  };

  const playAudio = (url: string, id: string) => {
    if (audioRef.current) {
      if (playingAudioId === id) {
        audioRef.current.pause();
        setPlayingAudioId(null);
      } else {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingAudioId(id);
        audioRef.current.onended = () => setPlayingAudioId(null);
      }
    } else {
      // Init audio
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlayingAudioId(id);
      audioRef.current.onended = () => setPlayingAudioId(null);
    }
  };

  const handleRealWhatsAppTest = () => {
    if (!config.template) {
      alert("Please generate the agent preview first!");
      return;
    }
    if (!testNumber) {
      alert("Please enter your phone number.");
      return;
    }
    
    // Clean number
    let cleanNum = testNumber.replace(/\D/g, '');
    if (!cleanNum.startsWith('212') && cleanNum.startsWith('0')) {
       cleanNum = '212' + cleanNum.substring(1);
    }

    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(config.template)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-8 h-8 text-indigo-600" />
            Auto-Confirmation Agent
          </h1>
          <p className="text-slate-500 mt-2">
            Configure your AI Salesman to automatically confirm COD orders via WhatsApp.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
          <Save className="w-5 h-5" /> Save Agent Config
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONFIGURATION (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Agent Identity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" /> Agent Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Agent Name</label>
                <input 
                  type="text" 
                  value={config.agentName}
                  onChange={(e) => setConfig({...config, agentName: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  placeholder="e.g. Mehdi, Sarah"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Store Number</label>
                <input 
                  type="text" 
                  value={config.phoneNumber}
                  onChange={(e) => setConfig({...config, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  placeholder="+212 6XX-XXXXXX"
                />
              </div>
            </div>
          </div>

          {/* 2. Confirmation Logic */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-600" /> Validation Checklist
            </h3>
            <p className="text-sm text-slate-500 mb-4">Select what the agent needs to confirm with the customer:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Name', 'City', 'Full Address', 'Phone Number', 'Quantity', 'Product Color/Size'].map((point) => (
                <div 
                  key={point}
                  onClick={() => togglePoint(point)}
                  className={`cursor-pointer p-3 rounded-lg border flex items-center gap-3 transition-all ${config.confirmationPoints.includes(point) ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${config.confirmationPoints.includes(point) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                    {config.confirmationPoints.includes(point) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm font-bold">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Behavior & Tone */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" /> Behavior & Tone
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Language</label>
                  <select 
                    value={config.language}
                    onChange={(e) => setConfig({ ...config, language: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  >
                    <option>Darija (Moroccan)</option>
                    <option>Arabic (Standard)</option>
                    <option>French</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Persona Tone</label>
                  <select 
                    value={config.tone}
                    onChange={(e) => setConfig({ ...config, tone: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  >
                    <option>Happy Salesman (Energetic)</option>
                    <option>Professional Support (Formal)</option>
                    <option>Urgent Confirmation (Fast)</option>
                  </select>
               </div>
            </div>

            {/* Advanced Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Mic className="w-5 h-5" /></div>
                   <div>
                      <p className="text-sm font-bold text-slate-900">Send Audio Note</p>
                      <p className="text-xs text-slate-500">AI generates a human-like voice note in Darija.</p>
                   </div>
                </div>
                <button 
                  onClick={() => setConfig({ ...config, enableVoiceNote: !config.enableVoiceNote })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.enableVoiceNote ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${config.enableVoiceNote ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* 4. REAL WORLD TEST */}
           <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-bl-full opacity-50 -mr-4 -mt-4"></div>
            <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2 relative z-10">
              <Smartphone className="w-5 h-5" /> Real World Test Lab
            </h3>
            <p className="text-sm text-emerald-800 mb-4 leading-relaxed max-w-md">
               Want to see the message on your actual phone? Enter your number below to receive the AI-generated test message via WhatsApp Web.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-end">
               <div className="w-full">
                  <label className="block text-xs font-bold text-emerald-800 mb-1 uppercase">Your Test Number</label>
                  <input 
                     type="text" 
                     placeholder="e.g. 0661234567" 
                     value={testNumber}
                     onChange={(e) => setTestNumber(e.target.value)}
                     className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-900 placeholder:text-emerald-300"
                  />
               </div>
               <button 
                  onClick={handleRealWhatsAppTest}
                  className="w-full md:w-auto bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
               >
                  <ExternalLink className="w-5 h-5" /> Send to WhatsApp
               </button>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-emerald-700 bg-white/50 p-2 rounded-lg">
               <AlertTriangle className="w-4 h-4 flex-shrink-0" />
               <p>Note: Audio files cannot be sent via generated web links due to WhatsApp limitations. Only text will be sent in this test.</p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PREVIEW (5 Cols) */}
        <div className="lg:col-span-5">
           <div className="sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                   <h3 className="font-bold text-slate-800">Live Simulation</h3>
                   <p className="text-xs text-slate-500">Interactive Chat Preview</p>
                </div>
                <button
                  onClick={handleGeneratePreview}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Reset & Start
                </button>
              </div>

              {/* Phone Mockup */}
              <div className="w-[340px] h-[680px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl relative mx-auto border-4 border-slate-800">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
                
                <div className="w-full h-full bg-[#E5DDD5] rounded-[2.5rem] overflow-hidden flex flex-col relative">
                    {/* Header */}
                    <div className="bg-[#075E54] h-20 w-full flex items-center px-4 pt-6 text-white shadow-md z-10">
                      <div className="w-10 h-10 rounded-full bg-white/20 mr-3 flex items-center justify-center overflow-hidden border border-white/30">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-base block">{config.agentName} (AI)</span>
                        <span className="text-[10px] opacity-80 block">{config.phoneNumber} • Online</span>
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90 custom-scrollbar">
                      
                      {messages.length === 0 && !loading && (
                         <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60 gap-2">
                           <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                           <p className="text-xs">Initializing Agent...</p>
                        </div>
                      )}

                      {messages.map((msg) => (
                         <div key={msg.id} className={`flex ${msg.role === 'system' ? 'justify-center' : msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            {msg.role === 'system' ? (
                               <span className="bg-[#FFF5C4] text-slate-600 text-[10px] px-2 py-1 rounded shadow-sm border border-yellow-200">
                                 {msg.text}
                               </span>
                            ) : (
                               <div className={`${msg.role === 'user' ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'} p-2 rounded-lg shadow-sm max-w-[85%] min-w-[100px] relative text-sm text-slate-800 leading-relaxed`}>
                                  {msg.role === 'model' && <div className="font-bold text-[10px] text-orange-600 mb-1">~ {config.agentName}</div>}
                                  
                                  {/* Audio Message */}
                                  {msg.audioUrl ? (
                                     <div className="flex items-center gap-3 pr-2">
                                        <button onClick={() => playAudio(msg.audioUrl!, msg.id)} className="text-slate-500">
                                           {playingAudioId === msg.id ? <PauseCircle className="w-8 h-8 text-red-500" /> : <PlayCircle className="w-8 h-8" />}
                                        </button>
                                        <div className="flex-1">
                                           <div className="h-1 bg-slate-200 rounded-full w-24 overflow-hidden">
                                              <div className={`h-full bg-slate-400 ${playingAudioId === msg.id ? 'animate-pulse w-full' : 'w-1/2'}`}></div>
                                           </div>
                                           <span className="text-[10px] text-slate-400 mt-1 block">0:08</span>
                                        </div>
                                        <Mic className="w-4 h-4 text-blue-400 absolute bottom-2 right-2 opacity-20" />
                                     </div>
                                  ) : (
                                     <div className="whitespace-pre-line">{msg.text}</div>
                                  )}

                                  <div className="text-[10px] text-slate-400 text-right mt-1 flex items-end justify-end gap-1">
                                     {msg.timestamp} 
                                     {msg.role === 'user' && <Check className="w-3 h-3 text-slate-400" />}
                                     {msg.role === 'model' && <Check className="w-3 h-3 text-blue-500" />}
                                  </div>
                               </div>
                            )}
                         </div>
                      ))}
                      
                      {isTyping && (
                         <div className="flex justify-start animate-fade-in">
                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
                               <div className="flex gap-1">
                                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                               </div>
                            </div>
                         </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <div className="h-14 bg-[#F0F0F0] flex items-center px-2 gap-2 border-t border-slate-300">
                       <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 cursor-pointer"><Settings className="w-5 h-5" /></div>
                       <div className="flex-1 h-9 bg-white rounded-full px-3 text-xs flex items-center overflow-hidden">
                          <input 
                            type="text" 
                            className="w-full h-full outline-none text-slate-900 placeholder:text-slate-400"
                            placeholder="Type a reply..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                       </div>
                       {inputMessage ? (
                          <button onClick={handleSendMessage} className="w-8 h-8 rounded-full bg-[#075E54] flex items-center justify-center text-white animate-scale-in">
                             <Send className="w-4 h-4 ml-0.5" />
                          </button>
                       ) : (
                          <div className="w-8 h-8 rounded-full bg-[#075E54] flex items-center justify-center text-white"><Mic className="w-4 h-4" /></div>
                       )}
                    </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIOrderConfig;
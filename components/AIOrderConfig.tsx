import React, { useState } from 'react';
import { MessageSquare, Save, Play, Loader2, Smartphone } from 'lucide-react';
import { generateOrderConfirmationTemplate } from '../services/geminiService';
import { AIOrderConfig as AIConfigType } from '../types';

const AIOrderConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState('');
  
  const [config, setConfig] = useState<AIConfigType>({
    language: 'Darija (Moroccan)',
    tone: 'Friendly',
    includeDiscount: false,
    template: ''
  });

  const handleGeneratePreview = async () => {
    setLoading(true);
    try {
      const msg = await generateOrderConfirmationTemplate(config.language, config.tone, 'MyAwesomeStore');
      setGeneratedMsg(msg);
      setConfig(prev => ({ ...prev, template: msg }));
    } catch (error) {
      alert("Error generating template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          Auto-Confirmation Agent
        </h1>
        <p className="text-slate-500 mt-1">
          Configure how your AI agent confirms orders via WhatsApp/SMS in Morocco.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">Configuration</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <div className="grid grid-cols-3 gap-2">
              {['Darija (Moroccan)', 'French', 'Arabic (Standard)'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setConfig({ ...config, language: lang as any })}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                    config.language === lang 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lang.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tone of Voice</label>
            <select 
              value={config.tone}
              onChange={(e) => setConfig({ ...config, tone: e.target.value as any })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Urgent</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
               <p className="text-sm font-medium text-slate-800">Discount for Next Order</p>
               <p className="text-xs text-slate-500">Add a 10% coupon to the message</p>
            </div>
            <button 
              onClick={() => setConfig({ ...config, includeDiscount: !config.includeDiscount })}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.includeDiscount ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${config.includeDiscount ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <button
            onClick={handleGeneratePreview}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Generate Preview
          </button>
        </div>

        {/* Preview Phone */}
        <div className="flex justify-center items-start">
          <div className="w-[300px] h-[580px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl relative">
             {/* Phone speaker */}
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
             
             <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col relative">
                {/* WhatsApp Header */}
                <div className="bg-[#075E54] h-16 w-full flex items-center px-4 pt-4 text-white">
                  <div className="w-8 h-8 rounded-full bg-white/20 mr-3 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">MyStore Agent</span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-[#E5DDD5] p-4 bg-opacity-50 relative">
                  {/* Background Pattern Mock */}
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  
                  {generatedMsg ? (
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative z-10 text-sm text-slate-800 leading-relaxed">
                      {generatedMsg}
                      <div className="text-[10px] text-slate-400 text-right mt-1">12:30 PM</div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 text-xs mt-10">
                      Generate a preview to see the message here.
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="h-12 bg-slate-100 flex items-center px-2 gap-2">
                   <div className="w-6 h-6 rounded-full bg-slate-300"></div>
                   <div className="flex-1 h-8 bg-white rounded-full"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOrderConfig;
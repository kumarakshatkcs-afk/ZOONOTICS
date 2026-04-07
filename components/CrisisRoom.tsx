
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, User, Bot, AlertCircle, X, Camera } from 'lucide-react';
import { analyzeFieldImage } from '../services/geminiService';

const CrisisRoom: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string, image?: string}[]>([
    { role: 'assistant', text: "CRISIS ROOM ACTIVE. Upload field data or describe an event for immediate intelligence analysis." }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{base64: string, type: string} | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          base64: (reader.result as string).split(',')[1],
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userText = input;
    const userImg = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userText, 
      image: userImg ? `data:${userImg.type};base64,${userImg.base64}` : undefined 
    }]);

    setIsStreaming(true);
    let assistantText = "";
    
    // Add temporary empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', text: "" }]);

    try {
      const stream = await analyzeFieldImage(userText, userImg?.base64, userImg?.type);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || "";
        assistantText += chunkText;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = assistantText;
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].text = "Error establishing intelligence link. Please retry.";
        return newMsgs;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-red-500/20">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">CRISIS COMMAND ROOM</h2>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Multi-modal Intelligence Feed</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-xs font-bold text-emerald-400">ENCRYPTED LINK ACTIVE</span>
           <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-800'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Field data" className="mb-3 rounded-lg max-h-64 object-cover border border-white/20" />
                  )}
                  {msg.text || (isStreaming && i === messages.length - 1 ? "..." : "")}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{msg.role === 'user' ? 'Field Intelligence' : 'AI Epidemiologist'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
             <img src={`data:${selectedImage.type};base64,${selectedImage.base64}`} className="h-20 w-20 object-cover rounded-xl border-2 border-blue-500 shadow-lg" alt="Preview" />
             <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md">
               <X size={12} />
             </button>
          </div>
        )}
        <div className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe suspected outbreak or upload symptom photos..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[56px] transition-all"
            />
          </div>
          <div className="flex gap-2">
            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageSelect} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors"
            >
              <ImageIcon size={24} />
            </button>
            <button 
              onClick={handleSend}
              disabled={isStreaming || (!input.trim() && !selectedImage)}
              className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-center text-slate-400 uppercase font-black tracking-widest">
          Powered by Gemini 3 Flash Vision | Real-time Syndromic Analysis
        </p>
      </div>
    </div>
  );
};

export default CrisisRoom;

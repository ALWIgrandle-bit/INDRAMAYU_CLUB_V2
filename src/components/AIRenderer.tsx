import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Code, Eye, Send, RotateCcw, X } from 'lucide-react';

export default function AIRenderer() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState("<h1>Selamat Datang di Nur Creative Lab!</h1>\n<p>Ketik perintah Anda di atas, lalu klik <b>✨ Render dengan AI</b>.</p>");
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = (html: string) => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  };

  useEffect(() => {
    updatePreview(code);
  }, [code]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const aiSystemPrompt = "Buatkan HTML murni lengkap dengan tag style CSS di dalamnya. Jangan beri teks penjelasan apapun, jangan gunakan blok markdown ```html, langsung berikan kodenya saja. Gunakan framework CSS Tailwind atau CSS murni yang modern. Ini yang saya minta: ";
      const finalQuery = encodeURIComponent(aiSystemPrompt + prompt);
      
      const response = await fetch(`[https://text.pollinations.ai/$](https://text.pollinations.ai/$){finalQuery}`);
      let aiResponse = await response.text();
      aiResponse = aiResponse.replace(/```html/gi, '').replace(/```css/gi, '').replace(/```/g, '').trim();
      setCode(aiResponse);
    } catch (error) {
      alert('Gagal menghubungi AI. Pastikan internet aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/10">
      <div className="bg-[#252526] p-4 flex gap-3 border-b-2 border-yellow-500 items-center">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Contoh: Buat landing page event keagamaan yang modern..."
            className="w-full bg-[#333] text-white border border-[#444] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Render
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col border-right-4 border-yellow-500">
           <div className="bg-[#1e1e1e] text-[#aaa] px-4 py-2 text-[10px] uppercase font-bold border-b border-white/5 flex items-center gap-2">
            <Code className="w-3 h-3" /> Kode Hasil AI
           </div>
           <textarea 
            className="flex-1 bg-[#1e1e1e] text-[#569cd6] font-mono text-xs p-6 resize-none outline-none leading-relaxed"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
           />
        </div>
        <div className="w-1/2 flex flex-col bg-white">
           <div className="bg-[#1e1e1e] text-[#aaa] px-4 py-2 text-[10px] uppercase font-bold border-b border-white/5 flex items-center gap-2">
            <Eye className="w-3 h-3" /> Hasil Layar Real-time
           </div>
           <iframe 
            ref={iframeRef}
            className="flex-1 w-full h-full border-none bg-white"
            title="AI Preview"
           />
        </div>
      </div>
    </div>
  );
}


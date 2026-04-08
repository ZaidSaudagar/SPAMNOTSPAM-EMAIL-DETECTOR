"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Loader2, 
} from "lucide-react";

interface Prediction {
  is_spam: boolean;
  confidence: number;
  method: string;
  explanation?: string;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const handlePredict = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setPrediction(null);
    
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, use_ai: useAI }),
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden p-8 md:p-12 flex flex-col items-center relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-2"
      >
        <h1 className="text-4xl font-bold glow-text tracking-tight">
          SPAM-NOTSPAM <span className="text-cyan-400">DETECTOR</span>
        </h1>
        <p className="text-gray-400 text-base max-w-xl mx-auto">
          Simple, fast email security powered by hybrid AI.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl glass rounded-3xl p-6 relative z-10"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste email content here..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all resize-none text-sm text-gray-200 placeholder-gray-500 mb-4"
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full transition-all relative ${useAI ? 'bg-cyan-500' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all ${useAI ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={useAI} 
                onChange={(e) => setUseAI(e.target.checked)} 
              />
              <span className={`text-xs font-medium ${useAI ? 'text-cyan-400' : 'text-gray-400'}`}>
                AI Mode
              </span>
            </label>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading || !content.trim()}
            className={`px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${
              loading || !content.trim() 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap size={16} fill="currentColor" />}
            {loading ? "Analyzing..." : "Check Now"}
          </button>
        </div>
      </motion.div>

      {/* Result Section */}
      <AnimatePresence>
        {prediction && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-3xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className={`p-6 rounded-3xl glass border ${prediction.is_spam ? 'border-red-500/30' : 'border-green-500/30'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-300">Verdict</h3>
                {prediction.is_spam ? (
                  <ShieldAlert className="text-red-400 w-5 h-5" />
                ) : (
                  <ShieldCheck className="text-green-400 w-5 h-5" />
                )}
              </div>
              
              <div className="space-y-1">
                <span className={`text-3xl font-black ${prediction.is_spam ? 'text-red-500' : 'text-green-500'}`}>
                  {prediction.is_spam ? "SPAM" : "NOT SPAM"}
                </span>
                <p className="text-gray-500 text-xs mt-1">
                  Confidence: {(prediction.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl glass border border-white/5 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Mail size={14} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">{prediction.method}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {prediction.explanation || "Analyzed using classic ML frequency patterns."}
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto py-6 text-gray-600 text-xs">
        &copy; 2026 SPAM-NOTSPAM DETECTOR. Built for security.
      </footer>
    </main>
  );
}

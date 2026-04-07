
import React from 'react';
import { ShieldCheck, Globe, Zap, Users } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-bold tracking-widest uppercase">
            <Zap size={16} /> 2025 India Hackathon Champion Build
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight">
            One Health <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Intelligence
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
            SYNAPSE is the next-gen surveillance platform bridging the gap between human, animal, and environmental data for real-time outbreak prevention.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10"><ShieldCheck className="text-emerald-400" /></div>
              <span className="text-sm font-medium">Real-time GIS Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10"><Globe className="text-blue-400" /></div>
              <span className="text-sm font-medium">Grounding Search AI</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 shadow-2xl space-y-8">
          <div className="text-center">
            <div className="inline-block p-4 bg-blue-600 rounded-3xl mb-6 shadow-lg shadow-blue-500/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">Field Command Center</h2>
            <p className="text-slate-400 mt-2">Authorized Access Only</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onLogin}
              className="w-full bg-white text-slate-900 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all transform hover:scale-[1.02]"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google Account
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#020617] px-4 text-slate-500">Government ID Portal</span></div>
            </div>
            <button 
              onClick={onLogin}
              className="w-full bg-white/5 border border-white/10 text-white py-4 px-6 rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              Health Dept. SSO Login
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Secured by AES-256 Multi-Layer Encryption
          </p>
        </div>
      </div>

      <div className="mt-20 flex gap-12 grayscale opacity-50 overflow-hidden">
        <span className="text-2xl font-bold">HEALTH DEPT.</span>
        <span className="text-2xl font-bold">VET-Surveillance</span>
        <span className="text-2xl font-bold">Epidemio-India</span>
        <span className="text-2xl font-bold">WHO-OneHealth</span>
      </div>
    </div>
  );
};

export default Login;

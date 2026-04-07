
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FieldReport from './components/FieldReport';
import AIInsights from './components/AIInsights';
import Login from './components/Login';
import AIAssistant from './components/AIAssistant';
import CrisisRoom from './components/CrisisRoom';
import { Report, DiseaseType } from './types';
import { LayoutDashboard, FileText, BrainCircuit, Info, ShieldAlert, LogOut, Settings } from 'lucide-react';

const MOCK_REPORTS: Report[] = [
  { id: '1', timestamp: '2024-05-15 10:30', location: { lat: 28.6139, lng: 77.2090, region: 'Delhi' }, species: 'Animal', diseaseType: DiseaseType.RABIES, symptoms: ['Aggression', 'Salivation'], severity: 'High', status: 'Confirmed', reporter: 'Dr. Akshat' },
  { id: '2', timestamp: '2024-05-16 14:15', location: { lat: 19.0760, lng: 72.8777, region: 'Mumbai' }, species: 'Human', diseaseType: DiseaseType.LEPTOSPIROSIS, symptoms: ['Fever', 'Muscle Pain'], severity: 'Medium', status: 'Suspected', reporter: 'Nurse Tripti' },
  { id: '3', timestamp: '2024-05-17 09:45', location: { lat: 22.5726, lng: 88.3639, region: 'Kolkata' }, species: 'Animal', diseaseType: DiseaseType.BIRD_FLU, symptoms: ['Lethargy', 'Respiratory Distress'], severity: 'High', status: 'Confirmed', reporter: 'Dr. Subhalaxmi' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'ai' | 'info' | 'chat'>('dashboard');
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const addReport = (newReport: Omit<Report, 'id' | 'timestamp'>) => {
    const report: Report = {
      ...newReport,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
    };
    setReports([report, ...reports]);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <ShieldAlert size={28} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">SYNAPSE</h1>
               <p className="text-slate-500 font-medium text-sm">One Health Command Center v4.0</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 pl-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="hidden lg:block text-right pr-2">
              <p className="text-xs font-bold text-slate-800">Field Officer Akshat</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase">Certified Responder</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Akshat" alt="Avatar" />
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 pb-24">
          {activeTab === 'dashboard' && <Dashboard reports={reports} />}
          {activeTab === 'report' && <FieldReport onReportSubmit={addReport} />}
          {activeTab === 'chat' && <CrisisRoom />}
          {activeTab === 'ai' && <AIInsights reports={reports} />}
          {activeTab === 'info' && (
             <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                 <h2 className="text-2xl font-bold mb-4">About Team SYNAPSE</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { name: "Kumar Akshat", role: "Team Lead & Architecture" },
                     { name: "AB Subhalaxmi", role: "Field Intelligence" },
                     { name: "Tripti Kumari", role: "UI/UX Design" },
                     { name: "Rahul Singh", role: "AI & Data Science" },
                     { name: "Prince Kr Prasad", role: "GIS & Backend" }
                   ].map(member => (
                     <div key={member.name} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                       <p className="font-semibold text-slate-800">{member.name}</p>
                       <p className="text-sm text-slate-500">{member.role}</p>
                     </div>
                   ))}
                 </div>
                 <p className="mt-6 text-slate-600 italic">
                   Representing Rungta College of Engineering and Technology. Our mission is to integrate human, animal, and environmental data for early outbreak detection.
                 </p>
               </div>
             </div>
          )}
        </div>

        <AIAssistant />
      </main>
    </div>
  );
};

export default App;

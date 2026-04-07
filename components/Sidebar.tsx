
import React from 'react';
import { LayoutDashboard, FileText, BrainCircuit, Info, ShieldAlert, MessageSquare } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Surveillance Hub', icon: LayoutDashboard },
    { id: 'report', label: 'Field Reporting', icon: FileText },
    { id: 'chat', label: 'Crisis Room', icon: MessageSquare },
    { id: 'ai', label: 'Risk Analytics', icon: BrainCircuit },
    { id: 'info', label: 'Platform Info', icon: Info },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-20">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <ShieldAlert size={24} />
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tighter text-slate-800 uppercase">SYNAPSE</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon size={22} />
            <span className="hidden md:block text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 md:p-6 border-t border-slate-100">
        <div className="bg-slate-900 rounded-2xl p-4 hidden md:block">
          <p className="text-white text-[10px] font-black mb-1 opacity-50 uppercase">Alert Hotline</p>
          <p className="text-blue-400 text-sm font-mono tracking-widest font-bold">1800-SYN-ALERT</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

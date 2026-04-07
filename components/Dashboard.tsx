
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Report } from '../types';
// Added Globe to the lucide-react icons list to fix the undefined reference.
import { TrendingUp, Users, Bug, MapPin, FileText, ShieldAlert, Download, Share2, Printer, Globe } from 'lucide-react';

interface DashboardProps {
  reports: Report[];
}

const Dashboard: React.FC<DashboardProps> = ({ reports }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const stats = [
    { label: 'Active Reports', value: reports.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Severity', value: reports.filter(r => r.severity === 'High').length, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Regions Active', value: new Set(reports.map(r => r.location.region)).size, icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Zoonotic Events', value: reports.filter(r => r.species === 'Animal').length, icon: Bug, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const diseaseData = reports.reduce((acc: any, curr) => {
    acc[curr.diseaseType] = (acc[curr.diseaseType] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(diseaseData).map(key => ({ name: key, value: diseaseData[key] }));

  return (
    <div className="space-y-6">
      {/* Quick Action Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl text-white flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold tracking-wider">COMMANDER'S TOOLKIT</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">
            <Download size={14} /> EXPORT PDF
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">
            <Share2 size={14} /> SHARE FEEDS
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-all">
            <Printer size={14} /> DISPATCH ALERT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} /> India Surveillance Hotspots
            </h3>
            <div className="flex items-center gap-2">
               <span className="h-3 w-3 bg-red-500 rounded-full"></span>
               <span className="text-xs font-bold text-slate-400">High Risk Clusters</span>
            </div>
          </div>
          <div className="relative w-full h-80 bg-[#f1f5f9] rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
             <div className="text-center p-8 z-10">
               <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
                 <MapPin size={32} className="text-red-500 animate-bounce" />
               </div>
               <p className="text-slate-800 font-bold">GIS Live Engine</p>
               <p className="text-[10px] text-slate-400 max-w-xs mt-2 uppercase tracking-widest">Integrating PostgreSQL + PostGIS Layer</p>
             </div>
             
             {/* India map outline representation */}
             <div className="absolute inset-0 opacity-10 flex items-center justify-center">
               <Globe size={300} />
             </div>

             {reports.map((r, i) => (
               <div key={r.id} className="absolute p-3 bg-red-500/20 border-2 border-red-500 rounded-full animate-pulse" 
                    style={{ top: `${20 + (i * 15)}%`, left: `${30 + (i * 20)}%` }}>
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-slate-900 text-white text-[8px] font-bold px-1 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity">
                    {r.location.region}: {r.diseaseType}
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black mb-6">Zoonotic Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-sm font-bold text-slate-600">{d.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-800">{d.value}</span>
                  <span className="text-[10px] text-slate-400 block uppercase">Detected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-black">Secure Intelligence Logs</h3>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Encrypted</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Ref. ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Suspected Agent</th>
                <th className="px-6 py-4">Intelligence Origin</th>
                <th className="px-6 py-4">Threat Index</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-all cursor-pointer">
                  <td className="px-8 py-4 font-mono text-[10px] text-slate-400">#SYN-{report.id.toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      report.species === 'Human' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {report.species}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{report.diseaseType}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-blue-500" /> {report.location.region}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(step => (
                        <div key={step} className={`h-1 w-4 rounded-full ${
                          (report.severity === 'High') ? 'bg-red-500' :
                          (report.severity === 'Medium' && step <= 2) ? 'bg-amber-400' :
                          (report.severity === 'Low' && step === 1) ? 'bg-green-400' : 'bg-slate-100'
                        }`}></div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      report.status === 'Confirmed' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <span className={`h-1 w-1 rounded-full ${report.status === 'Confirmed' ? 'bg-red-600' : 'bg-blue-600 animate-pulse'}`}></span>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { Camera, MapPin, Send, AlertTriangle, Dog, User } from 'lucide-react';
import { DiseaseType, Report } from '../types';

interface FieldReportProps {
  onReportSubmit: (report: Omit<Report, 'id' | 'timestamp'>) => void;
}

const FieldReport: React.FC<FieldReportProps> = ({ onReportSubmit }) => {
  const [formData, setFormData] = useState({
    species: 'Animal' as 'Human' | 'Animal',
    diseaseType: DiseaseType.BRUCELLOSIS,
    severity: 'Medium' as 'Low' | 'Medium' | 'High',
    region: '',
    symptoms: '',
    reporter: 'Field Officer Kumar'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onReportSubmit({
        species: formData.species,
        diseaseType: formData.diseaseType,
        severity: formData.severity,
        location: { lat: 0, lng: 0, region: formData.region || 'Remote Field' },
        symptoms: formData.symptoms.split(','),
        status: 'Suspected',
        reporter: formData.reporter
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Field Intelligence</h2>
            <p className="text-slate-500">Real-time syndromic reporting from the frontline</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, species: 'Animal' })}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                formData.species === 'Animal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 grayscale'
              }`}
            >
              <Dog size={32} />
              <span className="mt-2 font-bold">Animal Health</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, species: 'Human' })}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                formData.species === 'Human' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400 grayscale'
              }`}
            >
              <User size={32} />
              <span className="mt-2 font-bold">Human Case</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Disease Suspected</label>
              <select
                value={formData.diseaseType}
                onChange={(e) => setFormData({ ...formData, diseaseType: e.target.value as DiseaseType })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {Object.values(DiseaseType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Severity Level</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Region / Village</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Symptoms (comma separated)</label>
              <textarea
                placeholder="e.g. Fever, Lethargy, Abnormal aggression"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <div className="flex gap-4">
               <button type="button" className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                 <Camera size={20} /> Attach Proof
               </button>
               <button type="button" className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                 <MapPin size={20} /> Tag GPS
               </button>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className={`w-full p-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
              isSubmitting ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {isSubmitting ? (
              <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={24} /> Submit Intelligence Report
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
            <AlertTriangle size={12} /> Data is cached for offline-first synchronization
          </p>
        </form>
      </div>
    </div>
  );
};

export default FieldReport;

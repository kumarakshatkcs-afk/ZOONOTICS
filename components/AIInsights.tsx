
import React, { useState, useEffect } from 'react';
import { analyzeOutbreakRisk, getLatestDiseaseAlerts } from '../services/geminiService';
import { Report, PredictionResult } from '../types';
import { Brain, Sparkles, AlertCircle, CheckCircle2, Search, ExternalLink } from 'lucide-react';

interface AIInsightsProps {
  reports: Report[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ reports }) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [alerts, setAlerts] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    try {
      const [pred, alertData] = await Promise.all([
        analyzeOutbreakRisk(reports),
        getLatestDiseaseAlerts()
      ]);
      setPrediction(pred);
      setAlerts(alertData);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Gemini 3 Pro processing surveillance patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-bold">Predictive Risk Assessment</h2>
              </div>
              
              <div className="flex items-center gap-8 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="relative h-24 w-24 shrink-0">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path className="stroke-slate-200 stroke-[3] fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path 
                      className={`stroke-[3] fill-none transition-all duration-1000 ${
                        prediction.riskScore > 70 ? 'stroke-red-500' : prediction.riskScore > 40 ? 'stroke-amber-500' : 'stroke-green-500'
                      }`}
                      strokeDasharray={`${prediction.riskScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-2xl font-black text-slate-800">{prediction.riskScore}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">Current Threat Level: {prediction.riskScore > 70 ? 'CRITICAL' : prediction.riskScore > 40 ? 'ELEVATED' : 'MODERATE'}</h4>
                  <p className="text-slate-500 text-sm mt-1">{prediction.explanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-slate-700">
                    <AlertCircle size={18} className="text-red-500" /> High-Risk Regions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.affectedRegions.map(region => (
                      <span key={region} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold uppercase tracking-wider">
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={18} className="text-green-500" /> Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 text-white rounded-lg">
                  <Search size={20} />
                </div>
                <h3 className="text-lg font-bold">Search Grounding Hub</h3>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {alerts ? (
                  <>
                    <div className="prose prose-invert prose-sm">
                      <p className="text-slate-300 leading-relaxed text-xs">
                        {alerts.text}
                      </p>
                    </div>
                    <div className="space-y-2 pt-4">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Verified Sources</p>
                      {alerts.sources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10 group"
                        >
                          <span className="text-xs font-medium text-slate-300 truncate pr-4">{src.title || 'Official Health Report'}</span>
                          <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400" />
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 italic text-sm text-center py-12">Retrieving latest web-grounded data...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Impact stats simulation */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6">System Impact Projection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
             <div className="text-4xl font-black text-blue-600">40%</div>
             <p className="font-bold text-slate-800">Faster Outbreak Detection</p>
             <p className="text-sm text-slate-500">Real-time data bridges the human-animal silo gap.</p>
           </div>
           <div className="space-y-2">
             <div className="text-4xl font-black text-green-600">25%</div>
             <p className="font-bold text-slate-800">Reduction in Transmission</p>
             <p className="text-sm text-slate-500">Targeted intervention via field officer alerts.</p>
           </div>
           <div className="space-y-2">
             <div className="text-4xl font-black text-purple-600">Millions</div>
             <p className="font-bold text-slate-800">Saved in Economic Loss</p>
             <p className="text-sm text-slate-500">Protecting livestock trade and national healthcare.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

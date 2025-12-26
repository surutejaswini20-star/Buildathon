
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ResumeData } from '../types';
import { storageService } from '../services/storage';
import { exportService } from '../services/exportService';

interface HistoryProps {
  user: User;
}

const History: React.FC<HistoryProps> = ({ user }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selected, setSelected] = useState<ResumeData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = storageService.getResumes(user.id);
    setResumes(data);
    if (data.length > 0) setSelected(data[0]);
  }, [user.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm group"
            title="Back to Dashboard"
          >
            <i className="fas fa-arrow-left text-slate-500 group-hover:-translate-x-1 transition-transform"></i>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Archive</h1>
            <p className="text-slate-500">Review and re-download your previous improvements.</p>
          </div>
        </div>
        <Link 
          to="/improve" 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-100"
        >
          <i className="fas fa-plus mr-2"></i> New
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar List */}
        <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {resumes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <i className="fas fa-folder-open text-slate-300 text-4xl mb-4"></i>
              <p className="text-slate-400 italic">No history found yet.</p>
            </div>
          ) : (
            resumes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  selected?.id === r.id 
                    ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="font-bold text-slate-900 truncate mb-2">
                  {r.jobDescription.split('\n')[0].substring(0, 40) || 'Untitled Job'}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 flex items-center">
                    <i className="far fa-calendar-alt mr-1.5"></i>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                  <i className={`fas fa-chevron-right text-xs transition-transform ${selected?.id === r.id ? 'translate-x-1 text-indigo-500' : 'text-slate-300'}`}></i>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Content View */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                   <div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Tailored Snippet</h3>
                    <div className="p-5 bg-indigo-50/50 rounded-2xl italic text-indigo-900 text-sm leading-relaxed border-l-4 border-indigo-400 shadow-inner">
                      "{selected.coverLetterSnippet}"
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Optimized Resume Body</h3>
                  <div className="bg-slate-900 p-6 rounded-2xl font-mono text-[13px] text-slate-300 whitespace-pre-wrap h-[400px] overflow-y-auto border border-slate-800 custom-scrollbar shadow-2xl">
                    {selected.improvedContent}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Download Format</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => exportService.downloadAsPDF(selected.improvedContent, `resume_${selected.id}`)}
                      className="py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <i className="fas fa-file-pdf"></i>
                      <span>PDF</span>
                    </button>
                    <button 
                      onClick={() => exportService.downloadAsDocx(selected.improvedContent, `resume_${selected.id}`)}
                      className="py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <i className="fas fa-file-word"></i>
                      <span>Word</span>
                    </button>
                    <button 
                      onClick={() => {
                        const blob = new Blob([selected.improvedContent], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `optimized_resume_${selected.id}.md`;
                        a.click();
                      }}
                      className="py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <i className="fas fa-download"></i>
                      <span>MD</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-mouse-pointer text-2xl opacity-20"></i>
              </div>
              <p className="font-medium">Select an item from the sidebar to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;

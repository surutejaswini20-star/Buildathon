
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ResumeData } from '../types';
import { storageService } from '../services/storage';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);

  useEffect(() => {
    const data = storageService.getResumes(user.id);
    setResumes(data);
  }, [user.id]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="text-indigo-500 font-bold uppercase tracking-widest text-xs">Overview</span>
          <h1 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">Hi, {user.name.split(' ')[0]} ✨</h1>
          <p className="text-slate-500 font-medium mt-2">Ready to secure that next big opportunity?</p>
        </div>
        <Link 
          to="/improve" 
          className="bg-indigo-500 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-indigo-600 transition-all flex items-center space-x-3 shadow-xl shadow-indigo-100 active:scale-95"
        >
          <i className="fas fa-plus"></i>
          <span>New Session</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Past Improvements</h2>
            <Link to="/history" className="text-sm font-bold text-indigo-500 hover:underline">See full history</Link>
          </div>
          
          {resumes.length === 0 ? (
            <div className="glass-card rounded-[3rem] p-20 text-center border-2 border-dashed border-indigo-100">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-wind text-indigo-300 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">It's a bit quiet here</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Upload your first resume and let the AI work its magic.</p>
              <Link to="/improve" className="text-indigo-500 font-black px-8 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
                Let's Go &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {resumes.slice(0, 4).map((resume) => (
                <div key={resume.id} className="glass-card p-6 rounded-[2rem] flex justify-between items-center hover:bg-white transition-all group border-transparent hover:border-indigo-100 border">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg line-clamp-1">{resume.jobDescription.split('\n')[0].substring(0, 40)}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(resume.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link 
                    to="/history" 
                    className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform"></div>
            <h3 className="text-2xl font-black mb-4">Pro Insight</h3>
            <p className="text-indigo-50 font-medium leading-relaxed mb-8">
              Recruiters spend <span className="underline decoration-indigo-300">6 seconds</span> on average scanning a resume. Our AI ensures your top metrics pop in those 6 seconds.
            </p>
            <div className="flex items-center space-x-3 text-indigo-200">
              <i className="fas fa-lightbulb"></i>
              <span className="text-xs font-bold uppercase tracking-widest">Mastering the ATS</span>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem]">
            <h3 className="text-xl font-black text-slate-800 mb-6">Success Steps</h3>
            <div className="space-y-6">
              {[
                { label: "Paste Job Post", color: "bg-amber-100 text-amber-600" },
                { label: "AI Translation", color: "bg-purple-100 text-purple-600" },
                { label: "Review Metrics", color: "bg-emerald-100 text-emerald-600" },
                { label: "PDF Export", color: "bg-rose-100 text-rose-600" }
              ].map((step, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step.color}`}>
                    {i + 1}
                  </div>
                  <span className="text-slate-600 font-bold text-sm">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

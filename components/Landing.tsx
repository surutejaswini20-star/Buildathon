
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block px-4 py-1.5 mb-8 bg-indigo-50 text-indigo-500 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-bounce">
              Powered by Gemini 3 Pro
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
              Elevate your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-400">Career Story.</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg text-slate-500 mb-12 font-medium leading-relaxed">
              We turn basic job descriptions into high-impact narratives that command attention from top-tier recruiters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link to="/auth" className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95">
                Optimize Now
              </Link>
              <a href="#how-it-works" className="font-bold text-slate-500 hover:text-indigo-500 transition-colors flex items-center group">
                See the magic 
                <i className="fas fa-arrow-down ml-2 group-hover:translate-y-1 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="glass-card p-10 rounded-[3rem] text-center group hover:bg-indigo-50/50 transition-colors">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 rotate-3">
              <i className="fas fa-feather-pointed text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-800">Dynamic Verbs</h3>
            <p className="text-slate-500 font-medium">Passive phrases are replaced with bold, results-oriented action verbs.</p>
          </div>

          <div className="glass-card p-10 rounded-[3rem] text-center group hover:bg-emerald-50/50 transition-colors">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 -rotate-3">
              <i className="fas fa-fingerprint text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-800">Unique Identity</h3>
            <p className="text-slate-500 font-medium">The AI analyzes your specific career path to maintain factual integrity while maximizing impact.</p>
          </div>

          <div className="glass-card p-10 rounded-[3rem] text-center group hover:bg-rose-50/50 transition-colors">
            <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 rotate-6">
              <i className="fas fa-bullseye text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-800">ATS Precision</h3>
            <p className="text-slate-500 font-medium">Direct keyword mapping ensures your resume passes automated filters every single time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

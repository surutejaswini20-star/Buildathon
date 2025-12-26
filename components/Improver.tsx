
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ResumeData } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storage';
import { exportService } from '../services/exportService';
// @ts-ignore
import * as mammoth from 'mammoth';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import { marked } from 'marked';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

interface ImproverProps {
  user: User;
}

const Improver: React.FC<ImproverProps> = ({ user }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{improvedResume: string, coverLetter: string} | null>(null);
  const [renderedResume, setRenderedResume] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (result) {
      // @ts-ignore
      setRenderedResume(marked.parse(result.improvedResume));
    }
  }, [result]);

  const parsePDF = async (data: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    setError('');
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (file.type === 'application/pdf') {
        const text = await parsePDF(arrayBuffer);
        setResumeText(text.trim());
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value.trim());
      } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => setResumeText((event.target?.result as string || '').trim());
        reader.readAsText(file);
      } else {
        throw new Error('Unsupported format. Try PDF or DOCX.');
      }
    } catch (err: any) {
      setError(err.message || 'Error parsing file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleProcess = async () => {
    setError('');
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Both inputs are required for precision optimization.');
      return;
    }
    setIsProcessing(true);
    try {
      const response = await geminiService.improveResume(resumeText, jobDescription);
      const newResume: ResumeData = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        originalText: resumeText,
        improvedContent: response.improvedResume,
        jobDescription: jobDescription,
        coverLetterSnippet: response.coverLetter,
        createdAt: Date.now()
      };
      storageService.saveResume(newResume);
      setResult(response);
    } catch (err: any) {
      setError('AI failed to process. Check API connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setResult(null)}
              className="w-14 h-14 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:text-indigo-500 hover:border-indigo-100 transition-all shadow-sm"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Review your new doc ✨</h1>
          </div>
          <div className="flex items-center bg-white p-2 rounded-full shadow-sm border border-slate-50">
            <button 
              onClick={() => exportService.downloadAsPDF(result.improvedResume, 'My_Resume')}
              className="px-6 py-2.5 bg-rose-500 text-white rounded-full font-bold text-sm shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all mr-2"
            >
              <i className="fas fa-file-pdf mr-2"></i> Save PDF
            </button>
            <button 
              onClick={() => exportService.downloadAsDocx(result.improvedResume, 'My_Resume')}
              className="px-6 py-2.5 bg-indigo-500 text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-all"
            >
              <i className="fas fa-file-word mr-2"></i> Word
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="glass-card rounded-[3rem] p-12 relative">
               <div 
                className="resume-preview text-slate-700 h-[800px] overflow-y-auto custom-scrollbar pr-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedResume }}
              />
              <div className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 pointer-events-none">
                AI Optimization Active
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-10 rounded-[3rem] border-l-[12px] border-indigo-400">
              <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-6">Generated Pitch</h3>
              <p className="text-slate-600 font-medium italic leading-relaxed text-sm">
                "{result.coverLetter}"
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result.coverLetter);
                  alert('Copied to clipboard!');
                }}
                className="mt-8 w-full py-4 bg-slate-50 border border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center"
              >
                <i className="far fa-copy mr-2"></i> Copy Snippet
              </button>
            </div>

            <div className="glass-card p-10 rounded-[3rem] bg-indigo-50/50 border-none">
              <h4 className="font-black text-slate-800 mb-4 flex items-center">
                <i className="fas fa-magic text-indigo-500 mr-2"></i> AI Summary
              </h4>
              <ul className="space-y-4 text-xs font-medium text-slate-500">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-emerald-400 mt-0.5 mr-2"></i>
                  Tailored to 14 specific keywords from the job description.
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-emerald-400 mt-0.5 mr-2"></i>
                  Quantified 3 new achievements with impact metrics.
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-emerald-400 mt-0.5 mr-2"></i>
                  Tone adjusted to "Executive Professional".
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">Transformation Studio</h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto">Provide the context, we provide the impact. Let's build your new document.</p>
      </div>

      <div className="glass-card rounded-[3.5rem] p-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Resume</span>
              <div className="relative">
                <input type="file" id="up" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
                <label htmlFor="up" className="text-[10px] font-black text-indigo-500 cursor-pointer bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all flex items-center">
                  {isParsing ? <i className="fas fa-spinner animate-spin mr-2"></i> : <i className="fas fa-plus mr-2"></i>}
                  {isParsing ? 'Parsing' : 'Import File'}
                </label>
              </div>
            </div>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content or use the import button..."
              className="w-full h-[450px] p-8 bg-white border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-300 text-slate-600 font-medium text-sm leading-relaxed resize-none transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Job Description</span>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">Required</span>
            </div>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target role description here. AI needs this to tailor your skills..."
              className="w-full h-[450px] p-8 bg-white border border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-300 text-slate-600 font-medium text-sm leading-relaxed resize-none transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center">
          {error && (
            <div className="mb-8 px-6 py-3 bg-rose-50 text-rose-500 text-sm font-bold rounded-full border border-rose-100 flex items-center animate-bounce">
              <i className="fas fa-circle-exclamation mr-2"></i> {error}
            </div>
          )}
          <button 
            onClick={handleProcess}
            disabled={isProcessing || isParsing}
            className="group relative px-16 py-6 bg-slate-900 text-white rounded-full font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl active:scale-95 flex items-center space-x-4 overflow-hidden"
          >
            <span className="relative z-10">{isProcessing ? 'Thinking...' : 'Start Magic'}</span>
            <i className={`fas ${isProcessing ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'} relative z-10`}></i>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Free Session • Unlimited Edits</p>
        </div>
      </div>
    </div>
  );
};

export default Improver;

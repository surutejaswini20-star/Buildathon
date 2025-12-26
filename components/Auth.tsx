
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { storageService } from '../services/storage';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = storageService.getUsers();

    if (isLogin) {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        onLogin(existingUser);
      } else {
        setError('User not found. Please register.');
      }
    } else {
      if (!name || !email || !password) {
        setError('All fields are required.');
        return;
      }
      if (users.some(u => u.email === email)) {
        setError('Email already exists.');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name
      };
      storageService.saveUser(newUser);
      onLogin(newUser);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-indigo-950 placeholder:text-slate-400 font-semibold shadow-sm";

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 relative">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 text-slate-500 hover:text-indigo-600 transition-colors flex items-center font-bold"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Home
        </button>

        <h2 className="text-3xl font-extrabold text-center mb-8 text-slate-900 tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-200 font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <i className="fas fa-circle-exclamation text-lg"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                placeholder="e.g. Tejaswini"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClasses} pr-12`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
              </button>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transform active:scale-[0.98] mt-4"
          >
            {isLogin ? 'Sign In' : 'Join Now'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setShowPassword(false);
            }}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-black transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

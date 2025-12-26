
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-[2rem] px-8 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-indigo-400 to-purple-400 p-2 rounded-xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-indigo-100">
              <i className="fas fa-magic text-white"></i>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">
              Resume<span className="text-indigo-500 font-medium">Pro</span>
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
                >
                  Archive
                </Link>
                <Link 
                  to="/improve" 
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                >
                  Create New
                </Link>
                <div className="h-4 w-px bg-slate-200 mx-2"></div>
                <button 
                  onClick={onLogout}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                  title="Logout"
                >
                  <i className="fas fa-power-off"></i>
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="bg-indigo-500 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

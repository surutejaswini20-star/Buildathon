
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, AuthStatus } from './types';
import { storageService } from './services/storage';

// Components
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Improver from './components/Improver';
import History from './components/History';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);

  useEffect(() => {
    const savedUser = storageService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    } else {
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    storageService.setCurrentUser(u);
    setAuthStatus(AuthStatus.AUTHENTICATED);
  };

  const handleLogout = () => {
    setUser(null);
    storageService.setCurrentUser(null);
    setAuthStatus(AuthStatus.UNAUTHENTICATED);
  };

  if (authStatus === AuthStatus.LOADING) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />} />
            
            <Route path="/dashboard" element={
              user ? <Dashboard user={user} /> : <Navigate to="/auth" />
            } />
            
            <Route path="/improve" element={
              user ? <Improver user={user} /> : <Navigate to="/auth" />
            } />

            <Route path="/history" element={
              user ? <History user={user} /> : <Navigate to="/auth" />
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} AI Resume Improver. Built for high-impact careers.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

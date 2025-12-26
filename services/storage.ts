
import { User, ResumeData } from '../types';

const USERS_KEY = 'ai_resume_users';
const RESUMES_KEY = 'ai_resume_data';
const CURRENT_USER_KEY = 'ai_resume_current_user';

export const storageService = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  
  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getResumes: (userId: string): ResumeData[] => {
    const all = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    return all.filter((r: ResumeData) => r.userId === userId).sort((a: any, b: any) => b.createdAt - a.createdAt);
  },

  saveResume: (resume: ResumeData) => {
    const all = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    all.push(resume);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(all));
  }
};


export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ResumeData {
  id: string;
  userId: string;
  originalText: string;
  improvedContent: string;
  jobDescription: string;
  coverLetterSnippet: string;
  createdAt: number;
}

export interface ImprovementResult {
  improvedResume: string;
  coverLetter: string;
}

export enum AuthStatus {
  LOADING,
  AUTHENTICATED,
  UNAUTHENTICATED
}

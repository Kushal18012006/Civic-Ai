export type Language = 'en' | 'hi' | 'es' | 'vi';

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  occupation: string;
  income: number;
  location: string;
  education: string;
  language: Language;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GovernmentService {
  id: string;
  title: string;
  category: 'education' | 'healthcare' | 'employment' | 'scholarships' | 'pensions' | 'certificates' | 'licenses' | 'utilities' | 'taxes' | 'voting';
  department: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  processingTime: string;
  steps: string[];
  aiExplanation: string;
  faqs: FAQItem[];
}

export interface GovernmentScheme {
  id: string;
  title: string;
  category: string;
  description: string;
  eligibilitySummary: string;
  benefits: string;
  requiredDocuments: string[];
  matchPercentage?: number;
  aiExplanation?: string;
}

export type ComplaintStatus = 'submitted' | 'under_review' | 'officer_assigned' | 'in_progress' | 'resolved';

export interface TimelineEvent {
  status: ComplaintStatus;
  title: string;
  description: string;
  date: string;
}

export interface CivicComplaint {
  id: string;
  title: string;
  category: 'road_damage' | 'garbage' | 'water_leakage' | 'street_lights' | 'traffic' | 'cleanliness' | 'dumping';
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  location: string;
  photoUrl?: string;
  department: string;
  estimatedResolution: string;
  timeline: TimelineEvent[];
  aiSuggestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// === Resume Data Types ===

export interface PersonalInfo {
  fullName: string;
  furigana?: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  companyDescription?: string;
  employeeCount?: string;
  position: string;
  department?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  responsibilities: string[];
  achievements: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  dateObtained: string;
  organization?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: string[];
  selfPR: string;
  format: "chronological" | "reverse-chronological";
}

// === Onboarding Types ===

export type OnboardingStep =
  | "basic-data"
  | "target-setting"
  | "dynamic-questions";

export interface BasicDataInput {
  method: "upload" | "manual";
  uploadedText?: string;
  manualInput?: Partial<ResumeData>;
  fullName?: string;
  furigana?: string;
  dateOfBirth?: string;
}

export interface TargetSetting {
  companyName: string;
  jobDescription: string;
  jobTitle?: string;
  industry?: string;
}

export interface DynamicQuestion {
  id: string;
  question: string;
  category: "situation" | "task" | "action" | "result";
  answer: string;
}

export interface OnboardingData {
  basicData: BasicDataInput;
  targetSetting: TargetSetting;
  dynamicQuestions: DynamicQuestion[];
}

// === Chat Types ===

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// === Edit History Types ===

export interface HistoryEntry {
  id: string;
  timestamp: number;
  label: string;
  resumeData: ResumeData;
}

// === App State ===

export type AppPhase = "onboarding" | "editing";

export interface ResumeState {
  phase: AppPhase;
  onboardingData: OnboardingData;
  resumeData: ResumeData | null;
  chatMessages: ChatMessage[];
  editHistory: HistoryEntry[];
  historyIndex: number;
  isGenerating: boolean;
  isStreaming: boolean;
}

export type ResumeAction =
  | { type: "SET_PHASE"; payload: AppPhase }
  | { type: "UPDATE_BASIC_DATA"; payload: Partial<BasicDataInput> }
  | { type: "UPDATE_TARGET_SETTING"; payload: Partial<TargetSetting> }
  | { type: "SET_DYNAMIC_QUESTIONS"; payload: DynamicQuestion[] }
  | { type: "UPDATE_QUESTION_ANSWER"; payload: { id: string; answer: string } }
  | { type: "SET_RESUME_DATA"; payload: ResumeData }
  | { type: "UPDATE_RESUME_DATA"; payload: Partial<ResumeData> }
  | { type: "ADD_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "PUSH_HISTORY"; payload: HistoryEntry }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "RESTORE_STATE"; payload: ResumeState };

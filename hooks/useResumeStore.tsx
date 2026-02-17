"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
  type Dispatch,
} from "react";

const STORAGE_KEY = "resume-builder-state";
import type {
  ResumeState,
  ResumeAction,
  OnboardingData,
} from "@/types";

const initialOnboardingData: OnboardingData = {
  basicData: { method: "upload" },
  targetSetting: { companyName: "", jobDescription: "" },
  dynamicQuestions: [],
};

const initialState: ResumeState = {
  phase: "onboarding",
  onboardingData: initialOnboardingData,
  resumeData: null,
  chatMessages: [],
  editHistory: [],
  historyIndex: -1,
  isGenerating: false,
  isStreaming: false,
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.payload };

    case "UPDATE_BASIC_DATA":
      return {
        ...state,
        onboardingData: {
          ...state.onboardingData,
          basicData: { ...state.onboardingData.basicData, ...action.payload },
        },
      };

    case "UPDATE_TARGET_SETTING":
      return {
        ...state,
        onboardingData: {
          ...state.onboardingData,
          targetSetting: {
            ...state.onboardingData.targetSetting,
            ...action.payload,
          },
        },
      };

    case "SET_DYNAMIC_QUESTIONS":
      return {
        ...state,
        onboardingData: {
          ...state.onboardingData,
          dynamicQuestions: action.payload,
        },
      };

    case "UPDATE_QUESTION_ANSWER": {
      const questions = state.onboardingData.dynamicQuestions.map((q) =>
        q.id === action.payload.id
          ? { ...q, answer: action.payload.answer }
          : q
      );
      return {
        ...state,
        onboardingData: { ...state.onboardingData, dynamicQuestions: questions },
      };
    }

    case "SET_RESUME_DATA":
      return { ...state, resumeData: action.payload };

    case "UPDATE_RESUME_DATA":
      if (!state.resumeData) return state;
      return {
        ...state,
        resumeData: { ...state.resumeData, ...action.payload },
      };

    case "ADD_CHAT_MESSAGE": {
      const existingIndex = state.chatMessages.findIndex(
        (m) => m.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const updated = [...state.chatMessages];
        updated[existingIndex] = action.payload;
        return { ...state, chatMessages: updated };
      }
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    }

    case "PUSH_HISTORY": {
      const newHistory = state.editHistory.slice(0, state.historyIndex + 1);
      newHistory.push(action.payload);
      return {
        ...state,
        editHistory: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        historyIndex: newIndex,
        resumeData: structuredClone(state.editHistory[newIndex].resumeData),
      };
    }

    case "REDO": {
      if (state.historyIndex >= state.editHistory.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        historyIndex: newIndex,
        resumeData: structuredClone(state.editHistory[newIndex].resumeData),
      };
    }

    case "SET_GENERATING":
      return { ...state, isGenerating: action.payload };

    case "SET_STREAMING":
      return { ...state, isStreaming: action.payload };

    case "RESTORE_STATE":
      return { ...action.payload, isGenerating: false, isStreaming: false };

    default:
      return state;
  }
}

interface ResumeContextValue {
  state: ResumeState;
  dispatch: Dispatch<ResumeAction>;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  const hydrated = useRef(false);

  // Restore persisted state after hydration (client-only)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ResumeState;
        dispatch({ type: "RESTORE_STATE", payload: parsed });
      }
    } catch {
      // Storage unavailable — start fresh
    }
    hydrated.current = true;
  }, []);

  // Persist state changes after initial restore
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, [state]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeStore() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResumeStore must be used within a ResumeProvider");
  }
  return context;
}

"use client";

import { useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import { useResumeStore } from "./useResumeStore";
import type { ChatMessage } from "@/types";

export function useChat() {
  const { state, dispatch } = useResumeStore();
  const resumeDataRef = useRef(state.resumeData);
  resumeDataRef.current = state.resumeData;

  const sendMessage = useCallback(
    async (text: string) => {
      const currentResume = resumeDataRef.current;
      if (!currentResume || state.isStreaming) return;

      const userMessage: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_CHAT_MESSAGE", payload: userMessage });

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: "考え中...",
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_CHAT_MESSAGE", payload: assistantMessage });
      dispatch({ type: "SET_STREAMING", payload: true });

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeData: currentResume,
            instruction: text,
            history: state.chatMessages.slice(-10),
            targetSetting: state.onboardingData.targetSetting,
          }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const { explanation, updatedResumeData } = await response.json();

        // Show the explanation in the chat
        dispatch({
          type: "ADD_CHAT_MESSAGE",
          payload: { ...assistantMessage, content: explanation || "変更を適用しました。" },
        });

        // Apply the updated resume data
        if (updatedResumeData) {
          dispatch({
            type: "PUSH_HISTORY",
            payload: {
              id: nanoid(),
              timestamp: Date.now(),
              label: text.slice(0, 30),
              resumeData: structuredClone(resumeDataRef.current!),
            },
          });
          dispatch({ type: "SET_RESUME_DATA", payload: updatedResumeData });
        }
      } catch {
        dispatch({
          type: "ADD_CHAT_MESSAGE",
          payload: {
            ...assistantMessage,
            content: "エラーが発生しました。もう一度お試しください。",
          },
        });
      } finally {
        dispatch({ type: "SET_STREAMING", payload: false });
      }
    },
    [state.isStreaming, state.chatMessages, state.onboardingData.targetSetting, dispatch]
  );

  return {
    messages: state.chatMessages,
    sendMessage,
    isStreaming: state.isStreaming,
  };
}

"use client";

import { useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { useResumeStore } from "./useResumeStore";

export function useEditHistory() {
  const { state, dispatch } = useResumeStore();

  const pushHistory = useCallback(
    (label: string) => {
      if (!state.resumeData) return;
      dispatch({
        type: "PUSH_HISTORY",
        payload: {
          id: nanoid(),
          timestamp: Date.now(),
          label,
          resumeData: structuredClone(state.resumeData),
        },
      });
    },
    [state.resumeData, dispatch]
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.editHistory.length - 1;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    history: state.editHistory,
    historyIndex: state.historyIndex,
  };
}

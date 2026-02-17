"use client";

import { useState, useEffect, useCallback } from "react";
import { requestAccessToken, revokeToken, isGISLoaded } from "@/lib/google-auth";

const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";

interface UseGoogleAuthReturn {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  getAccessToken: () => Promise<string>;
  signOut: (token: string) => void;
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isGISLoaded()) {
      setIsReady(true);
      return;
    }

    const existing = document.querySelector(
      `script[src="${GIS_SCRIPT_URL}"]`
    ) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        setIsReady(true);
      } else {
        existing.addEventListener("load", () => setIsReady(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      setIsReady(true);
    };
    script.onerror = () =>
      setError("Google認証スクリプトの読み込みに失敗しました");
    document.head.appendChild(script);
  }, []);

  const getAccessToken = useCallback(async (): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await requestAccessToken();
      return token;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "認証に失敗しました";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback((token: string) => {
    revokeToken(token);
  }, []);

  return { isReady, isLoading, error, getAccessToken, signOut };
}

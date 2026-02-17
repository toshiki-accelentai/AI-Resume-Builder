const SCOPES = "https://www.googleapis.com/auth/drive.file";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

interface TokenClient {
  requestAccessToken: (overrides?: { prompt?: string }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
            error_callback?: (error: { type: string; message: string }) => void;
          }) => TokenClient;
          revoke: (token: string, callback?: () => void) => void;
        };
      };
    };
  }
}

export function isGISLoaded(): boolean {
  return !!window.google?.accounts?.oauth2;
}

export function requestAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isGISLoaded()) {
      reject(new Error("Google Identity Services が読み込まれていません"));
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      reject(new Error("Google Client ID が設定されていません"));
      return;
    }

    const tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response: TokenResponse) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (error) => {
        reject(new Error(error.message || "認証に失敗しました"));
      },
    });

    tokenClient.requestAccessToken({ prompt: "" });
  });
}

export function revokeToken(token: string): void {
  if (isGISLoaded()) {
    window.google!.accounts.oauth2.revoke(token);
  }
}

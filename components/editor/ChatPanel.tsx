"use client";

import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatPanel() {
  const { messages, sendMessage, isStreaming } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-3 border-b border-border bg-white shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-navy" />
          <h2 className="font-semibold text-navy text-sm">編集チャット</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          指示を入力すると右側のプレビューが更新されます
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                チャットで職務経歴書を編集できます
              </p>
              <div className="mt-4 space-y-2">
                {[
                  "リーダーシップ経験をもっと強調して",
                  "この実績をもっと短くして",
                  "技術スキルを追加して",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}

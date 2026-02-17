"use client";

import ChatPanel from "./ChatPanel";
import PreviewPanel from "./PreviewPanel";
import DirectEditPanel from "./DirectEditPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, PenLine } from "lucide-react";

export default function EditorView() {
  return (
    <div className="flex h-full">
      <div className="w-2/5 border-r border-border flex flex-col">
        <Tabs defaultValue="chat" className="flex flex-col h-full">
          <div className="px-4 pt-3 pb-0">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1 gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                チャット
              </TabsTrigger>
              <TabsTrigger value="direct" className="flex-1 gap-1.5">
                <PenLine className="w-3.5 h-3.5" />
                直接編集
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="chat" className="flex-1 min-h-0">
            <ChatPanel />
          </TabsContent>
          <TabsContent value="direct" className="flex-1 min-h-0">
            <DirectEditPanel />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-3/5 flex flex-col">
        <PreviewPanel />
      </div>
    </div>
  );
}

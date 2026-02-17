import Link from "next/link";
import { FileText, Sparkles, MessageSquare, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm text-primary mb-6">
          <Sparkles className="w-4 h-4" />
          AI搭載
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary leading-tight mb-4">
          AI職務経歴書ビルダー
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          AIがあなたの経歴を深掘りし、日本の転職市場に最適化された
          職務経歴書を自動生成します。
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-lg"
        >
          <FileText className="w-5 h-5" />
          職務経歴書を作成する
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-primary mb-2">AIインタビュー</h3>
            <p className="text-sm text-muted-foreground">
              STARフレームワークに基づき、あなたの実績を深掘りする質問をAIが自動生成
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-primary mb-2">チャット編集</h3>
            <p className="text-sm text-muted-foreground">
              「リーダーシップを強調して」など自然言語で指示するだけでリアルタイム更新
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-primary mb-2">マルチ形式出力</h3>
            <p className="text-sm text-muted-foreground">
              PDF・Word形式でダウンロード。美しいレイアウトで即提出可能
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { StyleSheet } from "@react-pdf/renderer";
import "@/lib/pdf-fonts"; // Register Japanese fonts

// Font size mapping (pt):
// タイトル（職務経歴書）: 16pt, 太字/中央揃え
// 日付・氏名: 10.5pt, 標準/右寄せ
// 大見出し（【経歴要約】など）: 12pt, 太字
// 中見出し（期間・社名）: 11pt, 太字
// 本文: 10.5pt, 標準
// 補足情報（使用技術など）: 9pt, 標準

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 10.5,
    padding: 56,
    lineHeight: 1.6,
    color: "#1a1a2e",
  },
  // Header
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 8,
  },
  dateNameRow: {
    textAlign: "right",
    fontSize: 10.5,
  },
  name: {
    fontSize: 10.5,
    textAlign: "right",
    marginTop: 2,
  },
  // Section
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2e",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 6,
  },
  body: {
    fontSize: 10.5,
    lineHeight: 1.6,
  },
  // Experience box
  expBox: {
    borderWidth: 1,
    borderColor: "#999999",
    borderStyle: "solid",
    marginBottom: 6,
  },
  expHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
    borderBottomStyle: "solid",
    padding: 4,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expHeaderBold: {
    fontSize: 11,
    fontWeight: "bold",
  },
  expDesc: {
    fontSize: 9,
    color: "#6b7280",
    paddingHorizontal: 4,
    paddingBottom: 2,
    backgroundColor: "#f5f5f5",
  },
  expPosition: {
    fontSize: 11,
    fontWeight: "bold",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    borderBottomStyle: "solid",
  },
  expContent: {
    padding: 4,
    fontSize: 10.5,
  },
  subLabel: {
    fontSize: 10.5,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 1,
  },
  bulletItem: {
    fontSize: 10.5,
    paddingLeft: 4,
    marginBottom: 1,
  },
  // Skills
  skillItem: {
    fontSize: 10.5,
    marginBottom: 1,
  },
  // Education
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10.5,
    marginBottom: 2,
  },
  period: {
    fontSize: 9,
    color: "#6b7280",
  },
});

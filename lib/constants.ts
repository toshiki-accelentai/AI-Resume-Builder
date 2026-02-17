export const SECTION_LABELS = {
  summary: "職務要約",
  skills: "スキル・資格",
  workExperience: "職務経歴",
  education: "学歴",
  certifications: "資格・免許",
  selfPR: "自己PR",
} as const;

export const STAR_CATEGORIES = {
  situation: { label: "状況", color: "bg-blue-100 text-blue-800" },
  task: { label: "課題", color: "bg-amber-100 text-amber-800" },
  action: { label: "行動", color: "bg-green-100 text-green-800" },
  result: { label: "結果", color: "bg-purple-100 text-purple-800" },
} as const;

export const ONBOARDING_STEPS = [
  { id: "basic-data" as const, label: "基本情報", description: "既存の職務経歴書やプロフィールを入力" },
  { id: "target-setting" as const, label: "ターゲット設定", description: "応募先企業と求人内容を入力" },
  { id: "dynamic-questions" as const, label: "深掘り質問", description: "AIが生成する質問に回答" },
] as const;

export const FORMAT_OPTIONS = [
  { value: "reverse-chronological" as const, label: "逆編年体（推奨）", description: "最新の職歴から記載" },
  { value: "chronological" as const, label: "編年体", description: "古い職歴から記載" },
] as const;

export const RESUME_DATA_SCHEMA_DESCRIPTION = `{
  "personalInfo": { "fullName": "氏名", "furigana": "ふりがな", "email": "...", "phone": "..." },
  "summary": "職務要約テキスト",
  "workExperience": [{ "id": "...", "companyName": "...", "companyDescription": "事業内容", "employeeCount": "従業員数", "position": "役職", "department": "所属", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "isCurrent": false, "responsibilities": ["..."], "achievements": ["..."], "technologies": ["..."] }],
  "education": [{ "id": "...", "institution": "...", "degree": "...", "field": "...", "startDate": "YYYY-MM", "endDate": "YYYY-MM" }],
  "certifications": [{ "id": "...", "name": "...", "dateObtained": "YYYY-MM" }],
  "skills": ["..."],
  "selfPR": "自己PRテキスト",
  "format": "reverse-chronological"
}`;

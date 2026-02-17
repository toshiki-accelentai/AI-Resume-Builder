import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "氏名は必須です"),
  furigana: z.string().optional(),
  email: z.string().email("メールアドレスの形式が正しくありません"),
  phone: z.string().min(1, "電話番号は必須です"),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

export const targetSettingSchema = z.object({
  companyName: z.string().min(1, "会社名は必須です"),
  jobDescription: z.string().min(10, "求人内容を10文字以上入力してください"),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
});

export const dynamicQuestionAnswerSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.enum(["situation", "task", "action", "result"]),
  answer: z.string().min(1, "回答を入力してください"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type TargetSettingFormData = z.infer<typeof targetSettingSchema>;
export type DynamicQuestionFormData = z.infer<typeof dynamicQuestionAnswerSchema>;

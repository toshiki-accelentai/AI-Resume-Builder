"use client";

import { useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, X, Trash2 } from "lucide-react";
import { useResumeStore } from "@/hooks/useResumeStore";
import type { ResumeData, WorkExperience, Education } from "@/types";

export default function DirectEditPanel() {
  const { state, dispatch } = useResumeStore();
  const data = state.resumeData;
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced history push — saves a snapshot after 1s of inactivity
  const update = useCallback(
    (partial: Partial<ResumeData>) => {
      if (!data) return;
      const next = { ...data, ...partial };
      dispatch({ type: "SET_RESUME_DATA", payload: next });

      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
      historyTimerRef.current = setTimeout(() => {
        dispatch({
          type: "PUSH_HISTORY",
          payload: {
            id: nanoid(),
            timestamp: Date.now(),
            label: "直接編集",
            resumeData: structuredClone(next),
          },
        });
      }, 1000);
    },
    [data, dispatch]
  );

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        職務経歴書を生成してください
      </div>
    );
  }

  const updatePersonal = (field: string, value: string) => {
    update({
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const updateExperience = (index: number, partial: Partial<WorkExperience>) => {
    const updated = data.workExperience.map((exp, i) =>
      i === index ? { ...exp, ...partial } : exp
    );
    update({ workExperience: updated });
  };

  const updateExperienceList = (
    index: number,
    field: "responsibilities" | "achievements",
    listIndex: number,
    value: string
  ) => {
    const exp = data.workExperience[index];
    const list = [...exp[field]];
    list[listIndex] = value;
    updateExperience(index, { [field]: list });
  };

  const addExperienceListItem = (
    index: number,
    field: "responsibilities" | "achievements"
  ) => {
    const exp = data.workExperience[index];
    updateExperience(index, { [field]: [...exp[field], ""] });
  };

  const removeExperienceListItem = (
    index: number,
    field: "responsibilities" | "achievements",
    listIndex: number
  ) => {
    const exp = data.workExperience[index];
    updateExperience(index, {
      [field]: exp[field].filter((_, i) => i !== listIndex),
    });
  };

  const updateEducation = (index: number, partial: Partial<Education>) => {
    const updated = data.education.map((edu, i) =>
      i === index ? { ...edu, ...partial } : edu
    );
    update({ education: updated });
  };

  const addSkill = (skill: string) => {
    if (!skill.trim() || data.skills.includes(skill.trim())) return;
    update({ skills: [...data.skills, skill.trim()] });
  };

  const removeSkill = (index: number) => {
    update({ skills: data.skills.filter((_, i) => i !== index) });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Personal Info */}
        <section>
          <h3 className="text-sm font-semibold mb-3">基本情報</h3>
          <div className="space-y-2">
            <div>
              <Label className="text-xs">氏名</Label>
              <Input
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonal("fullName", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">ふりがな</Label>
              <Input
                value={data.personalInfo.furigana || ""}
                onChange={(e) => updatePersonal("furigana", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">メール</Label>
                <Input
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">電話番号</Label>
                <Input
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">住所</Label>
              <Input
                value={data.personalInfo.address || ""}
                onChange={(e) => updatePersonal("address", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section>
          <h3 className="text-sm font-semibold mb-3">職務要約</h3>
          <Textarea
            value={data.summary}
            onChange={(e) => update({ summary: e.target.value })}
            rows={4}
          />
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-sm font-semibold mb-3">スキル・資格</h3>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {data.skills.map((skill, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="gap-1 pr-1 cursor-pointer"
                onClick={() => removeSkill(i)}
              >
                {skill}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="スキルを追加..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSkill(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </section>

        {/* Work Experience */}
        <section>
          <h3 className="text-sm font-semibold mb-3">職務経歴</h3>
          <Accordion type="multiple" defaultValue={data.workExperience.map((e) => e.id)}>
            {data.workExperience.map((exp, expIdx) => (
              <AccordionItem key={exp.id} value={exp.id}>
                <AccordionTrigger className="text-left text-sm">
                  {exp.companyName || "（会社名未入力）"}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">会社名</Label>
                      <Input
                        value={exp.companyName}
                        onChange={(e) =>
                          updateExperience(expIdx, { companyName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">事業内容</Label>
                      <Input
                        value={exp.companyDescription || ""}
                        onChange={(e) =>
                          updateExperience(expIdx, {
                            companyDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">役職</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(expIdx, { position: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">部署</Label>
                        <Input
                          value={exp.department || ""}
                          onChange={(e) =>
                            updateExperience(expIdx, { department: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">開始日</Label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(expIdx, { startDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">終了日</Label>
                        <Input
                          value={exp.isCurrent ? "現在" : exp.endDate || ""}
                          onChange={(e) =>
                            updateExperience(expIdx, { endDate: e.target.value, isCurrent: e.target.value === "現在" })
                          }
                        />
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs">業務内容</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => addExperienceListItem(expIdx, "responsibilities")}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          追加
                        </Button>
                      </div>
                      {exp.responsibilities.map((r, rIdx) => (
                        <div key={rIdx} className="flex gap-1 mb-1">
                          <Input
                            value={r}
                            onChange={(e) =>
                              updateExperienceList(expIdx, "responsibilities", rIdx, e.target.value)
                            }
                            className="text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-2 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeExperienceListItem(expIdx, "responsibilities", rIdx)
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs">実績・成果</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => addExperienceListItem(expIdx, "achievements")}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          追加
                        </Button>
                      </div>
                      {exp.achievements.map((a, aIdx) => (
                        <div key={aIdx} className="flex gap-1 mb-1">
                          <Input
                            value={a}
                            onChange={(e) =>
                              updateExperienceList(expIdx, "achievements", aIdx, e.target.value)
                            }
                            className="text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-2 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeExperienceListItem(expIdx, "achievements", aIdx)
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-sm font-semibold mb-3">学歴</h3>
          {data.education.map((edu, eduIdx) => (
            <div key={edu.id} className="space-y-2 mb-3 p-3 border rounded-md">
              <div>
                <Label className="text-xs">学校名</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(eduIdx, { institution: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">学位・学科</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(eduIdx, { degree: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">入学日</Label>
                  <Input
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(eduIdx, { startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">卒業日</Label>
                  <Input
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(eduIdx, { endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Self PR */}
        <section>
          <h3 className="text-sm font-semibold mb-3">自己PR</h3>
          <Textarea
            value={data.selfPR}
            onChange={(e) => update({ selfPR: e.target.value })}
            rows={5}
          />
        </section>
      </div>
    </ScrollArea>
  );
}

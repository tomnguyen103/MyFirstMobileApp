export type PlanItemType = "lesson" | "ai-conversation" | "new-words";

export interface PlanItem {
  id: string;
  type: PlanItemType;
  title: string;
  subtitle: string;
  completed: boolean;
}

export const todaysPlan: PlanItem[] = [
  {
    id: "plan-1",
    type: "lesson",
    title: "Lesson",
    subtitle: "At the café",
    completed: true,
  },
  {
    id: "plan-2",
    type: "ai-conversation",
    title: "AI Conversation",
    subtitle: "Talk about your day",
    completed: false,
  },
  {
    id: "plan-3",
    type: "new-words",
    title: "New words",
    subtitle: "10 words",
    completed: false,
  },
];

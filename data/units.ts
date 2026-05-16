import { Unit } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageId: "es",
    title: "Basics 1",
    description: "Learn your first Spanish words and greetings.",
    order: 1,
    lessonIds: ["es-unit-1-lesson-1", "es-unit-1-lesson-2"],
  },
  {
    id: "fr-unit-1",
    languageId: "fr",
    title: "Basics 1",
    description: "Learn your first French words and greetings.",
    order: 1,
    lessonIds: ["fr-unit-1-lesson-1", "fr-unit-1-lesson-2"],
  },
  {
    id: "jp-unit-1",
    languageId: "ja",
    title: "Basics 1",
    description: "Learn your first Japanese words and greetings.",
    order: 1,
    lessonIds: ["ja-unit-1-lesson-1", "ja-unit-1-lesson-2"],
  },
];

export function getUnitsByLanguage(languageId: string): Unit[] {
  return units.filter((u) => u.languageId === languageId);
}

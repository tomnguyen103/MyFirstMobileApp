import { Unit } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageId: "es",
    title: "Basics 1",
    description: "Learn your first Spanish words and greetings.",
    order: 1,
    lessonIds: [
      "es-unit-1-lesson-1",
      "es-unit-1-lesson-2",
      "es-unit-1-lesson-3",
      "es-unit-1-lesson-4",
      "es-unit-1-lesson-5",
      "es-unit-1-lesson-6",
    ],
  },
  {
    id: "fr-unit-1",
    languageId: "fr",
    title: "Basics 1",
    description: "Learn your first French words and greetings.",
    order: 1,
    lessonIds: [
      "fr-unit-1-lesson-1",
      "fr-unit-1-lesson-2",
      "fr-unit-1-lesson-3",
      "fr-unit-1-lesson-4",
      "fr-unit-1-lesson-5",
      "fr-unit-1-lesson-6",
    ],
  },
  {
    id: "ja-unit-1",
    languageId: "ja",
    title: "Basics 1",
    description: "Learn your first Japanese words and greetings.",
    order: 1,
    lessonIds: [
      "ja-unit-1-lesson-1",
      "ja-unit-1-lesson-2",
      "ja-unit-1-lesson-3",
      "ja-unit-1-lesson-4",
      "ja-unit-1-lesson-5",
      "ja-unit-1-lesson-6",
    ],
  },
];

export function getUnitsByLanguage(languageId: string): Unit[] {
  return units.filter((u) => u.languageId === languageId);
}

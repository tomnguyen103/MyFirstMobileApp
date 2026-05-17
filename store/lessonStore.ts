import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type LessonStatus = "not_started" | "in_progress" | "completed";

interface LessonState {
  lessonProgress: Record<string, LessonStatus>;
  _hasHydrated: boolean;
  setLessonStatus: (lessonId: string, status: LessonStatus) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lessonProgress: {
        // Spanish
        "es-unit-1-lesson-1": "completed",
        "es-unit-1-lesson-2": "completed",
        "es-unit-1-lesson-3": "in_progress",
        // French
        "fr-unit-1-lesson-1": "completed",
        "fr-unit-1-lesson-2": "completed",
        "fr-unit-1-lesson-3": "in_progress",
        // Japanese
        "ja-unit-1-lesson-1": "completed",
        "ja-unit-1-lesson-2": "completed",
        "ja-unit-1-lesson-3": "in_progress",
      },
      _hasHydrated: false,
      setLessonStatus: (lessonId, status) =>
        set((state) => ({
          lessonProgress: { ...state.lessonProgress, [lessonId]: status },
        })),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "lesson-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

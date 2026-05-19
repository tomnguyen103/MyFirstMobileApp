import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-react-native";
import { getLessonAnalyticsContext } from "@/lib/analytics";
import type { Lesson } from "@/types/learning";

export function useLessonAnalytics(
  lesson: Lesson | undefined,
  lastQuestionIndex = 0
) {
  const posthog = usePostHog();
  const startedAtRef = useRef<number | null>(null);
  const lastQuestionIndexRef = useRef(lastQuestionIndex);

  useEffect(() => {
    lastQuestionIndexRef.current = lastQuestionIndex;
  }, [lastQuestionIndex]);

  useEffect(() => {
    if (!lesson) return;

    const startedAt = Date.now();
    startedAtRef.current = startedAt;

    const { languageCode, lessonNumber } = getLessonAnalyticsContext(lesson);

    posthog.capture("lesson_started", {
      lesson_id: lesson.id,
      language: languageCode,
      lesson_number: lessonNumber,
    });

    return () => {
      const timeIntoLessonSeconds = Math.max(
        0,
        Math.round((Date.now() - startedAt) / 1000)
      );

      posthog.capture("lesson_abandoned", {
        lesson_id: lesson.id,
        time_into_lesson_seconds: timeIntoLessonSeconds,
        last_question_index: lastQuestionIndexRef.current,
      });

      startedAtRef.current = null;
    };
  }, [lesson, posthog]);
}

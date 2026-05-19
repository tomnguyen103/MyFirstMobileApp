import type { PostHog } from "posthog-react-native";
import type { Lesson } from "@/types/learning";
import { languages } from "@/data/languages";
import { units } from "@/data/units";

type AnalyticsClient = Pick<PostHog, "capture" | "identify">;

export function identifyAuthenticatedUser({
  email,
  isSignUp = false,
  posthog,
  preferredLanguageId,
  userId,
}: {
  email?: string;
  isSignUp?: boolean;
  posthog: AnalyticsClient;
  preferredLanguageId: string | null;
  userId: string;
}) {
  posthog.identify(userId, {
    $set: {
      ...(email ? { email } : {}),
      preferred_language: preferredLanguageId,
    },
    ...(isSignUp
      ? {
          $set_once: {
            signup_date: new Date().toISOString(),
          },
        }
      : {}),
  });
}

export function getLessonAnalyticsContext(lesson: Lesson) {
  const unit = units.find((item) => item.id === lesson.unitId);
  const language = languages.find((item) => item.id === unit?.languageId);
  const lessonIndex = unit?.lessonIds.findIndex((id) => id === lesson.id) ?? -1;

  return {
    languageCode: unit?.languageId ?? "unknown",
    languageName: language?.name ?? "Language",
    lessonNumber: lessonIndex >= 0 ? lessonIndex + 1 : 1,
  };
}

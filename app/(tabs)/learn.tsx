import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "@/components/tw";
import { useLanguageStore } from "@/store/languageStore";
import { useLessonStore, LessonStatus } from "@/store/lessonStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { getLessonsByUnit } from "@/data/lessons";
import { Lesson } from "@/types/learning";
import { images } from "@/constants/images";

type Tab = "lessons" | "practice";

// ── Lesson Card ───────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  index,
  status,
  showDivider,
}: {
  lesson: Lesson;
  index: number;
  status: LessonStatus;
  showDivider: boolean;
}) {
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/ai-teacher",
            params: { lessonId: lesson.id },
          } as never)
        }
        style={isInProgress ? styles.cardInProgress : undefined}
      >
        <View className="flex-row items-center px-5 py-4 gap-4">
          {/* Left: lesson info */}
          <View className="flex-1">
            <Text className="caption mb-[3px]">Lesson {index + 1}</Text>
            <Text className="font-poppins-semibold text-[15px] text-text-primary leading-[21px]">
              {lesson.title}
            </Text>
            <Text className="body-sm mt-[2px]">
              {lesson.activities.length} activities • {lesson.xpReward} XP
            </Text>
            {isInProgress && (
              <View className="flex-row mt-[6px]">
                <View
                  className="rounded-full px-[10px] py-[3px]"
                  style={styles.inProgressBadge}
                >
                  <Text style={styles.inProgressBadgeText}>In progress</Text>
                </View>
              </View>
            )}
          </View>

          {/* Right: status indicator */}
          {isCompleted && (
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={styles.completedCircle}
            >
              <Ionicons name="checkmark" size={20} color="#ffffff" />
            </View>
          )}

          {isInProgress && (
            <Image
              source={{
                uri: `https://picsum.photos/seed/${lesson.id}/100/100`,
              }}
              style={styles.lessonThumbnail}
              resizeMode="cover"
            />
          )}

          {!isCompleted && !isInProgress && (
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={styles.lockedCircle}
            >
              <Ionicons name="lock-closed" size={16} color="#9ca3af" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {showDivider && <View className="h-px bg-border mx-5" />}
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function LearnScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("lessons");
  const { selectedLanguageId } = useLanguageStore();
  const { lessonProgress } = useLessonStore();

  const selectedLanguage =
    languages.find((l) => l.id === selectedLanguageId) ?? languages[0];
  const unit = units.find((u) => u.languageId === selectedLanguage.id);
  const unitLessons = unit ? getLessonsByUnit(unit.id) : [];
  const completedCount = unitLessons.filter(
    (l) => lessonProgress[l.id] === "completed"
  ).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Unit header ─────────────────────────────────── */}
        <View className="px-5 pt-5 pb-3 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-poppins-bold text-[22px] text-text-primary leading-[28px]">
              {unit?.title ?? "Basics 1"}
            </Text>
            <Text className="body-sm mt-[3px]">
              {selectedLanguage.name} · Unit 1 · {completedCount} /{" "}
              {unitLessons.length} lessons
            </Text>
          </View>
          <TouchableOpacity
            className="w-9 h-9 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark-outline" size={22} color="#001328" />
          </TouchableOpacity>
        </View>

        {/* ── Unit illustration ──────────────────────────── */}
        <View style={styles.illustration}>
          <Image
            source={images.palace}
            style={styles.palaceImage}
            resizeMode="contain"
          />
          <Image
            source={images.mascotWelcome}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Tab bar ───────────────────────────────────── */}
        <View className="flex-row bg-white border-b border-border">
          {(["lessons", "practice"] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              className="flex-1 items-center pt-[14px] pb-[12px] relative"
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`font-poppins-semibold text-[15px] ${
                  activeTab === tab
                    ? "text-lingua-purple"
                    : "text-text-secondary"
                }`}
              >
                {tab === "lessons" ? "Lessons" : "Practice"}
              </Text>
              {activeTab === tab && (
                <View
                  className="absolute bottom-0 rounded-full bg-lingua-purple"
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Content ───────────────────────────────────── */}
        {activeTab === "lessons" ? (
          <View
            className="mx-5 mt-5 bg-white rounded-[18px] overflow-hidden"
            style={styles.lessonListCard}
          >
            {unitLessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                status={lessonProgress[lesson.id] ?? "not_started"}
                showDivider={index < unitLessons.length - 1}
              />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-20 px-10">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-5"
              style={styles.practiceIconBg}
            >
              <Ionicons name="barbell-outline" size={36} color="#6c4ef5" />
            </View>
            <Text className="font-poppins-semibold text-[17px] text-text-primary text-center">
              Practice Coming Soon
            </Text>
            <Text className="body-sm text-center mt-2">
              Practice exercises will be available soon. Keep completing lessons
              to unlock them!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 110,
  },
  illustration: {
    height: 190,
    backgroundColor: "#EDE9FE",
    overflow: "hidden",
    position: "relative",
  },
  palaceImage: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: "65%",
    height: "100%",
  },
  mascotImage: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: 130,
    height: 160,
  },
  tabIndicator: {
    height: 3,
    left: 24,
    right: 24,
  },
  lessonListCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  cardInProgress: {
    backgroundColor: "#f5f3ff",
  },
  completedCircle: {
    backgroundColor: "#21c16b",
  },
  lockedCircle: {
    backgroundColor: "#f3f4f6",
  },
  lessonThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  inProgressBadge: {
    backgroundColor: "#FFF0D9",
  },
  inProgressBadgeText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#FF8A00",
  },
  practiceIconBg: {
    backgroundColor: "#EDE9FE",
  },
});

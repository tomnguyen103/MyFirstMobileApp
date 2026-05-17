import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { lessons } from "@/data/lessons";
import { images } from "@/constants/images";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { user } = useUser();
  const { selectedLanguageId } = useLanguageStore();

  const selectedLanguage =
    languages.find((l) => l.id === selectedLanguageId) ?? languages[0];

  const languageUnits = units.filter(
    (u) => u.languageId === selectedLanguage.id
  );
  const currentUnit = languageUnits[0];
  const unitLessons = currentUnit
    ? lessons.filter((l) => l.unitId === currentUnit.id)
    : [];
  const currentLesson = unitLessons[0];

  const firstName =
    user?.firstName ?? user?.username ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "Learner";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ── Header ───────────────────────────────────────── */}
      <View style={styles.header}>
        <Image
          source={images.mascotLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.statsRow}>
          {/* Streak */}
          <View style={styles.statChip}>
            <Image
              source={images.streakFire}
              style={styles.statIcon}
              resizeMode="contain"
            />
            <Text style={styles.statValue}>0</Text>
          </View>
          {/* XP */}
          <View style={styles.statChip}>
            <Ionicons name="star" size={16} color="#ffcb00" />
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── Greeting ─────────────────────────────────────── */}
        <View className="px-6 pt-5 pb-2 bg-background">
          <Text className="h3">{getGreeting()}, {firstName}!</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Image
              source={{ uri: selectedLanguage.flag }}
              style={styles.flagSmall}
            />
            <Text className="body-md text-text-secondary">
              Learning {selectedLanguage.name}
            </Text>
          </View>
        </View>

        {/* ── Continue Learning Card ────────────────────────── */}
        {currentLesson && (
          <View className="px-6 mt-4">
            <View style={styles.continueCard}>
              {/* Top row: text + mascot */}
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text style={styles.continueLabel}>CONTINUE</Text>
                  <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
                  <Text style={styles.lessonDesc} numberOfLines={2}>
                    {currentLesson.description}
                  </Text>
                </View>
                <Image
                  source={images.mascotLogo}
                  style={styles.cardMascot}
                  resizeMode="contain"
                />
              </View>

              {/* Progress bar */}
              <View className="mt-4">
                <View className="flex-row justify-between mb-1.5">
                  <Text style={styles.progressMeta}>
                    {currentUnit?.title ?? "Unit 1"}
                  </Text>
                  <Text style={styles.progressMeta}>
                    0 / {currentUnit?.lessonIds.length ?? 2} lessons
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: "0%" }]} />
                </View>
              </View>

              {/* Button */}
              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.85}
                onPress={() => router.push(`/lesson/${currentLesson.id}` as never)}
              >
                <Text style={styles.continueBtnLabel}>Continue Lesson</Text>
                <Ionicons name="arrow-forward" size={16} color="#6c4ef5" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Today's Plan ──────────────────────────────────── */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="h4">{"Today's Plan"}</Text>
            <Text className="body-sm text-lingua-purple">See all</Text>
          </View>

          {unitLessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/lesson/${lesson.id}` as never)}
            >
              {/* Icon */}
              <View style={styles.lessonIconWrap}>
                <Ionicons
                  name={index === 0 ? "book" : "mic"}
                  size={20}
                  color="#6c4ef5"
                />
              </View>

              {/* Text */}
              <View className="flex-1 ml-3">
                <Text className="h4">{lesson.title}</Text>
                <Text className="body-sm" numberOfLines={1}>
                  {lesson.description}
                </Text>
              </View>

              {/* XP + arrow */}
              <View className="items-end gap-1.5">
                <View style={styles.xpBadge}>
                  <Text style={styles.xpLabel}>+{lesson.xpReward} XP</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Your Progress ─────────────────────────────────── */}
        <View className="px-6 mt-6">
          <Text className="h4 mb-3">Your Progress</Text>
          <View style={styles.progressCard}>
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: selectedLanguage.flag }}
                style={styles.flagLarge}
              />
              <View className="flex-1">
                <Text className="h4">{selectedLanguage.name}</Text>
                <Text className="body-sm">{selectedLanguage.nativeName}</Text>
              </View>
              <View className="items-end">
                <Text style={styles.progressPct}>0%</Text>
                <Text className="caption text-text-secondary">complete</Text>
              </View>
            </View>

            {/* Overall progress bar */}
            <View style={styles.progressTrackLight}>
              <View style={[styles.progressFillPurple, { width: "0%" }]} />
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="caption text-text-secondary">
                0 / {currentUnit?.lessonIds.length ?? 2} lessons done
              </Text>
              <Text className="caption text-text-secondary">
                {selectedLanguage.learners}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  logo: {
    width: 36,
    height: 36,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f6f7fb",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statIcon: {
    width: 18,
    height: 18,
  },
  statValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#001328",
  },
  /* Language flag (small) */
  flagSmall: {
    width: 22,
    height: 16,
    borderRadius: 3,
  },
  /* Continue Learning Card */
  continueCard: {
    backgroundColor: "#6c4ef5",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#6c4ef5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  continueLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.7)",
  },
  lessonTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    lineHeight: 26,
    color: "#ffffff",
    marginTop: 2,
  },
  lessonDesc: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  cardMascot: {
    width: 60,
    height: 60,
  },
  progressMeta: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 3,
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 16,
    gap: 6,
  },
  continueBtnLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#6c4ef5",
  },
  /* Lesson Cards */
  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f0ecff",
    alignItems: "center",
    justifyContent: "center",
  },
  xpBadge: {
    backgroundColor: "#fff8e1",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  xpLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#f59e0b",
  },
  /* Progress Card */
  progressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  flagLarge: {
    width: 44,
    height: 32,
    borderRadius: 6,
  },
  progressPct: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#6c4ef5",
  },
  progressTrackLight: {
    height: 6,
    backgroundColor: "#f0ecff",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 12,
  },
  progressFillPurple: {
    height: "100%",
    backgroundColor: "#6c4ef5",
    borderRadius: 3,
  },
});

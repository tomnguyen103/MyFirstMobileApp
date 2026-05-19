import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, ScrollView, Text, TouchableOpacity, View } from "@/components/tw";
import { images } from "@/constants/images";
import { getLessonById } from "@/data/lessons";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { Phrase, VocabItem } from "@/types/learning";

function getLanguageName(unitId: string) {
  const unit = units.find((item) => item.id === unitId);
  const language = languages.find((item) => item.id === unit?.languageId);
  return language?.name ?? "Language";
}

function getLessonPhrases(lessonId: string): Phrase[] {
  const lesson = getLessonById(lessonId);
  const phraseActivity = lesson?.activities.find((a) => a.type === "phrase");

  if (phraseActivity?.type === "phrase") {
    return phraseActivity.items.slice(0, 3);
  }

  const vocabActivity = lesson?.activities.find((a) => a.type === "vocabulary");

  if (vocabActivity?.type !== "vocabulary") {
    return [];
  }

  return vocabActivity.items.slice(0, 3).map((item: VocabItem) => ({
    phrase: item.word,
    translation: item.translation,
    pronunciation: item.example,
  }));
}

function RoundControl({
  icon,
  label,
  tone = "light",
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  tone?: "light" | "danger";
}) {
  const isDanger = tone === "danger";

  return (
    <View className="items-center gap-[8px]">
      <TouchableOpacity
        activeOpacity={0.82}
        className="h-[58px] w-[58px] items-center justify-center rounded-full"
        style={isDanger ? styles.dangerControl : styles.lightControl}
      >
        <Ionicons name={icon} size={24} color={isDanger ? "#ffffff" : "#001328"} />
      </TouchableOpacity>
      <Text className="font-poppins-medium text-[11px] leading-[15px] text-text-secondary">
        {label}
      </Text>
    </View>
  );
}

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const lesson = id ? getLessonById(id) : undefined;

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-poppins-semibold text-[20px] text-text-primary">
            Lesson not found
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-5 rounded-full bg-lingua-purple px-6 py-3"
            onPress={() => router.push("/(tabs)/learn" as never)}
          >
            <Text className="font-poppins-semibold text-white">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const languageName = getLanguageName(lesson.unitId);
  const phrases = getLessonPhrases(lesson.id);
  const primaryGoal = lesson.goals[0]?.description ?? lesson.description;
  const bubblePhrase = phrases[0]?.phrase ?? "¡Muy bien!";
  const bubbleTranslation = phrases[0]?.translation ?? "That was great!";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <View className="flex-row items-center justify-between px-[22px] pb-[18px] pt-[10px]">
          <View className="flex-row items-center gap-[15px]">
            <TouchableOpacity
              activeOpacity={0.75}
              className="h-10 w-10 items-start justify-center"
              onPress={() => router.push("/(tabs)/learn" as never)}
            >
              <Ionicons name="chevron-back" size={32} color="#001328" />
            </TouchableOpacity>

            <View>
              <Text className="font-poppins-semibold text-[22px] leading-[29px] text-text-primary">
                AI Teacher
              </Text>
              <View className="mt-[2px] flex-row items-center gap-[7px]">
                <View className="h-[12px] w-[12px] rounded-full bg-[#12d10f]" />
                <Text className="font-poppins text-[15px] leading-[19px] text-[#454a70]">
                  Online
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-[8px]">
            <View className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#f2f2f7]">
              <Ionicons name="videocam-outline" size={18} color="#4a4a6a" />
            </View>
            <View className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#f2f2f7]">
              <Text className="font-poppins-semibold text-[14px] leading-[18px] text-[#4a4a6a]">
                12
              </Text>
            </View>
            <View className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#f2f2f7]">
              <Ionicons name="notifications-outline" size={18} color="#4a4a6a" />
            </View>
          </View>
        </View>

        {/* ── Teacher Panel ─────────────────────────────── */}
        <View className="mx-[14px] overflow-hidden rounded-[24px]" style={styles.teacherPanel}>
          <Image
            source={images.mascotWelcome}
            resizeMode="contain"
            style={styles.teacherMascot}
          />

          <View
            className="absolute bottom-[14px] left-[12px] right-[12px] flex-row items-center rounded-[18px] bg-white px-[18px] py-[14px]"
            style={styles.speechBubble}
          >
            <View className="flex-1 pr-3">
              <Text
                className="font-poppins-semibold text-[17px] leading-[24px] text-text-primary"
                numberOfLines={1}
              >
                {bubblePhrase}
              </Text>
              <Text
                className="mt-[4px] font-poppins-medium text-[14px] leading-[21px] text-text-secondary"
                numberOfLines={2}
              >
                {bubbleTranslation}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              className="h-[46px] w-[46px] items-center justify-center rounded-full bg-[#eee9ff]"
            >
              <Ionicons name="volume-high" size={26} color="#5b3bf6" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-[14px] flex-row justify-between px-[32px]">
          <RoundControl icon="videocam" label="Camera" />
          <RoundControl icon="mic" label="Mic" />
          <RoundControl icon="language" label="Subtitles" />
          <RoundControl icon="call" label="End Call" tone="danger" />
        </View>

        {/* ── Feedback card ─────────────────────────────── */}
        <View className="mx-[24px] mt-[18px] rounded-[20px] bg-white px-1 py-[20px]" style={styles.feedbackCard}>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="font-poppins-semibold text-[15px] leading-[20px] text-text-primary">
                Speaking
              </Text>
              <Text className="mt-[14px] font-poppins-semibold text-[16px] leading-[20px] text-[#10d620]">
                Excellent
              </Text>
            </View>
            <View className="h-[70px] w-px bg-[#e8e8f1]" />
            <View className="flex-1 items-center">
              <Text className="font-poppins-semibold text-[15px] leading-[20px] text-text-primary">
                Pronunciation
              </Text>
              <Text className="mt-[14px] font-poppins-semibold text-[16px] leading-[20px] text-[#187dff]">
                Great
              </Text>
            </View>
            <View className="h-[70px] w-px bg-[#e8e8f1]" />
            <View className="flex-1 items-center">
              <Text className="font-poppins-semibold text-[15px] leading-[20px] text-text-primary">
                Grammar
              </Text>
              <Text className="mt-[14px] font-poppins-semibold text-[16px] leading-[20px] text-[#4b2cff]">
                Good
              </Text>
            </View>
          </View>
        </View>

        {/* ── Lesson context card ───────────────────────── */}
        <View className="mx-[24px] mt-[16px] rounded-[20px] bg-white p-5" style={styles.lessonContextCard}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-poppins-semibold text-[17px] leading-[23px] text-text-primary">
                {languageName} audio lesson
              </Text>
              <Text className="mt-[4px] font-poppins text-[13px] leading-[20px] text-text-secondary">
                {primaryGoal}
              </Text>
            </View>
            <View className="rounded-full bg-[#EDE9FE] px-3 py-2">
              <Text className="font-poppins-semibold text-[12px] text-lingua-purple">
                {lesson.xpReward} XP
              </Text>
            </View>
          </View>

          <View className="mt-4 gap-3">
            {phrases.map((phrase) => (
              <View key={`${lesson.id}-${phrase.phrase}`} className="rounded-[14px] bg-[#f6f7fb] px-4 py-3">
                <Text className="font-poppins-semibold text-[14px] leading-[19px] text-text-primary">
                  {phrase.phrase}
                </Text>
                <Text className="mt-[2px] font-poppins text-[12px] leading-[18px] text-text-secondary">
                  {phrase.translation}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-4 font-poppins text-[12px] leading-[19px] text-text-secondary">
            {lesson.aiTeacherPrompt.instructions}
          </Text>
        </View>
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
    paddingBottom: 118,
  },
  teacherPanel: {
    height: 382,
    backgroundColor: "#f2edff",
  },
  teacherMascot: {
    position: "absolute",
    top: 46,
    alignSelf: "center",
    width: 250,
    height: 250,
  },
  speechBubble: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  lightControl: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  dangerControl: {
    backgroundColor: "#ff4d4f",
    shadowColor: "#ff4d4f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  feedbackCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  lessonContextCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});

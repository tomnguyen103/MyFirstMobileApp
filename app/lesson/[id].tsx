import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LiveCaptionsCard } from "@/components/LiveCaptionsCard";
import { Image, ScrollView, Text, TouchableOpacity, View } from "@/components/tw";
import { images } from "@/constants/images";
import { getLessonById } from "@/data/lessons";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { AudioCallStatus, useStreamAudioCall } from "@/hooks/useStreamAudioCall";
import { useLessonAnalytics } from "@/hooks/useLessonAnalytics";
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
  active = false,
  disabled = false,
  icon,
  label,
  onPress,
  onPressIn,
  onPressOut,
  tone = "light",
}: {
  active?: boolean;
  disabled?: boolean;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  tone?: "light" | "danger";
}) {
  const isDanger = tone === "danger";

  return (
    <View className="items-center gap-2">
      <TouchableOpacity
        activeOpacity={0.82}
        className="h-14.5 w-14.5 items-center justify-center rounded-full"
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          isDanger ? styles.dangerControl : active ? styles.activeControl : styles.lightControl,
          disabled ? styles.disabledControl : undefined,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isDanger || active ? "#ffffff" : "#001328"}
        />
      </TouchableOpacity>
      <Text className="font-poppins-medium text-[11px] leading-3.75 text-text-secondary">
        {label}
      </Text>
    </View>
  );
}

function getPrimaryActionLabel(status: AudioCallStatus) {
  switch (status) {
    case "loading":
    case "ready":
      return "Starting...";
    case "connecting":
      return "Connecting...";
    case "joined":
      return "In Lesson";
    case "ended":
      return "Start Again";
    case "error":
      return "Try Again";
    default:
      return "Start Audio Call";
  }
}

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const lesson = id ? getLessonById(id) : undefined;
  const lessonUnit = lesson ? units.find((item) => item.id === lesson.unitId) : undefined;
  const languageId = lessonUnit?.languageId;
  const {
    agentError,
    agentStatus,
    captions,
    endCall,
    error,
    isCaptioning,
    isListening,
    joinCall,
    startAndJoinCall,
    startTalking,
    status,
    stopTalking,
  } = useStreamAudioCall({
    lessonId: lesson?.id,
    languageId,
  });

  useLessonAnalytics(lesson);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-poppins-semibold text-xl text-text-primary">
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
  const isBusy = status === "loading" || status === "connecting";
  const canSpeak = status === "joined";
  const canStart = status === "idle" || status === "ended" || status === "error";
  const canJoin = status === "ready";
  const primaryActionLabel = getPrimaryActionLabel(status);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <View className="flex-row items-center justify-between px-5.5 pb-4.5 pt-2.5">
          <View className="flex-row items-center gap-3.75">
            <TouchableOpacity
              activeOpacity={0.75}
              className="h-10 w-10 items-start justify-center"
              onPress={() => router.push("/(tabs)/learn" as never)}
            >
              <Ionicons name="chevron-back" size={32} color="#001328" />
            </TouchableOpacity>

            <View>
              <Text className="font-poppins-semibold text-[22px] leading-7.25 text-text-primary">
                AI Teacher
              </Text>
              <View className="mt-0.5 flex-row items-center gap-1.75">
                <View className="h-3 w-3 rounded-full bg-[#12d10f]" />
                <Text className="font-poppins text-[15px] leading-4.75 text-[#454a70]">
                  Online
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#f2f2f7]">
              <Ionicons name="videocam-outline" size={18} color="#4a4a6a" />
            </View>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#f2f2f7]">
              <Text className="font-poppins-semibold text-sm leading-4.5 text-[#4a4a6a]">
                12
              </Text>
            </View>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#f2f2f7]">
              <Ionicons name="notifications-outline" size={18} color="#4a4a6a" />
            </View>
          </View>
        </View>

        {/* ── Teacher Panel ─────────────────────────────── */}
        <View className="mx-3.5 overflow-hidden rounded-6" style={styles.teacherPanel}>
          <Image
            source={images.mascotWelcome}
            resizeMode="contain"
            style={styles.teacherMascot}
          />

          <View
            className="absolute bottom-3.5 left-3 right-3 flex-row items-center rounded-4.5 bg-white px-4.5 py-3.5"
            style={styles.speechBubble}
          >
            <View className="flex-1 pr-3">
              <Text
                className="font-poppins-semibold text-[17px] leading-6 text-text-primary"
                numberOfLines={1}
              >
                {bubblePhrase}
              </Text>
              <Text
                className="mt-1 font-poppins-medium text-sm leading-5.25 text-text-secondary"
                numberOfLines={2}
              >
                {bubbleTranslation}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              className="h-11.5 w-11.5 items-center justify-center rounded-full bg-[#eee9ff]"
            >
              <Ionicons name="volume-high" size={26} color="#5b3bf6" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-3.5 flex-row justify-between px-8">
          <RoundControl icon="videocam" label="Camera" disabled />
          <RoundControl
            active={isListening}
            disabled={!canSpeak}
            icon={isListening ? "mic" : "mic-outline"}
            label={isListening ? "Listening" : "Mic"}
            onPressIn={startTalking}
            onPressOut={stopTalking}
          />
          <RoundControl
            active={isCaptioning}
            disabled={status !== "joined"}
            icon="language"
            label="Subtitles"
          />
          <RoundControl
            disabled={status === "idle" || isBusy}
            icon="call"
            label="End Call"
            onPress={endCall}
            tone="danger"
          />
        </View>

        <View className="mx-6 mt-4.5 rounded-5 bg-white p-4" style={styles.callStateCard}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-poppins-semibold text-[15px] leading-5 text-text-primary">
                Stream audio session
              </Text>
              <Text className="mt-1 font-poppins text-xs leading-4.5 text-text-secondary">
                {agentStatus === "connected"
                  ? "AI teacher connected with live captions"
                  : "Start the call to begin the speaking lesson"}
              </Text>
            </View>
            <View className="rounded-full bg-[#ede9fe] px-3 py-2">
              <Text className="font-poppins-semibold text-[11px] text-lingua-purple">
                {status.toUpperCase()}
              </Text>
            </View>
          </View>

          {error ? (
            <Text className="mt-3 font-poppins-medium text-xs leading-4.5 text-[#ff4d4f]">
              {error}
            </Text>
          ) : null}
          {agentError ? (
            <Text className="mt-2 font-poppins-medium text-xs leading-4.5 text-[#ff4d4f]">
              {agentError}
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.82}
            className="mt-4 h-12 items-center justify-center rounded-full bg-lingua-purple"
            disabled={isBusy || status === "joined"}
            onPress={canStart ? startAndJoinCall : canJoin ? joinCall : undefined}
            style={isBusy || status === "joined" ? styles.primaryButtonDisabled : undefined}
          >
            <Text className="font-poppins-semibold text-sm text-white">
              {primaryActionLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <LiveCaptionsCard
          captions={captions}
          isCaptioning={isCaptioning}
          isListening={isListening}
        />

        {/* ── Feedback card ─────────────────────────────── */}
        <View className="mx-6 mt-4.5 rounded-5 bg-white px-1 py-5" style={styles.feedbackCard}>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="font-poppins-semibold text-[15px] leading-5 text-text-primary">
                Speaking
              </Text>
              <Text className="mt-3.5 font-poppins-semibold text-base leading-5 text-[#10d620]">
                Excellent
              </Text>
            </View>
            <View className="h-17.5 w-px bg-[#e8e8f1]" />
            <View className="flex-1 items-center">
              <Text className="font-poppins-semibold text-[15px] leading-5 text-text-primary">
                Pronunciation
              </Text>
              <Text className="mt-3.5 font-poppins-semibold text-base leading-5 text-[#187dff]">
                Great
              </Text>
            </View>
            <View className="h-17.5 w-px bg-[#e8e8f1]" />
            <View className="flex-1 items-center">
              <Text className="font-poppins-semibold text-[15px] leading-5 text-text-primary">
                Grammar
              </Text>
              <Text className="mt-3.5 font-poppins-semibold text-base leading-5 text-[#4b2cff]">
                Good
              </Text>
            </View>
          </View>
        </View>

        {/* ── Lesson context card ───────────────────────── */}
        <View className="mx-6 mt-4 rounded-5 bg-white p-5" style={styles.lessonContextCard}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-poppins-semibold text-[17px] leading-5.75 text-text-primary">
                {languageName} audio lesson
              </Text>
              <Text className="mt-1 font-poppins text-[13px] leading-5 text-text-secondary">
                {primaryGoal}
              </Text>
            </View>
            <View className="rounded-full bg-[#EDE9FE] px-3 py-2">
              <Text className="font-poppins-semibold text-xs text-lingua-purple">
                {lesson.xpReward} XP
              </Text>
            </View>
          </View>

          <View className="mt-4 gap-3">
            {phrases.map((phrase) => (
              <View key={`${lesson.id}-${phrase.phrase}`} className="rounded-3.5 bg-[#f6f7fb] px-4 py-3">
                <Text className="font-poppins-semibold text-sm leading-4.75 text-text-primary">
                  {phrase.phrase}
                </Text>
                <Text className="mt-0.5 font-poppins text-xs leading-4.5 text-text-secondary">
                  {phrase.translation}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-4 font-poppins text-xs leading-4.75 text-text-secondary">
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
  activeControl: {
    backgroundColor: "#22c55e",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  disabledControl: {
    opacity: 0.45,
  },
  dangerControl: {
    backgroundColor: "#ff4d4f",
    shadowColor: "#ff4d4f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  callStateCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
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

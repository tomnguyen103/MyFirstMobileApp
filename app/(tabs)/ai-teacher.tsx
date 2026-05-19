import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, ScrollView, Text, TouchableOpacity, View } from "@/components/tw";
import { images } from "@/constants/images";
import { getLessonById } from "@/data/lessons";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import {
  useStreamAudioCall,
  AudioCallStatus,
  AgentConnectionStatus,
} from "@/hooks/useStreamAudioCall";
import { useLanguageStore } from "@/store/languageStore";
import { Phrase, VocabItem } from "@/types/learning";

type RoundControlProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  tone?: "light" | "danger";
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

function getLanguageName(unitId: string) {
  const unit = units.find((item) => item.id === unitId);
  const language = languages.find((item) => item.id === unit?.languageId);

  return language?.name ?? "Language";
}

function getLessonPhrases(lessonId: string): Phrase[] {
  const lesson = getLessonById(lessonId);
  const phraseActivity = lesson?.activities.find((activity) => activity.type === "phrase");

  if (phraseActivity?.type === "phrase") {
    return phraseActivity.items.slice(0, 3);
  }

  const vocabActivity = lesson?.activities.find((activity) => activity.type === "vocabulary");

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
  active = false,
  disabled = false,
  onPress,
}: RoundControlProps) {
  const isDanger = tone === "danger";

  return (
    <TouchableOpacity
      className="items-center"
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
    >
      <View
        className="h-[56px] w-[56px] items-center justify-center rounded-full"
        style={[
          isDanger ? styles.endCallButton : styles.controlButton,
          active ? styles.activeControlButton : undefined,
          disabled ? styles.disabledControlButton : undefined,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={isDanger || active ? "#ffffff" : "#001328"}
        />
      </View>
      <Text className="mt-2 font-poppins-medium text-[11px] leading-[15px] text-text-secondary">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function getCallStatusCopy(status: AudioCallStatus) {
  switch (status) {
    case "loading":
      return "Preparing Stream call";
    case "ready":
      return "Ready to join";
    case "connecting":
      return "Connecting audio";
    case "joined":
      return "Joined audio call";
    case "ended":
      return "Call ended";
    case "error":
      return "Connection issue";
    default:
      return "Ready";
  }
}

function getPrimaryActionLabel(status: AudioCallStatus) {
  switch (status) {
    case "loading":
      return "Starting...";
    case "ready":
      return "Join Audio Call";
    case "connecting":
      return "Joining...";
    case "joined":
      return "Connected";
    case "ended":
      return "Start Again";
    case "error":
      return "Try Again";
    default:
      return "Start Audio Call";
  }
}

function getAgentStatusCopy(status: AgentConnectionStatus) {
  switch (status) {
    case "connecting":
      return "AI teacher connecting";
    case "connected":
      return "AI teacher connected";
    case "failed":
      return "AI teacher failed";
    default:
      return "AI teacher idle";
  }
}

export default function AITeacherScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const { selectedLanguageId } = useLanguageStore();
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const lessonLanguageId = lesson
    ? units.find((item) => item.id === lesson.unitId)?.languageId
    : undefined;
  const languageId = lessonLanguageId ?? selectedLanguageId ?? undefined;
  const languageName = lesson ? getLanguageName(lesson.unitId) : undefined;
  const phrases = lesson ? getLessonPhrases(lesson.id) : [];
  const primaryGoal = lesson?.goals[0]?.description ?? lesson?.description;
  const bubblePhrase = phrases[0]?.phrase ?? lesson?.aiTeacherPrompt.intro ?? "Choose a lesson";
  const bubbleTranslation = phrases[0]?.translation ?? primaryGoal ?? "Start from the Learn tab";
  const {
    agentError,
    agentStatus,
    callId,
    displayName,
    error,
    isMuted,
    isSignedIn,
    joinCall,
    startCall,
    status,
    toggleMute,
    endCall,
  } = useStreamAudioCall({
    lessonId: lesson?.id,
    languageId,
  });
  const callStatusCopy = getCallStatusCopy(status);
  const agentStatusCopy = getAgentStatusCopy(agentStatus);
  const primaryActionLabel = getPrimaryActionLabel(status);
  const isBusy = status === "loading" || status === "connecting";
  const canJoin = status === "ready";
  const canStart = status === "idle" || status === "ended" || status === "error";
  const canMute = status === "joined";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        decelerationRate="normal"
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View className="flex-row items-center justify-between px-5 pb-3">
          <TouchableOpacity
            className="h-10 w-10 items-start justify-center"
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/learn" as never)}
          >
            <Ionicons name="chevron-back" size={24} color="#001328" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="font-poppins-bold text-[18px] leading-[24px] text-text-primary">
              AI Teacher
            </Text>
            <View className="mt-1 flex-row items-center">
              <View
                className="mr-1.5 h-2 w-2 rounded-full"
                style={status === "error" ? styles.errorDot : styles.onlineDot}
              />
              <Text
                className="font-poppins-medium text-[12px] leading-[16px]"
                style={status === "error" ? styles.errorStatusText : styles.onlineStatusText}
              >
                {callStatusCopy}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="h-8 min-w-12 flex-row items-center justify-center rounded-full bg-[#f4f3f8] px-3">
              <Ionicons name="videocam-outline" size={13} color="#4b4d66" />
              <Text className="ml-1 font-poppins-semibold text-[12px] text-[#4b4d66]">
                {lesson?.xpReward ?? 0}
              </Text>
            </View>
            <TouchableOpacity
              className="h-8 w-8 items-center justify-center rounded-full bg-[#f4f3f8]"
              activeOpacity={0.75}
            >
              <Ionicons name="notifications-outline" size={17} color="#4b4d66" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-5 overflow-hidden rounded-[22px] bg-[#f2edff]">
          <View className="h-[372px] items-center">
            <Image
              source={images.mascotWelcome}
              className="mt-6 h-[238px] w-[238px]"
              resizeMode="contain"
            />

            <View
              className="absolute bottom-4 left-3 right-3 flex-row items-center rounded-[18px] bg-white px-4 py-[13px]"
              style={styles.phraseCard}
            >
              <View className="flex-1 pr-3">
                <Text
                  className="font-poppins-bold text-[16px] leading-[22px] text-text-primary"
                  numberOfLines={1}
                >
                  {bubblePhrase}
                </Text>
                <Text
                  className="mt-0.5 font-poppins-medium text-[13px] leading-[18px] text-text-secondary"
                  numberOfLines={2}
                >
                  {bubbleTranslation}
                </Text>
              </View>
              <TouchableOpacity
                className="h-11 w-11 items-center justify-center rounded-full bg-[#eee9ff]"
                activeOpacity={0.75}
              >
                <Ionicons name="volume-high" size={20} color="#7b61ff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mt-3 flex-row justify-between px-7">
          <RoundControl icon="videocam-off" label="Audio" disabled />
          <RoundControl
            icon={isMuted ? "mic-off" : "mic"}
            label={isMuted ? "Muted" : "Mic"}
            active={canMute && !isMuted}
            disabled={!canMute}
            onPress={toggleMute}
          />
          <RoundControl icon="language" label="Subtitles" disabled />
          <RoundControl
            icon="call"
            label="End Call"
            tone="danger"
            disabled={status === "idle" || isBusy}
            onPress={endCall}
          />
        </View>

        <View className="mx-5 mt-4 rounded-[20px] bg-white p-4" style={styles.callStateCard}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-poppins-semibold text-[15px] leading-[20px] text-text-primary">
                Stream audio session
              </Text>
              <Text className="mt-1 font-poppins text-[12px] leading-[18px] text-text-secondary">
                {isSignedIn
                  ? `${displayName} - ${callStatusCopy}`
                  : "Sign in to start a lesson call"}
              </Text>
              {callId ? (
                <Text
                  className="mt-1 font-poppins text-[11px] leading-[16px] text-text-secondary"
                  numberOfLines={1}
                >
                  Call ID: {callId}
                </Text>
              ) : null}
              <Text
                className="mt-1 font-poppins-medium text-[12px] leading-[18px]"
                style={
                  agentStatus === "failed" ? styles.errorStatusText : styles.onlineStatusText
                }
              >
                {agentStatusCopy}
              </Text>
            </View>
            <View className="rounded-full px-3 py-2" style={styles.callStatusBadge}>
              <Text className="font-poppins-semibold text-[11px] text-lingua-purple">
                {status.toUpperCase()}
              </Text>
            </View>
          </View>

          {error ? (
            <Text className="mt-3 font-poppins-medium text-[12px] leading-[18px] text-[#ff4d4f]">
              {error}
            </Text>
          ) : null}
          {agentError ? (
            <Text className="mt-2 font-poppins-medium text-[12px] leading-[18px] text-[#ff4d4f]">
              {agentError}
            </Text>
          ) : null}

          <TouchableOpacity
            className="mt-4 h-[48px] items-center justify-center rounded-full bg-lingua-purple"
            activeOpacity={0.82}
            disabled={isBusy || status === "joined" || !lesson}
            onPress={canJoin ? joinCall : canStart ? startCall : undefined}
            style={
              isBusy || status === "joined" || !lesson
                ? styles.primaryButtonDisabled
                : undefined
            }
          >
            <Text className="font-poppins-semibold text-[14px] text-white">
              {lesson ? primaryActionLabel : "Select a Lesson"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mx-5 mt-5 flex-row rounded-[18px] bg-white" style={styles.feedbackCard}>
          <View className="flex-1 items-center py-4">
            <Text className="font-poppins-medium text-[12px] leading-[16px] text-text-secondary">
              Speaking
            </Text>
            <Text className="mt-1 font-poppins-bold text-[12px] leading-[16px] text-[#22c55e]">
              Excellent
            </Text>
          </View>
          <View className="my-4 w-px bg-border" />
          <View className="flex-1 items-center py-4">
            <Text className="font-poppins-medium text-[12px] leading-[16px] text-text-secondary">
              Pronunciation
            </Text>
            <Text className="mt-1 font-poppins-bold text-[12px] leading-[16px] text-[#2f80ed]">
              Great
            </Text>
          </View>
          <View className="my-4 w-px bg-border" />
          <View className="flex-1 items-center py-4">
            <Text className="font-poppins-medium text-[12px] leading-[16px] text-text-secondary">
              Grammar
            </Text>
            <Text className="mt-1 font-poppins-bold text-[12px] leading-[16px] text-[#5b3bf6]">
              Good
            </Text>
          </View>
        </View>

        {lesson ? (
          <View className="mx-5 mt-4 rounded-[20px] bg-white p-5" style={styles.lessonContextCard}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-poppins-semibold text-[17px] leading-[23px] text-text-primary">
                  {lesson.title}
                </Text>
                <Text className="mt-[4px] font-poppins text-[13px] leading-[20px] text-text-secondary">
                  {languageName} audio lesson
                </Text>
              </View>
              <View className="rounded-full bg-[#ede9fe] px-3 py-2">
                <Text className="font-poppins-semibold text-[12px] text-lingua-purple">
                  {lesson.xpReward} XP
                </Text>
              </View>
            </View>

            <Text className="mt-4 font-poppins-medium text-[13px] leading-[20px] text-text-primary">
              {primaryGoal}
            </Text>

            <View className="mt-4 gap-3">
              {phrases.map((phrase) => (
                <View
                  key={`${lesson.id}-${phrase.phrase}`}
                  className="rounded-[14px] bg-[#f6f7fb] px-4 py-3"
                >
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
        ) : (
          <View className="mx-5 mt-4 rounded-[20px] bg-white p-5" style={styles.lessonContextCard}>
            <Text className="text-center font-poppins-semibold text-[17px] leading-[23px] text-text-primary">
              Select a lesson from Learn
            </Text>
            <Text className="mt-2 text-center font-poppins text-[13px] leading-[20px] text-text-secondary">
              The AI Teacher will update with that lesson&apos;s phrases and goal.
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  phraseCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  controlButton: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  activeControlButton: {
    backgroundColor: "#5b3bf6",
  },
  disabledControlButton: {
    opacity: 0.45,
  },
  endCallButton: {
    backgroundColor: "#ff4d4f",
    shadowColor: "#ff4d4f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  onlineDot: {
    backgroundColor: "#12d10f",
  },
  errorDot: {
    backgroundColor: "#ff4d4f",
  },
  onlineStatusText: {
    color: "#22c55e",
  },
  errorStatusText: {
    color: "#ff4d4f",
  },
  callStateCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  callStatusBadge: {
    backgroundColor: "#ede9fe",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  feedbackCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
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

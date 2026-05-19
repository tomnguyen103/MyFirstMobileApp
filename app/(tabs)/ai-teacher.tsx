import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  LiveCaption,
} from "@/hooks/useStreamAudioCall";
import { useLessonAnalytics } from "@/hooks/useLessonAnalytics";
import { useLanguageStore } from "@/store/languageStore";
import { Phrase, VocabItem } from "@/types/learning";

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
      return "Join call";
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
    captions,
    partialCaption,
    displayName,
    error,
    isCaptioning,
    isListening,
    isSignedIn,
    joinCall,
    startAndJoinCall,
    startTalking,
    stopTalking,
    status,
    endCall,
  } = useStreamAudioCall({
    lessonId: lesson?.id,
    languageId,
  });
  useLessonAnalytics(lesson);

  const [visibleCaption, setVisibleCaption] = useState<LiveCaption | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const latest = captions[captions.length - 1];
    if (!latest) {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      setVisibleCaption(null);
      return;
    }
    setVisibleCaption(latest);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setVisibleCaption(null), 4500);
    return () => { if (clearTimerRef.current) clearTimeout(clearTimerRef.current); };
  }, [captions]);

  const callStatusCopy = getCallStatusCopy(status);
  const agentStatusCopy = getAgentStatusCopy(agentStatus);
  const primaryActionLabel = getPrimaryActionLabel(status);
  const isBusy = status === "loading" || status === "connecting";
  const canJoin = status === "ready";
  const canStart = status === "idle" || status === "ended" || status === "error";
  const canSpeak = status === "joined";

  const screen = (
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
            <Text className="font-poppins-bold text-lg leading-6 text-text-primary">
              AI Teacher
            </Text>
            <View className="mt-1 flex-row items-center">
              <View
                className="mr-1.5 h-2 w-2 rounded-full"
                style={status === "error" ? styles.errorDot : styles.onlineDot}
              />
              <Text
                className="font-poppins-medium text-xs leading-4"
                style={status === "error" ? styles.errorStatusText : styles.onlineStatusText}
              >
                {callStatusCopy}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            {status === "loading" || status === "ready" || status === "connecting" || status === "joined" ? (
              <TouchableOpacity
                className="h-8 w-8 items-center justify-center rounded-full"
                style={styles.endCallBadge}
                activeOpacity={0.75}
                disabled={isBusy}
                onPress={endCall}
              >
                <Ionicons name="call" size={15} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <View className="h-8 w-8" />
            )}
          </View>
        </View>

        <View className="mx-5 overflow-hidden rounded-5.5 bg-[#f2edff]">
          <View className="h-93 items-center">
            <Image
              source={images.mascotWelcome}
              className="mt-6 h-59.5 w-59.5"
              resizeMode="contain"
            />

            <View
              className="absolute bottom-4 left-3 right-3 flex-row items-center rounded-4.5 bg-white px-4 py-3.25"
              style={styles.phraseCard}
            >
              <View className="flex-1 pr-3">
                {isCaptioning && partialCaption ? (
                  // Real-time growing text from the agent's delta events
                  <>
                    <View style={styles.captionSpeakerRow}>
                      <View
                        style={[
                          styles.captionDot,
                          partialCaption.speaker === "teacher"
                            ? styles.teacherDot
                            : styles.learnerDot,
                        ]}
                      />
                      <Text
                        style={
                          partialCaption.speaker === "teacher"
                            ? styles.teacherName
                            : styles.learnerName
                        }
                      >
                        {partialCaption.speakerName}
                      </Text>
                    </View>
                    <Text style={styles.captionText} numberOfLines={3}>
                      {partialCaption.text}
                    </Text>
                  </>
                ) : isCaptioning && visibleCaption ? (
                  // Completed utterance that lingers for a few seconds
                  <>
                    <View style={styles.captionSpeakerRow}>
                      <View
                        style={[
                          styles.captionDot,
                          visibleCaption.speaker === "teacher"
                            ? styles.teacherDot
                            : styles.learnerDot,
                        ]}
                      />
                      <Text
                        style={
                          visibleCaption.speaker === "teacher"
                            ? styles.teacherName
                            : styles.learnerName
                        }
                      >
                        {visibleCaption.speakerName}
                      </Text>
                    </View>
                    <Text style={styles.captionText} numberOfLines={3}>
                      {visibleCaption.text}
                    </Text>
                  </>
                ) : isCaptioning && isListening ? (
                  // PTT held but no words recognised yet
                  <>
                    <View style={styles.captionSpeakerRow}>
                      <View style={[styles.captionDot, styles.learnerDot]} />
                      <Text style={styles.learnerName}>You</Text>
                    </View>
                    <Text style={styles.captionHint}>Listening…</Text>
                  </>
                ) : (
                  // Default: show the lesson phrase / translation
                  <>
                    <Text
                      className="font-poppins-bold text-base leading-5.5 text-text-primary"
                      numberOfLines={1}
                    >
                      {bubblePhrase}
                    </Text>
                    <Text
                      className="mt-0.5 font-poppins-medium text-[13px] leading-4.5 text-text-secondary"
                      numberOfLines={2}
                    >
                      {bubbleTranslation}
                    </Text>
                  </>
                )}
              </View>
              <TouchableOpacity
                className="h-11 w-11 items-center justify-center rounded-full bg-[#eee9ff]"
                activeOpacity={0.75}
                disabled={isCaptioning}
              >
                <Ionicons
                  name={isCaptioning ? "chatbubble-ellipses" : "volume-high"}
                  size={20}
                  color="#7b61ff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <View className="items-center py-5">
          <TouchableOpacity
            disabled={!canSpeak}
            onPressIn={startTalking}
            onPressOut={stopTalking}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.pttButton,
                isListening && styles.pttButtonActive,
                !canSpeak && styles.pttButtonDisabled,
              ]}
            >
              <Ionicons
                name={isListening ? "mic" : "mic-outline"}
                size={18}
                color={!canSpeak ? "#a0a0a0" : isListening ? "#ffffff" : "#5b3bf6"}
              />
              <Text
                style={[
                  styles.pttLabel,
                  isListening && styles.pttLabelActive,
                  !canSpeak && styles.pttLabelDisabled,
                ]}
              >
                {!canSpeak ? "Join to speak" : isListening ? "Listening…" : "Hold to speak"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>


        <View className="mx-5 mt-4 rounded-5 bg-white p-4" style={styles.callStateCard}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-poppins-semibold text-[15px] leading-5 text-text-primary">
                Stream audio session
              </Text>
              <Text className="mt-1 font-poppins text-xs leading-4.5 text-text-secondary">
                {isSignedIn
                  ? `${displayName} - ${callStatusCopy}`
                  : "Sign in to start a lesson call"}
              </Text>
              {callId ? (
                <Text
                  className="mt-1 font-poppins text-[11px] leading-4 text-text-secondary"
                  numberOfLines={1}
                >
                  Call ID: {callId}
                </Text>
              ) : null}
              <Text
                className="mt-1 font-poppins-medium text-xs leading-4.5"
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
            className="mt-4 h-12 items-center justify-center rounded-full bg-lingua-purple"
            activeOpacity={0.82}
            disabled={isBusy || status === "joined" || !lesson}
            onPress={canStart ? startAndJoinCall : canJoin ? joinCall : undefined}
            style={
              isBusy || status === "joined" || !lesson
                ? styles.primaryButtonDisabled
                : undefined
            }
          >
            <Text className="font-poppins-semibold text-sm text-white">
              {lesson ? primaryActionLabel : "Select a Lesson"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mx-5 mt-5 flex-row rounded-4.5 bg-white" style={styles.feedbackCard}>
          <View className="flex-1 items-center py-4">
            <Text className="font-poppins-medium text-xs leading-4 text-text-secondary">
              Speaking
            </Text>
            <Text className="mt-1 font-poppins-bold text-xs leading-4 text-[#22c55e]">
              Excellent
            </Text>
          </View>
          <View className="my-4 w-px bg-border" />
          <View className="flex-1 items-center py-4">
            <Text className="font-poppins-medium text-xs leading-4 text-text-secondary">
              Pronunciation
            </Text>
            <Text className="mt-1 font-poppins-bold text-xs leading-4 text-[#2f80ed]">
              Great
            </Text>
          </View>
          <View className="my-4 w-px bg-border" />
          <View className="flex-1 items-center py-4">
            <Text className="font-poppins-medium text-xs leading-4 text-text-secondary">
              Grammar
            </Text>
            <Text className="mt-1 font-poppins-bold text-xs leading-4 text-[#5b3bf6]">
              Good
            </Text>
          </View>
        </View>

        {lesson ? (
          <View className="mx-5 mt-4 rounded-5 bg-white p-5" style={styles.lessonContextCard}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-poppins-semibold text-[17px] leading-5.75 text-text-primary">
                  {lesson.title}
                </Text>
                <Text className="mt-1 font-poppins text-[13px] leading-5 text-text-secondary">
                  {languageName} audio lesson
                </Text>
              </View>
              <View className="rounded-full bg-[#ede9fe] px-3 py-2">
                <Text className="font-poppins-semibold text-xs text-lingua-purple">
                  {lesson.xpReward} XP
                </Text>
              </View>
            </View>

            <Text className="mt-4 font-poppins-medium text-[13px] leading-5 text-text-primary">
              {primaryGoal}
            </Text>

            <View className="mt-4 gap-3">
              {phrases.map((phrase) => (
                <View
                  key={`${lesson.id}-${phrase.phrase}`}
                  className="rounded-3.5 bg-[#f6f7fb] px-4 py-3"
                >
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
        ) : (
          <View className="mx-5 mt-4 rounded-5 bg-white p-5" style={styles.lessonContextCard}>
            <Text className="text-center font-poppins-semibold text-[17px] leading-5.75 text-text-primary">
              Select a lesson from Learn
            </Text>
            <Text className="mt-2 text-center font-poppins text-[13px] leading-5 text-text-secondary">
              The AI Teacher will update with that lesson&apos;s phrases and goal.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  return screen;
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
  pttButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#5b3bf6",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#5b3bf6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  pttButtonActive: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
    shadowColor: "#22c55e",
    shadowOpacity: 0.3,
  },
  pttButtonDisabled: {
    backgroundColor: "#f4f4f4",
    borderColor: "#d4d4d4",
    shadowOpacity: 0,
    elevation: 0,
  },
  pttLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#5b3bf6",
  },
  pttLabelActive: {
    color: "#ffffff",
  },
  pttLabelDisabled: {
    color: "#a0a0a0",
  },
  endCallBadge: {
    backgroundColor: "#ff4d4f",
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
  captionSpeakerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 3,
  },
  captionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  teacherDot: {
    backgroundColor: "#5b3bf6",
  },
  learnerDot: {
    backgroundColor: "#16a34a",
  },
  teacherName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#5b3bf6",
  },
  learnerName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#16a34a",
  },
  captionText: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    lineHeight: 22,
    color: "#001328",
  },
  captionHint: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    lineHeight: 21,
    color: "#6b7280",
    fontStyle: "italic" as const,
  },
});

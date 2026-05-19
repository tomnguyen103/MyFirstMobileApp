import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/tw";
import type { LiveCaption } from "@/hooks/useStreamAudioCall";

type LiveCaptionsCardProps = {
  captions: LiveCaption[];
  isCaptioning: boolean;
  isListening?: boolean;
};

export function LiveCaptionsCard({ captions, isCaptioning, isListening }: LiveCaptionsCardProps) {
  const [visibleCaption, setVisibleCaption] = useState<LiveCaption | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const latest = captions[captions.length - 1];
    if (!latest) return;

    setVisibleCaption(latest);

    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setVisibleCaption(null), 4500);

    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, [captions]);

  if (!isCaptioning) return null;

  const isTeacher = visibleCaption?.speaker === "teacher";

  return (
    <View style={styles.wrapper}>
      {visibleCaption ? (
        <View style={[styles.bubble, isTeacher ? styles.teacherBubble : styles.learnerBubble]}>
          <View style={styles.speakerRow}>
            <View style={[styles.dot, isTeacher ? styles.teacherDot : styles.learnerDot]} />
            <Text style={[styles.speakerName, isTeacher ? styles.teacherColor : styles.learnerColor]}>
              {visibleCaption.speakerName}
            </Text>
          </View>
          <Text style={styles.captionText}>{visibleCaption.text}</Text>
        </View>
      ) : isListening ? (
        <View style={[styles.bubble, styles.listeningBubble]}>
          <View style={styles.speakerRow}>
            <View style={[styles.dot, styles.learnerDot]} />
            <Text style={[styles.speakerName, styles.learnerColor]}>You</Text>
          </View>
          <Text style={styles.hintText}>Listening…</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 20,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    alignItems: "center",
  },
  bubble: {
    width: "100%",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  teacherBubble: {
    backgroundColor: "#f2edff",
  },
  learnerBubble: {
    backgroundColor: "#eefbf3",
  },
  listeningBubble: {
    backgroundColor: "#eefbf3",
  },
  speakerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  dot: {
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
  speakerName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    lineHeight: 15,
  },
  teacherColor: {
    color: "#5b3bf6",
  },
  learnerColor: {
    color: "#16a34a",
  },
  captionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    lineHeight: 23,
    color: "#001328",
  },
  hintText: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    lineHeight: 22,
    color: "#6b7280",
    fontStyle: "italic",
  },
});

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
import type React from "react";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { lessons } from "@/data/lessons";
import { todaysPlan, PlanItem } from "@/data/todaysPlan";
import { images } from "@/constants/images";

const DAILY_GOAL_XP = 20;
const CURRENT_XP = 15;
const STREAK_COUNT = 12;

const LANGUAGE_GREETINGS: Record<string, string> = {
  es: "Hola",
  fr: "Bonjour",
  ja: "こんにちは",
};

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function getPlanIconConfig(type: string): {
  name: IconName;
  bg: string;
  color: string;
} {
  switch (type) {
    case "ai-conversation":
      return { name: "headset", bg: "#EDE9FE", color: "#6c4ef5" };
    case "new-words":
      return { name: "chatbubble-ellipses", bg: "#FCE7F3", color: "#db2777" };
    default:
      return { name: "book", bg: "#EDE9FE", color: "#6c4ef5" };
  }
}

function PlanRow({
  item,
  showDivider,
}: {
  item: PlanItem;
  showDivider: boolean;
}) {
  const cfg = getPlanIconConfig(item.type);
  return (
    <>
      <View style={styles.planRow}>
        <View style={[styles.planIconBox, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.name} size={20} color={cfg.color} />
        </View>
        <View style={styles.planTextBlock}>
          <Text style={styles.planTitle}>{item.title}</Text>
          <Text style={styles.planSubtitle}>{item.subtitle}</Text>
        </View>
        <View
          style={[
            styles.statusCircle,
            item.completed && styles.statusCircleDone,
          ]}
        >
          {item.completed && (
            <Ionicons name="checkmark" size={14} color="#ffffff" />
          )}
        </View>
      </View>
      {showDivider && <View style={styles.planDivider} />}
    </>
  );
}

export default function HomeScreen() {
  const { user } = useUser();
  const { selectedLanguageId } = useLanguageStore();

  const selectedLanguage =
    languages.find((l) => l.id === selectedLanguageId) ?? languages[0];
  const languageUnit = units.find((u) => u.languageId === selectedLanguage.id);
  const currentLesson = languageUnit
    ? lessons.find((l) => l.unitId === languageUnit.id)
    : null;

  const firstName =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ??
    "Learner";

  const greeting = LANGUAGE_GREETINGS[selectedLanguage.id] ?? "Hello";
  const goalProgress = CURRENT_XP / DAILY_GOAL_XP;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ── Header ─────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: selectedLanguage.flag }}
            style={styles.flagCircle}
          />
          <Text style={styles.greeting}>
            {greeting}, {firstName}! 👋
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakRow}>
            <Image
              source={images.streakFire}
              style={styles.fireIcon}
              resizeMode="contain"
            />
            <Text style={styles.streakCount}>{STREAK_COUNT}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#001328" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Daily Goal Card ─────────────────────────────── */}
        <View style={styles.goalCard}>
          <View style={styles.goalLeft}>
            <Text style={styles.goalLabel}>Daily goal</Text>
            <View style={styles.goalXpRow}>
              <Text style={styles.goalXpCurrent}>{CURRENT_XP}</Text>
              <Text style={styles.goalXpTotal}> / {DAILY_GOAL_XP} XP</Text>
            </View>
            <View style={styles.goalTrack}>
              <View
                style={[
                  styles.goalFill,
                  { width: `${Math.round(goalProgress * 100)}%` },
                ]}
              />
            </View>
          </View>
          <Image
            source={images.treasure}
            style={styles.treasureImg}
            resizeMode="contain"
          />
        </View>

        {/* ── Continue Learning Card ──────────────────────── */}
        {currentLesson && (
          <View style={styles.continueCard}>
            <View style={styles.continueContent}>
              <Text style={styles.continueMeta}>Continue learning</Text>
              <Text style={styles.continueLanguage}>
                {selectedLanguage.name}
              </Text>
              <Text style={styles.continueUnit}>
                {"A1 · "}
                {languageUnit?.title ?? "Unit 1"}
              </Text>
              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.85}
                onPress={() =>
                  router.push(`/lesson/${currentLesson.id}` as never)
                }
              >
                <Text style={styles.continueBtnLabel}>Continue</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={images.palace}
              style={styles.palaceImg}
              resizeMode="contain"
            />
          </View>
        )}

        {/* ── Today's Plan ────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{"Today's plan"}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.planCard}>
            {todaysPlan.map((item, idx) => (
              <PlanRow
                key={item.id}
                item={item}
                showDivider={idx < todaysPlan.length - 1}
              />
            ))}
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

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flagCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  greeting: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#001328",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fireIcon: {
    width: 20,
    height: 20,
  },
  streakCount: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#001328",
  },
  bellBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Scroll ──────────────────────────────────────────────
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 110,
    gap: 16,
  },

  // ── Daily Goal Card ─────────────────────────────────────
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF9EC",
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 10,
    marginHorizontal: 20,
  },
  goalLeft: {
    flex: 1,
    paddingRight: 12,
  },
  goalLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  goalXpRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  goalXpCurrent: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#001328",
    lineHeight: 34,
  },
  goalXpTotal: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#6b7280",
  },
  goalTrack: {
    height: 8,
    backgroundColor: "#FFD9A0",
    borderRadius: 4,
    overflow: "hidden",
  },
  goalFill: {
    height: "100%",
    backgroundColor: "#FF8A00",
    borderRadius: 4,
  },
  treasureImg: {
    width: 76,
    height: 76,
  },

  // ── Continue Learning Card ──────────────────────────────
  continueCard: {
    flexDirection: "row",
    height: 180,
    backgroundColor: "#6c4ef5",
    borderRadius: 24,
    marginHorizontal: 20,
    overflow: "hidden",
    shadowColor: "#6c4ef5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  continueContent: {
    flex: 1,
    paddingTop: 22,
    paddingBottom: 22,
    paddingLeft: 22,
    paddingRight: 10,
    justifyContent: "center",
  },
  continueMeta: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 2,
  },
  continueLanguage: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#ffffff",
    lineHeight: 30,
  },
  continueUnit: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  continueBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 10,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  continueBtnLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#6c4ef5",
  },
  palaceImg: {
    width: 140,
    height: 180,
  },

  // ── Section ─────────────────────────────────────────────
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#001328",
  },
  viewAll: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#6c4ef5",
  },

  // ── Plan Card (container for all rows) ──────────────────
  planCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12,
  },
  planIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  planTextBlock: {
    flex: 1,
  },
  planTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#001328",
    lineHeight: 21,
  },
  planSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 1,
  },
  statusCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  statusCircleDone: {
    backgroundColor: "#4d88ff",
    borderColor: "#4d88ff",
  },
  planDivider: {
    height: 1,
    backgroundColor: "#f0f0f5",
    marginLeft: 72,
  },

});

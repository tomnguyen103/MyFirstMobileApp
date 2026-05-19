import {
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "@/components/tw";
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
      <View className="flex-row items-center px-4 py-[15px] gap-3">
        <View
          className="w-11 h-11 rounded-[13px] items-center justify-center"
          style={{ backgroundColor: cfg.bg }}
        >
          <Ionicons name={cfg.name} size={20} color={cfg.color} />
        </View>
        <View className="flex-1">
          <Text className="font-poppins-semibold text-[15px] text-text-primary leading-[21px]">{item.title}</Text>
          <Text className="body-sm mt-[1px]">{item.subtitle}</Text>
        </View>
        <View
          className={`w-[26px] h-[26px] rounded-full border-2 items-center justify-center ${
            item.completed ? "bg-lingua-blue border-lingua-blue" : "border-border"
          }`}
        >
          {item.completed && (
            <Ionicons name="checkmark" size={14} color="#ffffff" />
          )}
        </View>
      </View>
      {showDivider && <View className="h-px bg-[#f0f0f5] ml-[72px]" />}
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ── Header ─────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-5 py-[14px] bg-white border-b border-border">
        <View className="flex-row items-center gap-[10px]">
          <Image
            source={{ uri: selectedLanguage.flag }}
            className="w-8 h-8 rounded-full"
          />
          <Text className="font-poppins-semibold text-base text-text-primary">
            {greeting}, {firstName}! 👋
          </Text>
        </View>
        <View className="flex-row items-center gap-[14px]">
          <View className="flex-row items-center gap-1">
            <Image
              source={images.streakFire}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="font-poppins-semibold text-[15px] text-text-primary">{STREAK_COUNT}</Text>
          </View>
          <TouchableOpacity className="w-9 h-9 items-center justify-center" activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#001328" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 110, gap: 16 }}
      >
        {/* ── Daily Goal Card ─────────────────────────────── */}
        <View className="flex-row items-center bg-[#FEF9EC] rounded-xl pt-5 pb-5 pl-5 pr-[10px] mx-5">
          <View className="flex-1 pr-3">
            <Text className="body-sm mb-1">Daily goal</Text>
            <View className="flex-row items-baseline mb-3">
              <Text className="font-poppins-bold text-[28px] text-text-primary leading-[34px]">{CURRENT_XP}</Text>
              <Text className="font-poppins text-[15px] text-text-secondary"> / {DAILY_GOAL_XP} XP</Text>
            </View>
            <View className="h-2 bg-[#FFD9A0] rounded-xs overflow-hidden">
              <View
                className="h-full bg-[#FF8A00] rounded-xs"
                style={{ width: `${Math.round(goalProgress * 100)}%` }}
              />
            </View>
          </View>
          <Image
            source={images.treasure}
            className="w-[76px] h-[76px]"
            resizeMode="contain"
          />
        </View>

        {/* ── Continue Learning Card ──────────────────────── */}
        {currentLesson && (
          <View
            className="flex-row h-[180px] bg-lingua-purple rounded-[24px] mx-5 overflow-hidden"
            style={{
              shadowColor: "#6c4ef5",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-1 py-[22px] pl-[22px] pr-[10px] justify-center">
              <Text className="font-poppins text-[12px] text-white/75 mb-0.5">Continue learning</Text>
              <Text className="font-poppins-bold text-2xl text-white leading-[30px]">
                {selectedLanguage.name}
              </Text>
              <Text className="font-poppins text-[13px] text-white/75 mt-0.5">
                {"A1 · "}
                {languageUnit?.title ?? "Unit 1"}
              </Text>
              <TouchableOpacity
                className="bg-white rounded-full px-[22px] py-[10px] self-start mt-4"
                activeOpacity={0.85}
                onPress={() =>
                  router.push(`/lesson/${currentLesson.id}` as never)
                }
              >
                <Text className="font-poppins-semibold text-sm text-lingua-purple">Continue</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={images.palace}
              className="w-[140px] h-[180px]"
              resizeMode="contain"
            />
          </View>
        )}

        {/* ── Today's Plan ────────────────────────────────── */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-[14px]">
            <Text className="font-poppins-semibold text-[17px] text-text-primary">{"Today's plan"}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="font-poppins-medium text-[13px] text-lingua-purple">View all</Text>
            </TouchableOpacity>
          </View>
          <View
            className="bg-white rounded-[18px] overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
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
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
});

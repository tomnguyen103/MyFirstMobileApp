import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { images } from "@/constants/images";

export default function OnboardingScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/" />;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 px-6">
        {/* Header — left aligned */}
        <View className="flex-row items-center justify-center gap-2 pt-2">
          <Image
            source={images.mascotLogo}
            className="w-9 h-9"
            resizeMode="contain"
          />
          <Text className="font-poppins-semibold text-lg text-text-primary">Language</Text>
        </View>

        {/* Heading */}
        <View className="mt-8">
          <Text className="h1">Your AI language</Text>
          <Text className="h1 text-lingua-purple">teacher.</Text>
        </View>

        {/* Subtitle */}
        <Text className="body-md text-text-secondary mt-2">
          Real conversations, personalized lessons, anytime, anywhere.
        </Text>

        {/* Illustration + bubbles */}
        <View className="flex-1 items-center justify-center relative mt-2 mb-2">
          <Image
            source={images.mascotWelcome}
            className="w-full h-[90%]"
            resizeMode="contain"
          />

          {/* Hello! — left, tail points RIGHT toward mascot */}
          <View className="absolute rounded-xl px-4 py-[10px] left-0 top-[33%] bg-[#e8f0ff]" style={styles.shadow}>
            <Text className="font-poppins-semibold text-[15px] text-lingua-blue">Hello!</Text>
            <View style={[styles.tailPointRight, { borderLeftColor: "#e8f0ff" }]} />
          </View>

          {/* ¡Hola! — upper right, tail points LEFT toward mascot */}
          <View className="absolute rounded-xl px-4 py-[10px] right-0 top-[5%] bg-[#ede8ff]" style={styles.shadow}>
            <Text className="font-poppins-semibold text-[15px] text-lingua-purple italic">¡Hola!</Text>
            <View style={[styles.tailPointLeft, { borderRightColor: "#ede8ff" }]} />
          </View>

          {/* 你好! — lower right, tail points LEFT toward mascot */}
          <View className="absolute rounded-xl px-4 py-[10px] right-0 top-[44%] bg-[#ffe8e8]" style={styles.shadow}>
            <Text className="font-poppins-semibold text-[15px] text-[#e53e3e]">你好!</Text>
            <View style={[styles.tailPointLeft, { borderRightColor: "#ffe8e8" }]} />
          </View>

          {/* Xin chào! — top left, tail points RIGHT toward mascot */}
          <View className="absolute rounded-xl px-4 py-[10px] left-0 top-[8%] bg-[#e8fff3]" style={styles.shadow}>
            <Text className="font-poppins-semibold text-[15px] text-lingua-green">🇻🇳 Xin chào!</Text>
            <View style={[styles.tailPointRight, { borderLeftColor: "#e8fff3" }]} />
          </View>
        </View>

        {/* Get Started button */}
        <TouchableOpacity
          className="btn-primary flex-row gap-3 mb-8"
          activeOpacity={0.85}
          onPress={() => router.replace("/(auth)/sign-up")}
        >
          <Text className="btn-primary-label">Get Started</Text>
          <Text className="font-poppins-bold text-[22px] text-white leading-6">›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  // Platform-specific shadow syntax differs between iOS/Android — must stay in StyleSheet
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  // Triangle CSS trick using border manipulation — not expressible in NativeWind
  tailPointRight: {
    position: "absolute",
    right: -10,
    top: 10,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  tailPointLeft: {
    position: "absolute",
    left: -10,
    top: 10,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 10,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
});

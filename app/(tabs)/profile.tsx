import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "@/components/tw";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { selectedLanguageId } = useLanguageStore();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const selectedLanguage =
    languages.find((language) => language.id === selectedLanguageId) ?? languages[0];
  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ??
    "Language Learner";
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const initials = getInitials(displayName) || "LL";

  async function handleSignOut() {
    try {
      setSignOutError(null);
      setIsSigningOut(true);
      await signOut();
      router.replace("/onboarding");
    } catch (error) {
      console.error(error);
      setSignOutError("We couldn't sign you out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View className="px-5 py-3.5 bg-white border-b border-border">
        <Text className="font-poppins-bold text-[22px] text-text-primary leading-7">
          Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          className="mx-5 mt-5 rounded-6 bg-lingua-purple overflow-hidden"
          style={styles.profileCard}
        >
          <View className="flex-row items-center gap-4 p-5">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-17 h-17 rounded-full border-2 border-white/30"
              />
            ) : (
              <View className="w-17 h-17 rounded-full bg-white/20 border-2 border-white/30 items-center justify-center">
                <Text className="font-poppins-bold text-xl text-white">
                  {initials}
                </Text>
              </View>
            )}

            <View className="flex-1">
              <Text className="font-poppins-bold text-xl text-white leading-6.5">
                {displayName}
              </Text>
              {email && (
                <Text className="font-poppins text-xs text-white/75 mt-1" numberOfLines={1}>
                  {email}
                </Text>
              )}
              <View className="flex-row items-center gap-2 mt-3">
                <Image
                  source={{ uri: selectedLanguage.flag }}
                  className="w-6 h-6 rounded-full"
                />
                <Text className="font-poppins-semibold text-[13px] text-white">
                  Learning {selectedLanguage.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="font-poppins-semibold text-[17px] text-text-primary mb-3">
            Language
          </Text>

          <TouchableOpacity
            className="flex-row items-center gap-3 bg-white rounded-4.5 px-4 py-4"
            style={styles.optionCard}
            activeOpacity={0.8}
            onPress={() => router.push("/language-selection")}
          >
            <Image
              source={{ uri: selectedLanguage.flag }}
              className="w-11 h-11 rounded-full"
            />
            <View className="flex-1">
              <Text className="font-poppins-semibold text-[15px] text-text-primary leading-5.25">
                Select Language
              </Text>
              <Text className="body-sm mt-0.5">
                Current: {selectedLanguage.name}
              </Text>
            </View>
            <View className="w-9 h-9 rounded-full bg-[#f5f3ff] items-center justify-center">
              <Ionicons name="chevron-forward" size={18} color="#6c4ef5" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-6">
          <Text className="font-poppins-semibold text-[17px] text-text-primary mb-3">
            Account
          </Text>

          <TouchableOpacity
            className="flex-row items-center gap-3 bg-white border border-[#ffe0e0] rounded-4.5 px-4 py-4"
            activeOpacity={0.8}
            disabled={isSigningOut}
            onPress={handleSignOut}
          >
            <View className="w-10 h-10 rounded-full bg-[#fff0f0] items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="#ff4d4f" />
            </View>
            <View className="flex-1">
              <Text className="font-poppins-semibold text-[15px] text-error leading-5.25">
                {isSigningOut ? "Signing out..." : "Sign out"}
              </Text>
              <Text className="body-sm mt-0.5">
                Return to the welcome screen
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ff9b9c" />
          </TouchableOpacity>

          {signOutError && (
            <Text className="body-sm text-error mt-3">{signOutError}</Text>
          )}
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
  scrollContent: {
    paddingBottom: 110,
  },
  profileCard: {
    shadowColor: "#6c4ef5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 6,
  },
  optionCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
});

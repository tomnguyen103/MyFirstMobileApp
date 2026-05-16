import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/onboarding" />;

  return (
    <SafeAreaView style={styles.safe}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo */}
        <Image source={images.mascotLogo} style={styles.logo} resizeMode="contain" />

        {/* Title */}
        <Text className="h1 text-lingua-purple mt-4">LinguaAI</Text>
        <Text className="body-md text-text-secondary text-center mt-1">
          Your AI language teacher
        </Text>

        {/* CTA */}
        <TouchableOpacity
          className="btn-primary mt-10"
          activeOpacity={0.85}
          onPress={() => router.push("/language-selection")}
        >
          <Text className="btn-primary-label">Choose a Language</Text>
        </TouchableOpacity>

        {/* Sign Out — subtle text link */}
        <TouchableOpacity
          className="mt-5"
          activeOpacity={0.7}
          onPress={async () => { await signOut(); router.replace("/onboarding"); }}
        >
          <Text className="body-sm text-text-secondary">Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 72,
    height: 72,
  },
});

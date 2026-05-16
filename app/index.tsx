import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/onboarding" />;

  return (
    <View className="flex-1 justify-center items-center px-6 gap-6">
      <Text className="h1 text-center text-lingua-purple">Language</Text>

      <TouchableOpacity
        className="btn-primary"
        activeOpacity={0.85}
        onPress={async () => { await signOut(); router.replace("/onboarding"); }}
      >
        <Text className="btn-primary-label">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

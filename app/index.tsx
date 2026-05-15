import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="h1 text-center text-lingua-purple">Language</Text>
      <TouchableOpacity
        className="btn-primary mt-6"
        activeOpacity={0.85}
        onPress={() => router.push("/onboarding" as never)}
      >
        <Text className="btn-primary-label">View Onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

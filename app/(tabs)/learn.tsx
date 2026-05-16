import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="h3 text-text-primary">Learn</Text>
        <Text className="body-md text-text-secondary mt-2">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

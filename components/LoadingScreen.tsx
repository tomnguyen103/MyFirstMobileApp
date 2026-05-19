import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.container}>
        <View style={styles.mark} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  mark: {
    width: 48,
    height: 48,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: "#6c4ef5",
  },
  message: {
    color: "#001328",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
});

import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function OAuthCallback() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    WebBrowser.dismissBrowser();
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#6c4ef5" />
    </View>
  );
}

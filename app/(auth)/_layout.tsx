import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingScreen message="Checking your session..." />;
  if (isSignedIn) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

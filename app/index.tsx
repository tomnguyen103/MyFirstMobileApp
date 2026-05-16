import { useAuth } from "@clerk/expo";
import { Href, Redirect } from "expo-router";
import { useLanguageStore } from "@/store/languageStore";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { selectedLanguageId, _hasHydrated } = useLanguageStore();

  if (!isLoaded || !_hasHydrated) return null;
  if (!isSignedIn) return <Redirect href="/onboarding" />;
  if (!selectedLanguageId) return <Redirect href="/language-selection" />;

  return <Redirect href={"/(tabs)" as Href} />;
}

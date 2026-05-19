import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn, useSSO } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "@/components/tw";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";
import GoogleIcon from "@/components/GoogleIcon";

WebBrowser.maybeCompleteAuthSession();

const oauthRedirectUrl = makeRedirectUri({
  scheme: "myfirstmobileapp",
  isTripleSlashed: true,
  path: "oauth-callback",
});

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalError, setModalError] = useState<string | undefined>();

  // Step 1: Send a sign-in code to the user's email
  async function handleSignIn() {
    if (!email) return;

    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    setModalVisible(true);
  }

  // Step 2: Verify the code and finalize the session
  async function handleVerify(code: string) {
    setModalError(undefined);

    const { error } = await signIn.emailCode.verifyCode({ code });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      setModalError(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) return;
          router.replace("/");
        },
      });
      setModalVisible(false);
    }
  }

  async function handleResend() {
    await signIn.emailCode.sendCode({ emailAddress: email });
  }

  async function handleSSO(strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: oauthRedirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        await WebBrowser.dismissBrowser();
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pb-8">
            {/* Back */}
            <TouchableOpacity
              className="mt-2 self-start"
              activeOpacity={0.7}
              onPress={() => router.replace("/onboarding")}
            >
              <Ionicons name="chevron-back" size={24} color="#001328" />
            </TouchableOpacity>

            {/* Heading */}
            <View className="mt-6">
              <Text className="h2">Welcome back</Text>
              <Text className="body-md text-text-secondary mt-1">
                Login to continue your journey 👋
              </Text>
            </View>

            {/* Mascot */}
            <View className="items-center mt-4">
              <Image
                source={images.mascotAuth}
                style={{ width: 160, height: 140 }}
                resizeMode="contain"
              />
            </View>

            {/* Form */}
            <View className="mt-5">
              <View className="border border-border rounded-xl px-4 pt-[10px] pb-3">
                <Text className="caption mb-1">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="alex@gmail.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  className="font-poppins text-sm text-text-primary p-0"
                />
              </View>
              {errors?.fields?.identifier && (
                <Text className="body-sm text-error mt-1">
                  {errors.fields.identifier.message}
                </Text>
              )}
              {errors?.global?.map((e, i) => (
                <Text key={i} className="body-sm text-error mt-1">
                  {e.message}
                </Text>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity
              className="btn-primary mt-6"
              activeOpacity={0.85}
              disabled={!email || fetchStatus === "fetching"}
              onPress={handleSignIn}
            >
              <Text className="btn-primary-label">Sign In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center gap-3 mt-6">
              <View className="flex-1 h-[1px] bg-border" />
              <Text className="caption text-text-secondary">or continue with</Text>
              <View className="flex-1 h-[1px] bg-border" />
            </View>

            {/* Social buttons */}
            <View className="mt-4 gap-3">
              <SocialButton
                iconElement={<GoogleIcon size={20} />}
                label="Continue with Google"
                onPress={() => handleSSO("oauth_google")}
              />
              <SocialButton
                icon="logo-facebook"
                label="Continue with Facebook"
                iconColor="#1877F2"
                onPress={() => handleSSO("oauth_facebook")}
              />
              <SocialButton
                icon="logo-apple"
                label="Continue with Apple"
                iconColor="#000000"
                onPress={() => handleSSO("oauth_apple")}
              />
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-center mt-8">
              <Text className="body-sm">{"Don't have an account? "}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.replace("/(auth)/sign-up")}
              >
                <Text className="font-poppins-semibold text-[13px] text-lingua-purple">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        email={email}
        error={modalError}
      />
    </SafeAreaView>
  );
}

function SocialButton({
  icon,
  iconColor,
  iconElement,
  label,
  onPress,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  iconElement?: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="flex-row items-center border border-border rounded-xl py-[14px] px-4 bg-white"
      onPress={onPress}
    >
      {iconElement ?? <Ionicons name={icon!} size={20} color={iconColor} />}
      <Text className="font-poppins-medium text-sm text-text-primary flex-1 text-center">{label}</Text>
    </TouchableOpacity>
  );
}

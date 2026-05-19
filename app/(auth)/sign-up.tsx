import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useSignUp, useSSO } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "@/components/tw";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";
import GoogleIcon from "@/components/GoogleIcon";

const SSO_METHOD = {
  oauth_google: "google",
  oauth_facebook: "facebook",
  oauth_apple: "apple",
} as const;

WebBrowser.maybeCompleteAuthSession();

const oauthRedirectUrl = makeRedirectUri({
  scheme: "myfirstmobileapp",
  isTripleSlashed: true,
  path: "oauth-callback",
});

export default function SignUpScreen() {
  const { isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const posthog = usePostHog();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalError, setModalError] = useState<string | undefined>();

  // Redirect if already signed in (auth guard in _layout handles it, this prevents flash)
  if (signUp.status === "complete" || isSignedIn) return null;

  async function handleSignUp() {
    if (!email || !password) return;

    posthog.capture("signup_attempted", { method: "email" });

    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      posthog.capture("signup_failed", { method: "email", error: error.message });
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    // Email verification required — send the code
    await signUp.verifications.sendEmailCode();
    posthog.capture("signup_verification_shown");
    setModalVisible(true);
  }

  async function handleVerify(code: string) {
    setModalError(undefined);

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      if (signUp.createdUserId) {
        posthog.identify(signUp.createdUserId, { email });
      }
      posthog.capture("signup_completed", { method: "email" });
      await signUp.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) return;
          router.replace("/");
        },
      });
      setModalVisible(false);
    } else {
      posthog.capture("signup_verification_failed");
      setModalError("Incorrect code. Please try again.");
    }
  }

  async function handleResend() {
    posthog.capture("signup_verification_resent");
    await signUp.verifications.sendEmailCode();
  }

  async function handleSSO(strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") {
    const method = SSO_METHOD[strategy];
    posthog.capture("signup_attempted", { method });

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: oauthRedirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        await WebBrowser.dismissBrowser();
        posthog.capture("signup_completed", { method });
        router.replace("/");
      }
    } catch (err) {
      posthog.capture("signup_failed", { method, error: String(err) });
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
              <Text className="h2">Create your account</Text>
              <Text className="body-md text-text-secondary mt-1">
                Start your language journey today ✨
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
            <View className="mt-5 gap-4">
              {/* Email */}
              <View>
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
                {errors?.fields?.emailAddress && (
                  <Text className="body-sm text-error mt-1">
                    {errors.fields.emailAddress.message}
                  </Text>
                )}
              </View>

              {/* Password */}
              <View>
                <View className="border border-border rounded-xl px-4 pt-[10px] pb-3 flex-row items-center">
                  <View style={{ flex: 1 }}>
                    <Text className="caption mb-1">Password</Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                      underlineColorAndroid="transparent"
                      className="font-poppins text-sm text-text-primary p-0"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
                {errors?.fields?.password && (
                  <Text className="body-sm text-error mt-1">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>
            </View>

            {/* Global errors */}
            {errors?.global?.map((e, i) => (
              <Text key={i} className="body-sm text-error mt-2">
                {e.message}
              </Text>
            ))}

            {/* CTA */}
            <TouchableOpacity
              className="btn-primary mt-6"
              activeOpacity={0.85}
              disabled={!email || !password || fetchStatus === "fetching"}
              onPress={handleSignUp}
            >
              <Text className="btn-primary-label">Sign Up</Text>
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
              <Text className="body-sm">Already have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.replace("/(auth)/sign-in")}
              >
                <Text className="font-poppins-semibold text-[13px] text-lingua-purple">Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Required for Clerk bot protection */}
      <View nativeID="clerk-captcha" />

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

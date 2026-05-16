import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useSignUp, useSSO } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";
import GoogleIcon from "@/components/GoogleIcon";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalError, setModalError] = useState<string | undefined>();

  // Redirect if already signed in (auth guard in _layout handles it, this prevents flash)
  if (signUp.status === "complete" || isSignedIn) return null;

  async function handleSignUp() {
    if (!email || !password) return;

    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    // Email verification required — send the code
    await signUp.verifications.sendEmailCode();
    setModalVisible(true);
  }

  async function handleVerify(code: string) {
    setModalError(undefined);

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) return;
          router.replace("/");
        },
      });
      setModalVisible(false);
    } else {
      setModalError("Incorrect code. Please try again.");
    }
  }

  async function handleResend() {
    await signUp.verifications.sendEmailCode();
  }

  async function handleSSO(strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: makeRedirectUri({ path: "oauth-callback" }),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
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
                <View style={styles.inputWrap}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="alex@gmail.com"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    style={styles.input}
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
                <View style={[styles.inputWrap, styles.row]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                      underlineColorAndroid="transparent"
                      style={styles.input}
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
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.replace("/(auth)/sign-in")}
              >
                <Text style={styles.footerLink}>Log in</Text>
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
    <TouchableOpacity activeOpacity={0.85} style={styles.socialBtn} onPress={onPress}>
      {iconElement ?? <Ionicons name={icon!} size={20} color={iconColor} />}
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  inputWrap: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
  },
  input: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#001328",
    padding: 0,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  socialLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#001328",
    flex: 1,
    textAlign: "center",
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
  },
  footerLink: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#6c4ef5",
  },
});

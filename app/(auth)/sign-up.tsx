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
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";
import GoogleIcon from "@/components/GoogleIcon";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
              onPress={() => router.back()}
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

              {/* Password */}
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
            </View>

            {/* CTA */}
            <TouchableOpacity
              className="btn-primary mt-6"
              activeOpacity={0.85}
              onPress={() => email && setModalVisible(true)}
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
              />
              <SocialButton
                icon="logo-facebook"
                label="Continue with Facebook"
                iconColor="#1877F2"
              />
              <SocialButton
                icon="logo-apple"
                label="Continue with Apple"
                iconColor="#000000"
              />
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-center mt-8">
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(auth)/sign-in")}
              >
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        email={email}
      />
    </SafeAreaView>
  );
}

function SocialButton({
  icon,
  iconColor,
  iconElement,
  label,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  iconElement?: React.ReactNode;
  label: string;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.socialBtn}>
      {iconElement ?? (
        <Ionicons name={icon!} size={20} color={iconColor} />
      )}
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

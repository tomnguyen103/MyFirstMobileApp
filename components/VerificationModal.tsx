import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRef, useState, useEffect } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  email: string;
  error?: string;
}

export default function VerificationModal({
  visible,
  onClose,
  onVerify,
  onResend,
  email,
  error,
}: Props) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setCode("");
      const t = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  async function handleChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 6);
    setCode(digits);

    if (digits.length === 6 && !isVerifying) {
      setIsVerifying(true);
      await onVerify(digits);
      setIsVerifying(false);
      setCode(""); // clear so the user can retry on error
    }
  }

  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "your email";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.avoidingView}
        >
          <View style={styles.sheet}>
            {/* Drag handle */}
            <View className="w-10 h-1 bg-border rounded-full self-center mb-6" />

            <Text className="h3 text-center">Check your email</Text>
            <Text className="body-md text-text-secondary text-center mt-2 mb-8">
              {"We sent a 6-digit code to\n"}
              <Text style={styles.emailHighlight}>{maskedEmail}</Text>
            </Text>

            {/* OTP input — 6 boxes with a hidden overlay TextInput */}
            <View style={styles.otpContainer}>
              <View className="flex-row justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => {
                  const filled = i < code.length;
                  const active = i === code.length && visible;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.otpBox,
                        filled && styles.otpBoxFilled,
                        active && styles.otpBoxActive,
                      ]}
                    >
                      <Text style={styles.otpDigit}>{code[i] ?? ""}</Text>
                    </View>
                  );
                })}
              </View>
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={6}
                caretHidden
                editable={!isVerifying}
                style={[StyleSheet.absoluteFillObject, { opacity: 0 }]}
              />
            </View>

            {/* Error message */}
            {error ? (
              <Text className="body-sm text-error text-center mt-3">{error}</Text>
            ) : null}

            {/* Resend */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ marginTop: 28 }}
              onPress={onResend}
              disabled={isVerifying}
            >
              <Text style={styles.resendText}>
                Didn&apos;t receive it?{" "}
                <Text style={styles.resendLink}>Resend code</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  avoidingView: {
    width: "100%",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 44,
  },
  emailHighlight: {
    fontFamily: "Poppins-SemiBold",
    color: "#001328",
  },
  otpContainer: {
    position: "relative",
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f6f7fb",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxFilled: {
    borderColor: "#6c4ef5",
    backgroundColor: "#f0ecfe",
  },
  otpBoxActive: {
    borderColor: "#6c4ef5",
    backgroundColor: "#fff",
  },
  otpDigit: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#001328",
  },
  resendText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
  resendLink: {
    fontFamily: "Poppins-SemiBold",
    color: "#6c4ef5",
  },
});

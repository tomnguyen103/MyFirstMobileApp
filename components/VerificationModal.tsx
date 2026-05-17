import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full"
        >
          <View className="bg-white rounded-t-[28px] px-6 pt-4 pb-11">
            {/* Drag handle */}
            <View className="w-10 h-1 bg-border rounded-full self-center mb-6" />

            <Text className="h3 text-center">Check your email</Text>
            <Text className="body-md text-text-secondary text-center mt-2 mb-8">
              {"We sent a 6-digit code to\n"}
              <Text className="font-poppins-semibold text-text-primary">{maskedEmail}</Text>
            </Text>

            {/* OTP input — 6 boxes with a hidden overlay TextInput */}
            <View className="relative">
              <View className="flex-row justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => {
                  const filled = i < code.length;
                  const active = i === code.length && visible;
                  return (
                    <View
                      key={i}
                      className={`w-12 h-14 rounded-md border-2 items-center justify-center ${
                        filled
                          ? "border-lingua-purple bg-[#f0ecfe]"
                          : active
                          ? "border-lingua-purple bg-white"
                          : "border-border bg-surface"
                      }`}
                    >
                      <Text className="font-poppins-bold text-[22px] text-text-primary">{code[i] ?? ""}</Text>
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
                className="absolute inset-0 opacity-0"
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
              <Text className="body-sm text-center">
                Didn&apos;t receive it?{" "}
                <Text className="font-poppins-semibold text-lingua-purple">Resend code</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

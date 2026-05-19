import { useState } from "react";
import {
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePostHog } from "posthog-react-native";
import { Image, Text, TextInput, TouchableOpacity, View } from "@/components/tw";
import { languages } from "@/data/languages";
import { Language } from "@/types/learning";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";

export default function LanguageSelectionScreen() {
  const posthog = usePostHog();
  const { selectedLanguageId, setSelectedLanguage } = useLanguageStore();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(selectedLanguageId);

  const filtered = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleConfirm() {
    const selectedLanguage = languages.find((lang) => lang.id === selectedId);
    if (!selectedLanguage) return;

    setSelectedLanguage(selectedLanguage.id);
    posthog.capture("language_selected", {
      language_code: selectedLanguage.id,
      language_name: selectedLanguage.name,
    });
    router.replace("/");
  }

  function renderItem({ item }: { item: Language }) {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.7}
        className={`flex-row items-center px-6 py-[14px] mx-2 rounded-xl border-[1.5px] ${
          isSelected ? "bg-[#ede8ff] border-lingua-purple" : "bg-white border-transparent"
        }`}
      >
        <Image
          source={{ uri: item.flag }}
          className="w-11 h-11 rounded-full"
        />
        <View className="flex-1 ml-3">
          <Text className="body-md font-poppins-semibold text-text-primary">
            {item.name}
          </Text>
          <Text className="caption">{item.learners}</Text>
        </View>
        {isSelected ? (
          <Ionicons name="checkmark-circle" size={24} color="#6c4ef5" />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-3">
        {selectedLanguageId ? (
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#001328" />
          </TouchableOpacity>
        ) : (
          <View className="w-6" />
        )}
        <Text className="font-poppins-semibold text-base text-text-primary flex-1 text-center">
          Choose a language
        </Text>
        <View className="w-6" />
      </View>

      {/* Search bar */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center gap-2 bg-surface rounded-full px-4 py-3">
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search languages"
            placeholderTextColor="#9ca3af"
            className="flex-1 font-poppins text-sm text-text-primary py-0"
          />
        </View>
      </View>

      {/* Language list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="font-poppins-semibold text-[13px] text-text-primary px-6 pb-2">Popular</Text>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-border ml-22 mr-2" />}
        ListFooterComponent={
          <View className="mt-4">
            <TouchableOpacity
              className={`mx-6 rounded-full items-center justify-center py-[14px] ${
                !selectedId ? "bg-[#c4b8fa]" : "bg-lingua-purple"
              }`}
              activeOpacity={0.85}
              onPress={handleConfirm}
              disabled={!selectedId}
            >
              <Text className="font-poppins-bold text-base text-white">Confirm</Text>
            </TouchableOpacity>
            <Image
              source={images.earth}
              className="w-full h-[180px] mt-3"
              resizeMode="contain"
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

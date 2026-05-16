import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { languages } from "@/data/languages";
import { Language } from "@/types/learning";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";

export default function LanguageSelectionScreen() {
  const { selectedLanguageId, setSelectedLanguage } = useLanguageStore();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(selectedLanguageId);

  const filtered = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleConfirm() {
    if (selectedId) {
      setSelectedLanguage(selectedId);
      router.replace("/");
    }
  }

  function renderItem({ item }: { item: Language }) {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.7}
        style={[styles.langItem, isSelected && styles.langItemSelected]}
      >
        <Image
          source={{ uri: item.flag }}
          style={styles.flag}
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
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-3">
        {selectedLanguageId ? (
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#001328" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
        <Text
          className="font-poppins-semibold text-text-primary flex-1 text-center"
          style={styles.title}
        >
          Choose a language
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search bar */}
      <View className="px-6 pb-4">
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search languages"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Language list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>Popular</Text>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !selectedId && styles.confirmBtnDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleConfirm}
              disabled={!selectedId}
            >
              <Text style={styles.confirmBtnLabel}>Confirm</Text>
            </TouchableOpacity>
            <Image
              source={images.earth}
              style={styles.earthImage}
              resizeMode="contain"
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16,
  },
  headerSpacer: {
    width: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f6f7fb",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#001328",
    paddingVertical: 0,
  },
  sectionLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#001328",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    backgroundColor: "#ffffff",
  },
  langItemSelected: {
    backgroundColor: "#ede8ff",
    borderColor: "#6c4ef5",
  },
  flag: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 24 + 8 + 44 + 12,
    marginRight: 8,
  },
  footer: {
    marginTop: 16,
  },
  confirmBtn: {
    marginHorizontal: 24,
    backgroundColor: "#6c4ef5",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  confirmBtnDisabled: {
    backgroundColor: "#c4b8fa",
  },
  confirmBtnLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#ffffff",
  },
  earthImage: {
    width: "100%",
    height: 180,
    marginTop: 12,
  },
});

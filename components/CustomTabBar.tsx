import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_COUNT = 5;
const CIRCLE_SIZE = 52;
const TAB_HEIGHT = 68;

type TabConfig = {
  label: string;
  iconActive: React.ComponentProps<typeof Ionicons>["name"];
  iconInactive: React.ComponentProps<typeof Ionicons>["name"];
};

const TAB_CONFIG: TabConfig[] = [
  { label: "Home", iconActive: "home", iconInactive: "home-outline" },
  { label: "Learn", iconActive: "book", iconInactive: "book-outline" },
  { label: "AI Teacher", iconActive: "school", iconInactive: "school-outline" },
  { label: "Chat", iconActive: "chatbubble", iconInactive: "chatbubble-outline" },
  { label: "Profile", iconActive: "person", iconInactive: "person-outline" },
];

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;

  const tabWidth = width / TAB_COUNT;
  const circleLeft = (index: number) => index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;

  const translateX = useSharedValue(circleLeft(activeIndex));

  useEffect(() => {
    translateX.value = withTiming(circleLeft(activeIndex), {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  }, [activeIndex, tabWidth]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.inner}>
        {/* Sliding active circle */}
        <Animated.View style={[styles.circle, animatedCircleStyle]} />

        {/* Tab buttons */}
        {TAB_CONFIG.map((tab, index) => {
          const isActive = index === activeIndex;
          const route = state.routes[index];

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name as never)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.iconInactive}
                size={22}
                color={isActive ? "#ffffff" : "#9ca3af"}
              />
              {!isActive && (
                <Text style={styles.label} numberOfLines={1}>
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  inner: {
    flexDirection: "row",
    height: TAB_HEIGHT,
    alignItems: "center",
    position: "relative",
  },
  circle: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#6c4ef5",
    top: (TAB_HEIGHT - CIRCLE_SIZE) / 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 3,
  },
});

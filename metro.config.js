const { withNativewind } = require("nativewind/metro");
const { getPostHogExpoConfig } = require("posthog-react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getPostHogExpoConfig(__dirname);

module.exports = withNativewind(config, { input: "./global.css" });

import { LogBox } from "react-native";
import "expo-auth-session";
import "expo-web-browser";

declare const require: (moduleName: string) => unknown;

const ignoredWarnings = [
  "`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.",
  "`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.",
];

LogBox.ignoreLogs(ignoredWarnings);

const originalWarn = console.warn;
console.warn = (...args: Parameters<typeof console.warn>) => {
  const [firstArg] = args;

  if (
    typeof firstArg === "string" &&
    ignoredWarnings.some((warning) => firstArg.includes(warning))
  ) {
    return;
  }

  originalWarn(...args);
};

require("expo-router/entry");

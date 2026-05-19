import Constants from "expo-constants";

function getLocalApiOrigin(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    try {
      // hostUri is "host:port" with no scheme — prefix http:// so URL can parse it
      const raw = hostUri.includes("://") ? hostUri : `http://${hostUri}`;
      const { host } = new URL(raw);
      return `http://${host}`;
    } catch {
      // fall through to env fallback
    }
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
}

export function getApiUrl(path: string): string {
  const origin = getLocalApiOrigin();
  if (!origin) {
    throw new Error(
      "No API base URL resolved. Set EXPO_PUBLIC_API_BASE_URL or run via Expo Go."
    );
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

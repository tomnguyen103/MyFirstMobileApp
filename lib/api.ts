import Constants from "expo-constants";

function getLocalApiOrigin() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri) {
    return "";
  }

  const host = hostUri.split(":")[0];
  return `http://${host}:8081`;
}

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const origin = getLocalApiOrigin();

  return origin ? `${origin}${normalizedPath}` : normalizedPath;
}

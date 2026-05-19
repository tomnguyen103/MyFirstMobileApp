import { getApiUrl } from "@/lib/api";

export type StreamAudioCallRequest = {
  lessonId: string;
  languageId: string;
  userId: string;
  userName: string;
  userImage?: string;
  authToken?: string | null;
};

export type StreamAudioCallResponse = {
  apiKey: string;
  token: string;
  callId: string;
  callType: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
};

export type AgentSessionResponse = {
  sessionId: string;
  callId: string;
  startedAt?: string;
};

export async function createStreamAudioCall({
  authToken,
  ...payload
}: StreamAudioCallRequest) {
  const response = await fetch(getApiUrl("/api/stream/audio-call"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as
    | StreamAudioCallResponse
    | { error?: string };

  if (!response.ok) {
    const message =
      "error" in data ? data.error : "Unable to prepare Stream audio call.";
    throw new Error(message ?? "Unable to prepare Stream audio call.");
  }

  return data as StreamAudioCallResponse;
}

export async function startVisionAgentSession({
  authToken,
  callId,
  callType,
}: {
  authToken?: string | null;
  callId: string;
  callType: string;
}) {
  let response: Response;
  try {
    response = await fetch(getApiUrl("/api/vision-agent/start"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ callId, callType }),
    });
  } catch {
    throw new Error("Unable to reach the AI teacher server.");
  }

  const data = (await response.json()) as AgentSessionResponse | { error?: string };

  if (!response.ok) {
    const message = "error" in data ? data.error : "Unable to start AI teacher.";
    throw new Error(message ?? "Unable to start AI teacher.");
  }

  return data as AgentSessionResponse;
}

export async function stopVisionAgentSession({
  authToken,
  callId,
  sessionId,
}: {
  authToken?: string | null;
  callId: string;
  sessionId: string;
}) {
  let response: Response;
  try {
    response = await fetch(getApiUrl("/api/vision-agent/stop"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ callId, sessionId }),
    });
  } catch {
    throw new Error("Unable to reach the AI teacher server.");
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Unable to stop AI teacher.");
  }
}

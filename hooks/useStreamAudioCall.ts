import { useAuth, useUser } from "@clerk/expo";
// `import type` is erased at compile time — no runtime module evaluation.
// The SDK throws at load time when its native WebRTC module isn't in the build,
// so we never statically import values from it. See `requireStreamSDK` below.
import type {
  Call,
  StreamVideoClient,
  User as StreamVideoUser,
} from "@stream-io/video-react-native-sdk";
import { NativeModules } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createStreamAudioCall,
  startVisionAgentSession,
  stopVisionAgentSession,
} from "@/lib/stream";

export type AudioCallStatus =
  | "idle"
  | "loading"
  | "ready"
  | "connecting"
  | "joined"
  | "ended"
  | "error";

export type AgentConnectionStatus = "idle" | "connecting" | "connected" | "failed";

// @stream-io/react-native-webrtc throws at module-load time when `NativeModules.WebRTCModule`
// is null — which happens when the dev build was compiled before the SDK was added.
// Guard all SDK usage behind this flag; the fix for users is `npx expo run:android`.
const IS_WEBRTC_AVAILABLE = NativeModules?.WebRTCModule != null;

const NEEDS_REBUILD_MSG =
  "Stream audio requires a native rebuild. Run `npx expo run:android` to enable audio calls.";

function requireStreamSDK() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@stream-io/video-react-native-sdk") as typeof import("@stream-io/video-react-native-sdk");
}

type UseStreamAudioCallParams = {
  lessonId?: string;
  languageId?: string;
};

export function useStreamAudioCall({
  lessonId,
  languageId,
}: UseStreamAudioCallParams) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [status, setStatus] = useState<AudioCallStatus>(
    IS_WEBRTC_AVAILABLE ? "idle" : "error"
  );
  const [error, setError] = useState<string | null>(
    IS_WEBRTC_AVAILABLE ? null : NEEDS_REBUILD_MSG
  );
  const [agentStatus, setAgentStatus] = useState<AgentConnectionStatus>("idle");
  const [agentError, setAgentError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const callIdRef = useRef<string | null>(null);
  const callTypeRef = useRef<string | null>(null);
  const agentSessionIdRef = useRef<string | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<Call | null>(null);
  // Stable ref so cleanupAgent/cleanupCall never change identity when getToken does
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const displayName = useMemo(() => {
    if (!user) {
      return "Guest learner";
    }

    return user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Learner";
  }, [user]);

  const cleanupAgent = useCallback(async () => {
    const currentCallId = callIdRef.current;
    const currentSessionId = agentSessionIdRef.current;

    if (!currentCallId || !currentSessionId) {
      setAgentStatus("idle");
      setAgentError(null);
      return;
    }

    agentSessionIdRef.current = null;

    try {
      const authToken = await getTokenRef.current();
      await stopVisionAgentSession({
        callId: currentCallId,
        sessionId: currentSessionId,
        authToken,
      });
      setAgentStatus("idle");
      setAgentError(null);
    } catch {
      setAgentStatus("failed");
      setAgentError("Unable to stop the AI teacher session.");
    }
  // getToken is accessed via getTokenRef so this callback is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanupCall = useCallback(async () => {
    const currentCall = callRef.current;
    const currentClient = clientRef.current;

    await cleanupAgent();

    callRef.current = null;
    clientRef.current = null;
    setIsMuted(false);
    callIdRef.current = null;
    setCallId(null);
    callTypeRef.current = null;

    try {
      await currentCall?.leave();
    } catch {
      // The SDK may already have left during an ended-call flow.
    }

    await currentClient?.disconnectUser();
  }, [cleanupAgent]);

  useEffect(() => {
    return () => {
      void cleanupCall();
    };
  }, [cleanupCall]);

  const startCall = useCallback(async () => {
    if (!IS_WEBRTC_AVAILABLE) {
      setError(NEEDS_REBUILD_MSG);
      setStatus("error");
      return;
    }

    if (!lessonId || !languageId) {
      setError("Select a lesson before starting the audio call.");
      setStatus("error");
      return;
    }

    if (!isSignedIn || !user?.id) {
      setError("Sign in with Clerk before starting the audio call.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      await cleanupCall();

      const authToken = await getToken();
      const setup = await createStreamAudioCall({
        lessonId,
        languageId,
        userId: user.id,
        userName: displayName,
        userImage: user.imageUrl,
        authToken,
      });

      const sdk = requireStreamSDK();

      const streamUser: StreamVideoUser = {
        id: setup.user.id,
        name: setup.user.name,
        image: setup.user.image,
      };

      const nextClient = sdk.StreamVideoClient.getOrCreateInstance({
        apiKey: setup.apiKey,
        token: setup.token,
        user: streamUser,
      });
      const nextCall = nextClient.call(setup.callType, setup.callId, {
        reuseInstance: false,
      });

      clientRef.current = nextClient;
      callRef.current = nextCall;
      callIdRef.current = setup.callId;
      callTypeRef.current = setup.callType;
      setCallId(setup.callId);
      setAgentStatus("idle");
      setAgentError(null);
      setStatus("ready");
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start the audio call."
      );
      setStatus("error");
    }
  }, [
    cleanupCall,
    displayName,
    getToken,
    isSignedIn,
    languageId,
    lessonId,
    user,
  ]);

  const joinCall = useCallback(async () => {
    const currentCall = callRef.current;

    if (!currentCall) {
      setError("Start the audio call before joining.");
      setStatus("error");
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      await currentCall.camera.disable(true);
      await currentCall.join({ create: false, video: false });
      await currentCall.microphone.enable();
      setIsMuted(false);
      setStatus("joined");

      const currentCallId = callIdRef.current;
      const currentCallType = callTypeRef.current;

      if (currentCallId && currentCallType) {
        setAgentStatus("connecting");
        setAgentError(null);

        try {
          const authToken = await getTokenRef.current();
          const agentSession = await startVisionAgentSession({
            callId: currentCallId,
            callType: currentCallType,
            authToken,
          });

          agentSessionIdRef.current = agentSession.sessionId;
          setAgentStatus("connected");
        } catch (agentStartError) {
          setAgentStatus("failed");
          setAgentError(
            agentStartError instanceof Error
              ? agentStartError.message
              : "Unable to connect the AI teacher."
          );
        }
      }
    } catch (joinError) {
      setError(
        joinError instanceof Error
          ? joinError.message
          : "Unable to join the Stream audio call."
      );
      setStatus("error");
    }
  // All mutable values read from refs; getToken accessed via getTokenRef
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = useCallback(async () => {
    const currentCall = callRef.current;

    if (!currentCall || status !== "joined") {
      return;
    }

    try {
      if (isMuted) {
        await currentCall.microphone.enable();
        setIsMuted(false);
      } else {
        await currentCall.microphone.disable();
        setIsMuted(true);
      }
    } catch (muteError) {
      setError(
        muteError instanceof Error
          ? muteError.message
          : "Unable to update microphone state."
      );
      setStatus("error");
    }
  }, [isMuted, status]);

  const endCall = useCallback(async () => {
    const currentCall = callRef.current;
    const currentClient = clientRef.current;

    if (!currentCall && !currentClient) {
      setStatus("ended");
      return;
    }

    setError(null);

    try {
      await cleanupAgent();

      if (status === "joined") {
        await currentCall?.endCall();
      } else {
        await currentCall?.leave();
      }
    } catch {
      try {
        await currentCall?.leave();
      } catch {
        // The call can already be ended remotely.
      }
    } finally {
      await currentClient?.disconnectUser();
      callRef.current = null;
      clientRef.current = null;
      setIsMuted(false);
      callIdRef.current = null;
      setCallId(null);
      callTypeRef.current = null;
      setStatus("ended");
    }
  }, [cleanupAgent, status]);

  return {
    callId,
    agentError,
    agentStatus,
    displayName,
    error,
    isMuted,
    isSignedIn,
    joinCall,
    startCall,
    status,
    toggleMute,
    endCall,
  };
}

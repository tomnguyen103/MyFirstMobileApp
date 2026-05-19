import { useAuth, useUser } from "@clerk/expo";
// `import type` is erased at compile time — no runtime module evaluation.
// The SDK throws at load time when its native WebRTC module isn't in the build,
// so we never statically import values from it. See `requireStreamSDK` below.
import type {
  Call,
  CallClosedCaption,
  StreamVideoClient,
  User as StreamVideoUser,
} from "@stream-io/video-react-native-sdk";
import { Linking, NativeModules, PermissionsAndroid, Platform } from "react-native";
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

export type LiveCaptionSpeaker = "teacher" | "learner";

export type LiveCaption = {
  id: string;
  speaker: LiveCaptionSpeaker;
  speakerName: string;
  text: string;
  startedAt: string;
};

export type PartialCaption = {
  speaker: LiveCaptionSpeaker;
  speakerName: string;
  text: string;
};

// @stream-io/react-native-webrtc throws at module-load time when `NativeModules.WebRTCModule`
// is null — which happens when the dev build was compiled before the SDK was added.
// Guard all SDK usage behind this flag; the fix for users is `npx expo run:android`.
const IS_WEBRTC_AVAILABLE = NativeModules?.WebRTCModule != null;

const NEEDS_REBUILD_MSG =
  "Stream audio requires a native rebuild. Run `npx expo run:android` to enable audio calls.";
const AGENT_USER_ID = "language-teacher";
const MAX_LIVE_CAPTIONS = 1;

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
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<LiveCaption[]>([]);
  const [partialCaption, setPartialCaption] = useState<PartialCaption | null>(null);
  const [isCaptioning, setIsCaptioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(null);
  const callIdRef = useRef<string | null>(null);
  const callTypeRef = useRef<string | null>(null);
  const agentSessionIdRef = useRef<string | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<Call | null>(null);
  const unsubscribeCaptionsRef = useRef<(() => void) | null>(null);
  // Stable refs so callbacks never change identity when state does
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const statusRef = useRef<AudioCallStatus>(IS_WEBRTC_AVAILABLE ? "idle" : "error");
  statusRef.current = status;

  const displayName = useMemo(() => {
    if (!user) {
      return "Guest learner";
    }

    return user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Learner";
  }, [user]);

  const appendCaption = useCallback((caption: CallClosedCaption) => {
    const text = caption.text.trim();
    if (!text) return;

    const speakerId = caption.speaker_id || caption.user.id;
    const isTeacher = speakerId === AGENT_USER_ID;
    const captionId =
      caption.id || `${speakerId}-${caption.start_time}-${caption.text}`;

    setCaptions((currentCaptions) => {
      const nextCaption: LiveCaption = {
        id: captionId,
        speaker: isTeacher ? "teacher" : "learner",
        speakerName: isTeacher ? "AI Teacher" : caption.user.name || displayName,
        text,
        startedAt: caption.start_time,
      };

      const withoutDuplicate = currentCaptions.filter(
        (item) => item.id !== nextCaption.id
      );

      return [...withoutDuplicate, nextCaption].slice(-MAX_LIVE_CAPTIONS);
    });
  }, [displayName]);

  const resetCaptions = useCallback(() => {
    unsubscribeCaptionsRef.current?.();
    unsubscribeCaptionsRef.current = null;
    setCaptions([]);
    setPartialCaption(null);
    setCaptionError(null);
    setIsCaptioning(false);
  }, []);

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
    resetCaptions();

    callRef.current = null;
    clientRef.current = null;
    setStreamClient(null);
    setIsMuted(true);
    setIsListening(false);
    callIdRef.current = null;
    setCallId(null);
    callTypeRef.current = null;

    try {
      await currentCall?.stopClosedCaptions();
    } catch {
      // Captions may already be stopped when the call is being cleaned up.
    }

    try {
      await currentCall?.leave();
    } catch {
      // The SDK may already have left during an ended-call flow.
    }

    await currentClient?.disconnectUser();
  }, [cleanupAgent, resetCaptions]);

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
      setStreamClient(nextClient);
      setCallId(setup.callId);
      setAgentStatus("idle");
      setAgentError(null);
      resetCaptions();
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
    resetCaptions,
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
      if (Platform.OS === "android") {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );

        if (!alreadyGranted) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: "Microphone Permission",
              message:
                "The AI teacher needs your microphone to hear you during the lesson.",
              buttonPositive: "Allow",
              buttonNegative: "Deny",
            }
          );

          if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            setError(
              "Microphone access was permanently denied. Open Settings → Apps → MyFirstMobileApp → Permissions and enable Microphone."
            );
            setStatus("error");
            void Linking.openSettings();
            return;
          }

          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            setError(
              "Microphone permission is required. Please allow microphone access when prompted."
            );
            setStatus("error");
            return;
          }
        }
      }

      await currentCall.camera.disable(true);
      await currentCall.join({ create: true, video: false });
      currentCall.updateClosedCaptionSettings({
        maxVisibleCaptions: 0,
        visibilityDurationMs: 0,
      });
      unsubscribeCaptionsRef.current?.();
      const unsubscribeCaption = currentCall.on("call.closed_caption", (event) => {
        appendCaption(event.closed_caption);
      });
      const unsubscribeCaptionStarted = currentCall.on("call.closed_captions_started", () => {
        setIsCaptioning(true);
        setCaptionError(null);
      });
      const unsubscribeCaptionStopped = currentCall.on("call.closed_captions_stopped", () => {
        setIsCaptioning(false);
      });
      const unsubscribeCaptionFailed = currentCall.on("call.closed_captions_failed", () => {
        setIsCaptioning(false);
        setCaptionError("Live captions are unavailable for this call.");
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unsubscribeCustom = currentCall.on("custom", (event: any) => {
        const custom = event?.custom;
        if (custom?.kind !== "caption_delta") return;
        if (custom.mode === "final") {
          setPartialCaption(null);
          return;
        }
        const text: string = (custom.text ?? "").trim();
        if (!text) return;
        const isTeacher = custom.speaker === "teacher";
        setPartialCaption({
          speaker: isTeacher ? "teacher" : "learner",
          speakerName: isTeacher ? "AI Teacher" : displayName,
          text,
        });
      });
      unsubscribeCaptionsRef.current = () => {
        unsubscribeCaption();
        unsubscribeCaptionStarted();
        unsubscribeCaptionStopped();
        unsubscribeCaptionFailed();
        unsubscribeCustom();
      };

      // Enable mic once to register the WebRTC audio track, then immediately
      // mute so we start in push-to-talk mode (avoids echo from agent speech).
      try {
        await currentCall.microphone.enable();
        await currentCall.microphone.disable();
      } catch (micError) {
        setError(
          micError instanceof Error ? micError.message : "Unable to enable microphone."
        );
        setStatus("error");
        return;
      }
      setIsMuted(true);
      setIsListening(false);
      setStatus("joined");

      try {
        await currentCall.startClosedCaptions();
        setIsCaptioning(true);
        setCaptionError(null);
      } catch {
        setIsCaptioning(false);
        setCaptionError("Live captions are unavailable for this call.");
      }

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
  }, [appendCaption]);

  // Push-to-talk: hold to speak, release to mute.
  // Both callbacks are stable (read live state via refs).
  const startTalking = useCallback(async () => {
    const currentCall = callRef.current;
    if (!currentCall || statusRef.current !== "joined") return;

    try {
      await currentCall.microphone.enable();
      setIsMuted(false);
      setIsListening(true);
    } catch {
      // ignore — mic may briefly unavailable during transition
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopTalking = useCallback(async () => {
    const currentCall = callRef.current;
    if (!currentCall) return;

    try {
      await currentCall.microphone.disable();
      setIsMuted(true);
      setIsListening(false);
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      resetCaptions();

      if (status === "joined") {
        try {
          await currentCall?.stopClosedCaptions();
        } catch {
          // Captions may already be stopped when the call ends.
        }
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
      setStreamClient(null);
      setIsMuted(true);
      setIsListening(false);
      callIdRef.current = null;
      setCallId(null);
      callTypeRef.current = null;
      setStatus("ended");
    }
  }, [cleanupAgent, resetCaptions, status]);

  const startAndJoinCall = useCallback(async () => {
    await startCall();
    if (!callRef.current) return;
    await joinCall();
  // startCall and joinCall are stable useCallback refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCall, joinCall]);

  return {
    callId,
    captionError,
    captions,
    partialCaption,
    streamClient,
    agentError,
    agentStatus,
    displayName,
    error,
    isCaptioning,
    isListening,
    isMuted,
    isSignedIn,
    joinCall,
    startCall,
    startAndJoinCall,
    startTalking,
    stopTalking,
    status,
    endCall,
  };
}

import { verifyClerkJwt } from "../_clerk-auth";

type StartAgentBody = {
  callId?: string;
  callType?: string;
};

function getVisionAgentUrl(): string {
  const url = process.env.VISION_AGENT_URL;
  if (!url) {
    throw new Error("VISION_AGENT_URL environment variable is not set.");
  }
  return url;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StartAgentBody;
    const { callId, callType } = body;

    const authHeader = request.headers.get("Authorization");
    const userId = await verifyClerkJwt(authHeader);
    if (!userId) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!callId || !callType) {
      return Response.json({ error: "Missing agent session details." }, { status: 400 });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);

    let response: globalThis.Response;
    try {
      response = await fetch(
        `${getVisionAgentUrl()}/calls/${encodeURIComponent(callId)}/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: authHeader! },
          body: JSON.stringify({ call_type: callType }),
          signal: controller.signal,
        }
      );
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        return Response.json({ error: "Vision agent request timed out." }, { status: 504 });
      }
      throw err;
    }
    clearTimeout(timer);

    const data = (await response.json().catch(() => ({}))) as
      | { session_id?: string; call_id?: string; session_started_at?: string }
      | { detail?: string };

    if (!response.ok) {
      return Response.json(
        { error: "detail" in data ? data.detail : "Unable to start AI teacher." },
        { status: response.status }
      );
    }

    return Response.json({
      sessionId: "session_id" in data ? data.session_id : undefined,
      callId: "call_id" in data ? data.call_id : callId,
      startedAt: "session_started_at" in data ? data.session_started_at : undefined,
    });
  } catch (error) {
    console.error("Vision Agent start failed:", error);
    if (error instanceof Error && error.message.includes("VISION_AGENT_URL")) {
      return Response.json({ error: "Server misconfiguration: vision agent URL is not configured." }, { status: 500 });
    }
    return Response.json({ error: "Unable to start AI teacher." }, { status: 500 });
  }
}

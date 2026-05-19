import { verifyClerkJwt } from "../_clerk-auth";

type StopAgentBody = {
  callId?: string;
  sessionId?: string;
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
    const body = (await request.json()) as StopAgentBody;
    const { callId, sessionId } = body;

    const authHeader = request.headers.get("Authorization");
    const userId = await verifyClerkJwt(authHeader);
    if (!userId) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!callId || !sessionId) {
      return Response.json({ error: "Missing agent session details." }, { status: 400 });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);

    let response: globalThis.Response;
    try {
      response = await fetch(
        `${getVisionAgentUrl()}/calls/${encodeURIComponent(
          callId
        )}/sessions/${encodeURIComponent(sessionId)}`,
        { method: "DELETE", headers: { Authorization: authHeader! }, signal: controller.signal }
      );
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        return Response.json({ error: "Vision agent request timed out." }, { status: 504 });
      }
      throw err;
    }
    clearTimeout(timer);

    if (!response.ok && response.status !== 404) {
      const data = (await response.json().catch(() => ({}))) as { detail?: string };
      return Response.json(
        { error: data.detail ?? "Unable to stop AI teacher." },
        { status: response.status }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Vision Agent stop failed:", error);
    if (error instanceof Error && error.message.includes("VISION_AGENT_URL")) {
      return Response.json({ error: "Server misconfiguration: vision agent URL is not configured." }, { status: 500 });
    }
    return Response.json({ error: "Unable to stop AI teacher." }, { status: 500 });
  }
}

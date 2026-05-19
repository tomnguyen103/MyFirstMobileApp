type StopAgentBody = {
  callId?: string;
  sessionId?: string;
};

function getVisionAgentUrl() {
  return process.env.VISION_AGENT_URL ?? "http://127.0.0.1:8000";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StopAgentBody;
    const { callId, sessionId } = body;

    if (!request.headers.get("Authorization")) {
      return Response.json({ error: "Missing Clerk session token." }, { status: 401 });
    }

    if (!callId || !sessionId) {
      return Response.json({ error: "Missing agent session details." }, { status: 400 });
    }

    const response = await fetch(
      `${getVisionAgentUrl()}/calls/${encodeURIComponent(
        callId
      )}/sessions/${encodeURIComponent(sessionId)}`,
      { method: "DELETE" }
    );

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
    return Response.json({ error: "Unable to stop AI teacher." }, { status: 500 });
  }
}

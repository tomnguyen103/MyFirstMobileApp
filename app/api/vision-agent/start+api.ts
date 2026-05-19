type StartAgentBody = {
  callId?: string;
  callType?: string;
};

function getVisionAgentUrl() {
  return process.env.VISION_AGENT_URL ?? "http://127.0.0.1:8000";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StartAgentBody;
    const { callId, callType } = body;

    if (!request.headers.get("Authorization")) {
      return Response.json({ error: "Missing Clerk session token." }, { status: 401 });
    }

    if (!callId || !callType) {
      return Response.json({ error: "Missing agent session details." }, { status: 400 });
    }

    const response = await fetch(
      `${getVisionAgentUrl()}/calls/${encodeURIComponent(callId)}/sessions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_type: callType }),
      }
    );

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
    return Response.json({ error: "Unable to start AI teacher." }, { status: 500 });
  }
}

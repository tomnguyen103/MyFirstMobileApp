import { getLessonById } from "@/data/lessons";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { Phrase, VocabItem } from "@/types/learning";
import { verifyClerkJwt } from "../_clerk-auth";

const AGENT_USER_ID = "language-teacher";

type AudioCallBody = {
  lessonId?: string;
  languageId?: string;
  userName?: string;
  userImage?: string;
};

const callType = "default";
const streamVideoBaseUrl = "https://video.stream-io-api.com";
const streamChatBaseUrl = "https://chat.stream-io-api.com";

function base64UrlEncode(value: string | ArrayBuffer) {
  const bytes =
    typeof value === "string"
      ? new TextEncoder().encode(value)
      : new Uint8Array(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signJwt(payload: Record<string, unknown>, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );

  return `${data}.${base64UrlEncode(signature)}`;
}

async function streamApiFetch({
  apiKey,
  body,
  path,
  secret,
  url,
}: {
  apiKey: string;
  body: Record<string, unknown>;
  path: string;
  secret: string;
  url: string;
}) {
  const serverToken = await signJwt({ server: true }, secret);
  const response = await fetch(`${url}${path}?api_key=${apiKey}`, {
    method: "POST",
    headers: {
      Authorization: serverToken,
      "Content-Type": "application/json",
      "stream-auth-type": "jwt",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Stream API error ${response.status}: ${errorBody}`);
  }
}

function getLessonLanguage(lessonId: string, languageId: string) {
  const lesson = getLessonById(lessonId);
  const unit = lesson ? units.find((item) => item.id === lesson.unitId) : undefined;
  const language = languages.find((item) => item.id === languageId);

  if (!lesson || !unit || !language || unit.languageId !== language.id) {
    return undefined;
  }

  return { lesson, language };
}

function getLessonPhrases(lessonId: string): Phrase[] {
  const lesson = getLessonById(lessonId);
  const phraseActivity = lesson?.activities.find((activity) => activity.type === "phrase");

  if (phraseActivity?.type === "phrase") {
    return phraseActivity.items;
  }

  const vocabActivity = lesson?.activities.find(
    (activity) => activity.type === "vocabulary"
  );

  if (vocabActivity?.type !== "vocabulary") {
    return [];
  }

  return vocabActivity.items.map((item: VocabItem) => ({
    phrase: item.word,
    translation: item.translation,
    pronunciation: item.example,
  }));
}

function getLessonVocabulary(lessonId: string): VocabItem[] {
  const lesson = getLessonById(lessonId);
  const vocabActivity = lesson?.activities.find(
    (activity) => activity.type === "vocabulary"
  );

  return vocabActivity?.type === "vocabulary" ? vocabActivity.items : [];
}

function normalizeCallId(lessonId: string, userId: string) {
  return `lesson-${lessonId}-${userId}`
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 64);
}

export async function POST(request: Request) {
  try {
    const userId = await verifyClerkJwt(request.headers.get("Authorization"));
    if (!userId) {
      return Response.json({ error: "Missing or invalid Clerk session token." }, { status: 401 });
    }

    const body = (await request.json()) as AudioCallBody;
    const { lessonId, languageId, userName, userImage } = body;

    if (!lessonId || !languageId || !userName) {
      return Response.json({ error: "Missing call setup details." }, { status: 400 });
    }

    const lessonLanguage = getLessonLanguage(lessonId, languageId);

    if (!lessonLanguage) {
      return Response.json(
        { error: "Lesson and selected language do not match." },
        { status: 400 }
      );
    }

    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return Response.json(
        { error: "Stream credentials are not configured." },
        { status: 500 }
      );
    }

    const { lesson, language } = lessonLanguage;
    const callId = normalizeCallId(lesson.id, userId);
    const phrases = getLessonPhrases(lesson.id);

    await streamApiFetch({
      apiKey,
      secret: apiSecret,
      url: streamChatBaseUrl,
      path: "/api/v2/users",
      body: {
        users: {
          [userId]: {
            id: userId,
            name: userName,
            image: userImage,
          },
          [AGENT_USER_ID]: {
            id: AGENT_USER_ID,
            name: "AI Language Teacher",
          },
        },
      },
    });

    await streamApiFetch({
      apiKey,
      secret: apiSecret,
      url: streamVideoBaseUrl,
      path: `/api/v2/video/call/${callType}/${callId}`,
      body: {
        video: false,
        data: {
          created_by_id: userId,
          video: false,
          settings_override: {
            transcription: {
              mode: "available",
              closed_caption_mode: "available",
            },
          },
          members: [
            { user_id: userId, role: "user" },
            { user_id: AGENT_USER_ID, role: "host" },
          ],
          custom: {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonDescription: lesson.description,
            lessonXpReward: lesson.xpReward,
            languageId: language.id,
            languageName: language.name,
            goals: lesson.goals,
            vocabulary: getLessonVocabulary(lesson.id),
            phrases,
            aiTeacherPrompt: lesson.aiTeacherPrompt,
          },
        },
      },
    });

    const now = Math.floor(Date.now() / 1000);
    const token = await signJwt({
      user_id: userId,
      call_cids: [`${callType}:${callId}`],
      role: "admin",
      iat: now,
      exp: now + 60 * 60,
    }, apiSecret);

    return Response.json({
      apiKey,
      token,
      callId,
      callType,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
    });
  } catch (error) {
    console.error("Stream audio call setup failed:", error);
    return Response.json({ error: "Unable to create Stream audio call." }, { status: 500 });
  }
}

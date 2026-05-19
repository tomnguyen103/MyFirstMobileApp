import asyncio
import logging
import time
from pathlib import Path
from typing import Any, cast

from dotenv import load_dotenv
from openai import RateLimitError, AuthenticationError
from vision_agents.core import Agent, AgentLauncher, User, Runner
from vision_agents.core.instructions import Instructions
from vision_agents.core.llm.events import (
    RealtimeUserSpeechTranscriptionEvent,
    RealtimeAgentSpeechTranscriptionEvent,
)
from vision_agents.plugins import getstream, openai
from vision_agents.plugins.getstream import Edge as StreamEdge

logger = logging.getLogger(__name__)

_HERE = Path(__file__).resolve().parent
# Load Stream keys from the parent app, then local .env for OPENAI_API_KEY
load_dotenv(_HERE.parent / ".env")
load_dotenv(_HERE / ".env")

SYSTEM_PROMPT = """
You are a warm, energetic AI language teacher running a real-time voice lesson. Follow this exact interaction loop for every item:

1. Say the target-language word or phrase, then immediately give its English translation.
2. Ask the student to repeat it — one short sentence like "Can you say that back to me?"
3. STOP. Your turn is over. Do not say anything else. Wait for the student to speak.
4. When the student responds, react to exactly what they said:
   - Correct or close enough: celebrate in one short sentence, then move to the next item.
   - Wrong or hesitant: gently correct in one sentence and ask them to try the same item again.
5. Only move to the next vocabulary word or phrase after the student has practiced the current one.

Rules:
- Every response is ONE or TWO sentences maximum — no exceptions, no monologues.
- Always end your turn with a question or a direct prompt for the student to speak.
- Speak almost entirely in English — only use the target language for the lesson's own words and phrases.
- Stay strictly within this lesson's vocabulary and goals. Never introduce outside topics or new words.
- Sound natural and warm: use contractions like "let's", "you're", "I'll", "it's", "that's".
"""


def _list_text(items: list[dict[str, Any]], key: str) -> str:
    values = [str(item.get(key, "")).strip() for item in items if item.get(key)]
    return ", ".join(values) if values else "None provided"


def build_lesson_context(custom: dict[str, Any]) -> str:
    language = custom.get("languageName") or "the target language"
    lesson_title = custom.get("lessonTitle") or "Audio lesson"
    lesson_description = custom.get("lessonDescription") or ""
    goals = custom.get("goals") if isinstance(custom.get("goals"), list) else []
    vocabulary = (
        custom.get("vocabulary") if isinstance(custom.get("vocabulary"), list) else []
    )
    phrases = custom.get("phrases") if isinstance(custom.get("phrases"), list) else []
    ai_teacher_prompt = (
        custom.get("aiTeacherPrompt")
        if isinstance(custom.get("aiTeacherPrompt"), dict)
        else {}
    )

    goal_text = _list_text(goals, "description")
    vocabulary_text = _list_text(vocabulary, "word")
    phrase_text = _list_text(phrases, "phrase")

    return f"""
Lesson context from the Stream call:
- Language: {language}
- Lesson: {lesson_title}
- Description: {lesson_description}
- Goals: {goal_text}
- Vocabulary: {vocabulary_text}
- Phrases: {phrase_text}
- Intro to adapt: {ai_teacher_prompt.get("intro", "")}
- Teaching instructions: {ai_teacher_prompt.get("instructions", "")}
- Encouragement style: {ai_teacher_prompt.get("encouragement", "")}

Use this exact lesson context. Teach the vocabulary and phrases above, ask the student to repeat them, and keep the session interactive.
""".strip()


def build_agent_instructions(
    language: str = "Spanish", lesson_context: str | None = None
) -> str:
    instructions = (
        SYSTEM_PROMPT.strip()
        + f"\n\nToday's lesson language: {language}. Teach {language} through English."
    )

    if lesson_context:
        instructions += (
            "\n\n"
            + lesson_context
            + "\n\nAlways teach through English while helping the student practice the target language."
        )

    return instructions


async def create_agent(language: str = "Spanish", **kwargs) -> Agent:
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="AI Language Teacher", id="language-teacher"),
        instructions=build_agent_instructions(language),
        llm=openai.Realtime(model="gpt-realtime-2", voice="marin"),
    )


async def join_call(
    agent: Agent, call_type: str, call_id: str, **kwargs
) -> None:
    call = await agent.create_call(call_type, call_id)
    await call.get()
    custom = call.custom_data or {}
    language = custom.get("languageName") or "Spanish"
    logger.info("Agent starting lesson: language=%s, lessonId=%s", language, custom.get("lessonId"))
    lesson_context = build_lesson_context(custom)

    updated_instructions = build_agent_instructions(language=language, lesson_context=lesson_context)
    agent.instructions = Instructions(input_text=updated_instructions)
    agent.llm.set_instructions(agent.instructions)

    _END_PHRASES = frozenset((
        "goodbye", "bye", "end lesson", "stop lesson",
        "i'm done", "im done", "that's all", "thats all",
    ))

    edge = cast(StreamEdge, agent.edge)
    # Per-speaker timestamp for 150 ms throttle (Stream custom events are rate-limited)
    _last_sent_at: dict[str, float] = {}

    async def _emit_caption(speaker: str, text: str, mode: str) -> None:
        now = time.monotonic()
        if mode != "final":
            if now - _last_sent_at.get(speaker, 0.0) < 0.15:
                return
        _last_sent_at[speaker] = now
        try:
            await edge.send_custom_event(
                {"kind": "caption_delta", "speaker": speaker, "text": text, "mode": mode}
            )
        except Exception as exc:
            logger.debug("caption_delta send failed: %s", exc)

    try:
        async with agent.join(call):
            # Queue final speech transcriptions so we can react to each student turn.
            transcript_queue: asyncio.Queue[str] = asyncio.Queue()

            async def _on_user_speech(event: RealtimeUserSpeechTranscriptionEvent):
                text = (event.text or "").strip()
                if event.mode == "final":
                    if text:
                        await transcript_queue.put(text)
                    # Signal client to clear partial caption for this speaker
                    await _emit_caption("learner", "", "final")
                elif event.mode == "replacement" and text:
                    await _emit_caption("learner", text, "replacement")

            async def _on_agent_speech(event: RealtimeAgentSpeechTranscriptionEvent):
                text = (event.text or "").strip()
                if event.mode == "final":
                    await _emit_caption("teacher", "", "final")
                elif event.mode == "replacement" and text:
                    await _emit_caption("teacher", text, "replacement")

            agent.subscribe(_on_user_speech)
            agent.subscribe(_on_agent_speech)

            await agent.simple_response(
                "Warmly greet the student, introduce yourself as their language teacher in one short sentence, "
                "name today's lesson topic and target language, then immediately introduce the very first vocabulary word "
                "with its English translation and ask the student to repeat it — keep it to two sentences total."
            )

            while not agent.closed:
                try:
                    user_input = await asyncio.wait_for(
                        transcript_queue.get(), timeout=5.0
                    )
                except asyncio.TimeoutError:
                    continue

                if any(phrase in user_input.lower() for phrase in _END_PHRASES):
                    await agent.simple_response(
                        "The student is done. In two warm sentences, summarise what was "
                        "covered today, praise their effort, and say goodbye."
                    )
                    break

                # React to what the student actually said, then prompt the next turn.
                await agent.simple_response(
                    f"The student just said: \"{user_input}\". "
                    "React in one or two sentences: if they repeated the word correctly, "
                    "praise them briefly and introduce the next vocabulary word or phrase "
                    "from the lesson with its translation, then ask them to say it. "
                    "If they made a mistake or hesitated, gently correct them and ask "
                    "them to try the current item one more time. "
                    "Always end by asking the student to say something."
                )

            await agent.finish()
    except RateLimitError as e:
        logger.error(
            "OpenAI quota exceeded — add credits at https://platform.openai.com/billing. "
            "Error: %s",
            e,
        )
    except AuthenticationError as e:
        logger.error("OpenAI API key is invalid or missing. Error: %s", e)
    except Exception as e:
        logger.error("Agent session failed: %s", e, exc_info=True)


if __name__ == "__main__":
    Runner(AgentLauncher(create_agent=create_agent, join_call=join_call)).cli()

from dotenv import load_dotenv
from typing import Any
import logging
from openai import RateLimitError, AuthenticationError
from vision_agents.core import Agent, AgentLauncher, User, Runner
from vision_agents.plugins import getstream, openai

logger = logging.getLogger(__name__)

# Load Stream keys from the parent app, then local .env for OPENAI_API_KEY
load_dotenv("../.env")
load_dotenv()

SYSTEM_PROMPT = """
You are an enthusiastic and encouraging AI language teacher. You always speak English.
Your job is to teach the user their chosen target language through English instruction.

Teaching style:
- Start by warmly greeting the student and asking their current level
- Introduce vocabulary with example sentences
- Ask the student to repeat or use words in context
- Correct pronunciation and mistakes gently
- Keep lessons short, fun, and interactive
- Use encouragement often

You never switch away from English as your base language of instruction.
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


async def create_agent(language: str = "Spanish", **kwargs) -> Agent:
    instructions = (
        SYSTEM_PROMPT.strip()
        + f"\n\nToday's lesson language: {language}. Teach {language} through English."
    )
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="AI Language Teacher", id="language-teacher"),
        instructions=instructions,
        llm=openai.Realtime(model="gpt-realtime-2", voice="marin"),
    )


async def join_call(
    agent: Agent, call_type: str, call_id: str, **kwargs
) -> None:
    call = await agent.create_call(call_type, call_id)
    await call.get()
    lesson_context = build_lesson_context(call.custom_data or {})

    agent.instructions.input_text = (
        SYSTEM_PROMPT.strip()
        + "\n\n"
        + lesson_context
        + "\n\nAlways teach through English while helping the student practice the target language."
    )
    agent.instructions.full_reference = agent.instructions.input_text

    try:
        async with agent.join(call):
            await agent.simple_response(
                "Greet the student warmly, introduce yourself as their AI language teacher, "
                "name today's lesson and target language, then start with the first phrase or vocabulary word."
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

import logging
from django.conf import settings
from django.http import HttpRequest
from google import genai
from google.genai import types
from ninja import Router, Schema
from ninja.errors import HttpError

from api.auth import AuthBearer

logger = logging.getLogger(__name__)

router = Router()


class GenerateTitleSchema(Schema):
    content: str


@router.post("/generate-title", auth=AuthBearer())
def generate_title(request: HttpRequest, payload: GenerateTitleSchema):
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise HttpError(503, "AI service not configured")

    content = payload.content
    if not content or len(content.strip()) < 10:
        raise HttpError(400, "Content too short")

    client = genai.Client(api_key=api_key)

    prompt = f"""
    Generate a concise, engaging, and relevant title for the following content.
    The title should be catchy but not clickbait.
    Maximum length: 15 words.
    Return ONLY the title text, nothing else. Do not use quotes.

    Content:
    {content}
    """

    try:
        # Using 4B model as it provides a good balance of speed and quality for summarization tasks
        response = client.models.generate_content(
            model="gemma-3-4b-it",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
            ),
        )

        title = response.text
        if not title:
            raise HttpError(500, "Failed to generate title")

        # Cleanup
        title = title.strip().strip('"').strip("'")

        return {"title": title}

    except Exception as e:
        logger.error(f"Error generating title: {e}")
        # In production, don't expose exception details
        raise HttpError(500, "Internal server error during title generation")

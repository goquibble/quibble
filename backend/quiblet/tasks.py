import json
import logging
import re

from celery import shared_task
from django.conf import settings
from django.core.cache import cache
from google import genai
from google.genai import types

from quiblet.models import Quib

logger = logging.getLogger(__name__)


@shared_task
def moderate_quib(quib_id: str):
    try:
        quib = Quib.objects.get(id=quib_id)
        if quib.status != Quib.Status.PENDING:
            return f"Quib {quib_id} is not pending (status: {quib.status})."

        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.warning("GEMINI_API_KEY not set. Auto-approving quib %s", quib_id)
            quib.status = Quib.Status.APPROVED
            quib.save()
            _invalidate_cache(quib)
            return f"Quib {quib_id} auto-approved (no API key)."

        client = genai.Client(api_key=api_key)

        prompt = f"""
        You are a content moderator. Analyze the following user-generated content for safety.
        Determine if it violates common safety guidelines (hate speech, explicit violence, illegal content, harassment, etc.).
        
        Title: {quib.title}
        Content: {quib.content or ""}
        
        Strictly respond with a valid JSON object only. Do not add any markdown formatting or extra text.
        Format:
        {{
            "is_safe": true/false,
            "reason": "explanation here"
        }}
        """

        try:
            # Using Gemma model with manual parsing since it doesn't support response_schema
            response = client.models.generate_content(
                model="gemma-3-4b-it",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,  # Lower temperature for more deterministic output
                ),
            )

            text_content = response.text
            if not text_content:
                raise ValueError("Empty response from Gemma")

            # Clean up potential markdown code blocks (```json ... ```)
            cleaned_text = re.sub(r"```json\s*|\s*```", "", text_content).strip()

            try:
                result = json.loads(cleaned_text)
                is_safe = result.get("is_safe", False)
                reason = result.get("reason", "No reason provided")
            except json.JSONDecodeError:
                # Fallback: if JSON parsing fails, assume unsafe or retry
                logger.error("Failed to parse JSON from Gemma: %s", text_content)
                # Let's reject to be safe if AI output is malformed
                is_safe = False
                reason = "AI output malformed"

            if is_safe:
                quib.status = Quib.Status.APPROVED
                action = "approved"
            else:
                quib.status = Quib.Status.REJECTED
                logger.info("Quib %s rejected: %s", quib_id, reason)
                action = f"rejected ({reason})"

            quib.save()
            _invalidate_cache(quib)
            return f"Quib {quib_id} {action} by AI."

        except Exception as e:
            logger.error("Error during AI moderation for quib %s: %s", quib_id, e)
            raise e

    except Quib.DoesNotExist:
        return f"Quib {quib_id} not found."


def _invalidate_cache(quib: Quib):
    cache_key = f"quiblet:{quib.quiblet.name}:quib:{quib.id}:{quib.slug}"
    cache.delete(cache_key)

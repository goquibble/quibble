from celery import shared_task
from quiblet.models import Quib
from .services import generate_embedding
from .models import QuibEmbedding


@shared_task
def generate_quib_embedding_task(quib_id):
    try:
        quib = Quib.objects.get(id=quib_id)

        # Combine title and content for better context
        text_to_embed = f"{quib.title} {quib.content or ''}".strip()

        if text_to_embed:
            embedding_vector = generate_embedding(text_to_embed)
            # Update or create the embedding
            QuibEmbedding.objects.update_or_create(
                quib=quib, defaults={"embedding": embedding_vector}
            )

            return f"Embedding generated for Quib {quib_id}"
        return f"No content to embed for Quib {quib_id}"

    except Quib.DoesNotExist:
        return f"Quib {quib_id} not found"

from fastembed import TextEmbedding
from functools import lru_cache


@lru_cache(maxsize=1)
def get_embedding_model():
    # Lazy load the model only when this function is called
    return TextEmbedding("sentence-transformers/all-MiniLM-L6-v2")


def generate_embedding(text):
    if not text:
        return None
    model = get_embedding_model()
    # fastembed returns a generator; get the first (and only) result
    embeddings = list(model.embed([text]))[0]
    return embeddings.tolist()

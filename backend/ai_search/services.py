from sentence_transformers import SentenceTransformer
from functools import lru_cache


@lru_cache(maxsize=1)
def get_embedding_model():
    # Lazy load the model only when this function is called
    return SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text):
    if not text:
        return None
    model = get_embedding_model()
    # Normalize embeddings for cosine similarity
    embeddings = model.encode(text, normalize_embeddings=True)
    return embeddings.tolist()

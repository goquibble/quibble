from django.db import models
from pgvector.django import VectorField
from quiblet.models import Quib


class QuibEmbedding(models.Model):
    embedding = VectorField(dimensions=384)  # all-MiniLM-L6-v2 output dimension
    quib = models.OneToOneField(
        Quib, on_delete=models.CASCADE, related_name="embedding"
    )

    def __str__(self):
        return f"Embedding for {self.quib.title}"

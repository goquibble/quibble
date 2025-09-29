from django.shortcuts import get_object_or_404
from django.http import HttpRequest
from ninja import Router

from api.schemas.quib import QuibSchema
from quib.models import Quib

router = Router()


@router.get("/", response=QuibSchema)
def get_quib(request: HttpRequest, id: str, slug: str):
    _ = request
    quib = get_object_or_404(Quib, id=id, slug=slug)
    return quib

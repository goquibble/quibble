from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import Router

from api.schemas.quiblet import QuibletSchema
from api.shared.schemas import UniqueNameResponseSchema
from quiblet.models import Quiblet

router = Router()


@router.get("/", response=QuibletSchema)
def get_quiblet(request: HttpRequest, name: str):
    _ = request
    quiblet = get_object_or_404(Quiblet, name=name)
    return quiblet


@router.get("/is-unique-name", response=UniqueNameResponseSchema)
def is_unique_name(request: HttpRequest, name: str):
    _ = request
    exists = Quiblet.objects.filter(name=name).exists()
    return {"unique": not exists}

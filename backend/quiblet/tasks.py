from celery import shared_task
from quiblet.models import Quib


@shared_task
def moderate_quib(quib_id: str):
    try:
        quib = Quib.objects.get(id=quib_id)
        if quib.status == Quib.Status.PENDING:
            # AI moderation logic here
            quib.status = Quib.Status.APPROVED
            quib.save()
            return f"Quib {quib_id} approved."
        return f"Quib {quib_id} is not pending (status: {quib.status})."
    except Quib.DoesNotExist:
        return f"Quib {quib_id} not found."

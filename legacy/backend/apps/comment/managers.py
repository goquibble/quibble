from django.db.models import Count, F
from django_ltree.managers import TreeManager


class CommentManager(TreeManager):
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .annotate(
                upvotes_count=Count("upvotes", distinct=True),
                downvotes_count=Count("downvotes", distinct=True),
                ratio=F("upvotes_count") - F("downvotes_count"),
            )
        )

    def soft_delete(self, instance):
        # if no children- hard delete
        if instance.children_count == 0:
            instance.delete()
        # else- soft delete
        else:
            instance.deleted = True
            instance.content = "[deleted]"
            instance.quibbler = None
            instance.save()

    def clean_up_soft_deleted(self):
        # cleanup all comment instances with no children
        for comment in self.filter(deleted=True):
            if comment.children_count == 0:
                comment.delete()

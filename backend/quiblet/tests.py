from django.db import DataError, IntegrityError
from django.test import TestCase

from quiblet.models import Quiblet
from uuid import uuid4


class QuibletModelTestCase(TestCase):
    def test_quiblet_creation(self):
        user_id1 = uuid4()
        user_id2 = uuid4()

        quiblet = Quiblet.objects.create(
            name="TestQuiblet",
            description="desc",
        )

        quiblet.members.create(member_id=user_id1)
        quiblet.members.create(member_id=user_id2, is_moderator=True)

        self.assertEqual(quiblet.name, "TestQuiblet")
        self.assertEqual(quiblet.__str__(), "q/TestQuiblet")
        self.assertTrue(quiblet.members.filter(member_id=user_id1).exists())
        self.assertTrue(
            quiblet.members.filter(member_id=user_id2, is_moderator=True).exists()
        )

    def test_quiblet_unique_name_case_insensitive(self):
        Quiblet.objects.create(name="UniqueName", description="desc")

        with self.assertRaises(IntegrityError):
            Quiblet.objects.create(name="uniquename", description="desc")

    def test_quiblet_max_length(self):
        with self.assertRaises(DataError):
            Quiblet.objects.create(
                name="Q" * 26,  # exceed max-length of 25
                description="desc",
            )

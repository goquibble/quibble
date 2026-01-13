from django.db import DataError, IntegrityError
from django.test import TestCase

from quiblet.models import Quiblet
from user.models import CustomUser, Profile


class QuibletModelTestCase(TestCase):
    def test_quiblet_creation(self):
        user = CustomUser.objects.create(email="test@test.com", password="test")
        user_p1 = Profile.objects.create(user=user, username="user1")
        user_p2 = Profile.objects.create(user=user, username="user2")

        quiblet = Quiblet.objects.create(
            name="TestQuiblet",
            description="desc",
        )

        quiblet.members.create(member=user_p1)
        quiblet.members.create(member=user_p2, is_moderator=True)

        self.assertEqual(quiblet.name, "TestQuiblet")
        self.assertEqual(quiblet.__str__(), "q/TestQuiblet")
        self.assertTrue(quiblet.members.filter(member=user_p1).exists())
        self.assertTrue(
            quiblet.members.filter(member=user_p2, is_moderator=True).exists()
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

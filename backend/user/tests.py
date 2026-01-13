from typing import cast
from django.test import TestCase
from django.contrib.auth import get_user_model

from user.managers import CustomUserManager


def get_user_manager():
    """Helper function to get typed UserManager"""
    user_manager = cast(CustomUserManager, get_user_model().objects)
    return user_manager


class UserModelTestCase(TestCase):
    """Test cases for CustomUser model"""

    def test_create_user(self):
        user_manager = get_user_manager()
        user = user_manager.create_user(email="user@user.com", password="user")
        # run checks
        self.assertEqual(user.email, "user@user.com")
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_super_user(self):
        user_manager = get_user_manager()
        admin_user = user_manager.create_superuser(
            email="admin@admin.com", password="admin"
        )
        # run checks
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

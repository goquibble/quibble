import pytest
from apps.user.models import Profile


@pytest.mark.django_db
class TestMe:
    api_url = "/api/v1/users/me/profiles/"

    def get_api_url_with_id(self, id):
        return f"{self.api_url}{id}/"

    def test_get_me_profiles(self, auth_api_client):
        response = auth_api_client.get(self.api_url)

        assert response.status_code == 200
        data = response.data
        assert len(data) == 1

    def test_post_me_profile(self, auth_api_client, user):
        payload = dict(username="test_profile")

        response = auth_api_client.post(self.api_url, payload, format="json")

        assert response.status_code == 201
        data = response.data
        assert data["username"] == payload["username"]
        assert data["user"]["email"] == user.email

    def test_retrieve_me_profile(self, auth_api_client, user_profile):
        url = self.get_api_url_with_id(user_profile.id)
        response = auth_api_client.get(url)

        assert response.status_code == 200
        data = response.data
        assert data["username"] == user_profile.username
        assert data["user"]["email"] == user_profile.user.email

    def test_patch_me_profile(self, auth_api_client, user_profile):
        url = self.get_api_url_with_id(user_profile.id)
        payload = dict(username="new_username")

        response = auth_api_client.patch(url, payload, format="json")
        user_profile.refresh_from_db()

        assert response.status_code == 200
        data = response.data
        assert data["username"] == user_profile.username
        assert data["username"] == payload["username"]

    def test_delete_me_profile(self, auth_api_client, user_profile):
        url = self.get_api_url_with_id(user_profile.id)

        response = auth_api_client.delete(url)

        assert response.status_code == 204
        with pytest.raises(Profile.DoesNotExist):
            user_profile.refresh_from_db()

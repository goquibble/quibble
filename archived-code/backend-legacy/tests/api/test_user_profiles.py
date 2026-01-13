import pytest


@pytest.mark.django_db
class TestProfiles:
    api_endpoint = "/api/v1/users/profiles/"

    def get_api_endpoint_with_id(self, id):
        return f"{self.api_endpoint}{id}/"

    def test_get_profiles(self, api_client):
        response = api_client.get(self.api_endpoint)

        assert response.status_code == 200
        data = response.data
        assert isinstance(data, list)

    def test_retrieve_profile(self, auth_api_client, user_profile):
        url = self.get_api_endpoint_with_id(user_profile.id)

        response = auth_api_client.get(url)

        assert response.status_code == 200
        data = response.data
        assert len(data) >= 1

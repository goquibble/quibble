from allauth.socialaccount.providers.oauth2.client import OAuth2Client


class CustomOAuth2Client(OAuth2Client):
    """
    Custom OAuth2Client with hotfix to incompatibility issue with new django-allauth
    issue: https://github.com/iMerica/dj-rest-auth/issues/673
    """

    def __init__(
        self,
        request,
        consumer_key,
        consumer_secret,
        access_token_method,
        access_token_url,
        callback_url,
        _scope,  # fix
        scope_delimiter=" ",
        headers=None,
        basic_auth=False,
    ):
        super().__init__(
            request,
            consumer_key,
            consumer_secret,
            access_token_method,
            access_token_url,
            callback_url,
            scope_delimiter,
            headers,
            basic_auth,
        )

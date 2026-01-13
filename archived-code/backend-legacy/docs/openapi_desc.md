Welcome to the **QuibbleAPI Documentation**!\
This API powers the **Quibble** platform, enabling seamless interaction between the backend and your frontend or mobile applications.

The API is built using **Django REST Framework** and provides a robust, secure, and scalable solution for managing user accounts, profiles, and related features.\
Use this documentation as a reference for all available endpoints, their parameters, and expected responses.

## Authentication

All endpoints (unless specified otherwise) require authentication to ensure secure access to user-specific resources.\
Quibble uses **token-based authentication** powered by DRF.

### How it works:

1. **Obtain Token**: Users authenticate by providing valid credentials (e.g., email and password) to receive an access token.
2. **Include Token in Requests**: Include the received token in the `Authorization` header of subsequent API requests:
   ```
   Authorization: Bearer <your_token>
   ```
3. **Profile Context**: For endpoints requiring a specific profile context, send the `profile_id` in the request headers:
   ```
   Profile-ID: <your_profile_id>
   ```

Ensure the token and profile ID are securely stored on the client-side to maintain session integrity.\
For additional details on authentication, refer to the specific endpoint documentation.

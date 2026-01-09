# Spotify Authorise
A small companion service for completing Spotify Web API authorisation for applications that cannot support a web-based login.

This service runs the standard Spotify OAuth flow and forwards the result back to the requesting application.

This service is intended to be used as part of an application that needs Spotify authorisation but cannot directly handle a browser-based login by allowing a supported device (such as a mobile phone) to authenticate on its behalf and return the resulting tokens to the original application.

## Usage
### Setup
1. Create a Spotify application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add `https://chickpeaplane.github.io/Spotify-Authorise/callback` as a Redirect URI.
3. Use the endpoint as mentioned below.

### Endpoint: GET https://chickpeaplane.github.io/Spotify-Authorise
Name | Required | Description
---|---|---
client_id|Yes|Spotify application Client ID.
scope|Yes|Space-separated list of Spotify scopes.
returnTo|Yes|Base URL or IP address where the authorisation result should be sent.

### Return: POST to returnTo
After successful authorisation, this service sends the token response to returnTo via HTTP POST.
Name | Required | Description
---|---|---
access_token|Yes|Spotify access token.
token_type|Yes|Spotify token type. Should always be "Bearer".
scope|Yes|A space-separated list of Spotify scopes actually given.
expires_in|Yes|Seconds until the token expires.
refresh_token|Yes|Spotify refresh token.

## Notes
 - Uses Spotify's official OAuth authorisation flow
 - Does not bypass or alter Spotify authentication
 - Secure token handling is the responsibility of the application

## License
[AGPL-3.0](LICENSE)
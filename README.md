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
useFragments|No|If set, the service redirects the user to `returnTo` with the response encoded as URL fragments. Otherwise, the response is sent via POST.

### Return: `returnTo`
After successful authorisation, this service returns the token response to `returnTo` using one of the following methods:
 - **POST (default)** - Tokens are sent in the request body
 - **GET with fragments** - If `useFragments` is set, the user is redirected to `returnTo` with the response encoded as URL fragments

Name | Required | Description
---|---|---
access_token|Yes|Spotify access token.
token_type|Yes|Spotify token type. Should always be "Bearer".
scope|Yes|A space-separated list of Spotify scopes actually given.
expires_in|Yes|Seconds until the token expires.
refresh_token|Yes|Spotify refresh token.

## Examples
### POST (Default)
The system should send a GET request to the endpoint, with the appropriate data.
```
https://chickpeaplane.github.io/Spotify-Authorise
    ?client_id=abc123
    &scope=user-read-playback-state%20user-modify-playback-state
    &returnTo=http://192.168.1.50:8080
```
After successful authorisation, the service sends a POST request to `https://192.168.1.50:8080` with the token data in the request body.

### GET (Fragment-based)
```
https://chickpeaplane.github.io/Spotify-Authorise
    ?client_id=abc123
    &scope=user-read-playback-state
    &returnTo=http://192.168.1.50:8080
    &useFragments=true
```
After successful authorisation, the user is redirected to:
```
http://192.168.1.50:8080/callback
    #access_token=...
    &token_type=...
    &scope=...
    &expires_in=...
    &refresh_token=...
```

## About useFragments
When enabled, useFragments returns the authorisation result using URL fragments instead of a POST request.

This can be useful for local or embedded applications where:
 - HTTPS is not available on the receiving endpoint
 - Browser mixed-content restrictions prevent HTTPS pages from making HTTP requests
 - A simple redirect-based handoff is preferred

Fragments are handled entirely by the browser and are not included in HTTP requests or logs. It is then up to the original application to retrieve the token data.

## Limitations
 - The receiving application must be reachable by the user’s browser.
 - This service does not manage or store tokens beyond the initial handoff.
 - HTTPS is not provided for local endpoints; applications are responsible for securing tokens after receipt.
 - Intended for interactive, user-initiated authorization flows only.

## Notes
 - Uses Spotify's official OAuth authorisation flow
 - Does not bypass or alter Spotify authentication
 - Secure token handling is the responsibility of the application

## License
[AGPL-3.0](LICENSE)
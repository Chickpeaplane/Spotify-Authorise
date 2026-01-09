async function main() {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const returnedState = params.get("state");

    const verifier = sessionStorage.getItem("verifier");
    const expectedState = sessionStorage.getItem("state");
    const returnAddress = sessionStorage.getItem("returnAddress");
    const clientId = sessionStorage.getItem("client_id");

    if (!code || !verifier || !returnAddress || !port || !clientId) {
        document.body.innerHTML = "<h2>Authorization failed</h2>";
        return;
    }

    if (returnedState !== expectedState) {
        document.body.innerHTML = "<h2>State mismatch</h2>";
        return;
    }

    const redirectUri =
        "https://chickpeaplane.github.io/Spotify-Authorise/callback";

    const tokenResp = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                code_verifier: verifier
            })
        }
    );

    const token = await tokenResp.json();

    await fetch(`${returnAddress}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            expires_in: token.expires_in,
            scope: token.scope
        })
    });

    document.body.innerHTML += "<p>Token sent to device.</p>";
}

main();
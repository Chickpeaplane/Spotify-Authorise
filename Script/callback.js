async function main() {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const returnedState = params.get("state");

    const verifier = sessionStorage.getItem("verifier");
    const expectedState = sessionStorage.getItem("state");
    const returnAddress = sessionStorage.getItem("returnAddress");
    const clientId = sessionStorage.getItem("client_id");
    const useFragments = sessionStorage.getItem("useFragments");
    sessionStorage.clear();

    if (!code || !verifier || !returnAddress || !clientId) {
        document.getElementById("statusLabel").textContent = "Authorisation failed";
        return;
    }

    if (returnedState !== expectedState) {
        document.getElementById("statusLabel").textContent = "State mismatch";
        return;
    }

    const redirectUri = "https://chickpeaplane.github.io/Spotify-Authorise/callback";

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

    if (useFragments) {
        const fragment =
            `#access_token=${token.access_token}` +
            `&toekn_type=${token.token_type}` +
            `&scope=${encodeURIComponent(token.scope)}` +
            `&expires_in=${token.expires_in}` +
            `&refresh_token=${token.refresh_token}`;

        window.location.href = returnTo + fragment;
    } 
    else {
        await fetch(`${returnAddress}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                access_token: token.access_token,
                token_type: token.token_type,
                scope: token.scope,
                expires_in: token.expires_in,
                refresh_token: token.refresh_token
            })
        });
    }

    document.body.innerHTML += "<p>Token sent to device.</p>";
}

main();
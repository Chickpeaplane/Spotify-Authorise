const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

async function main() {
    const params = new URLSearchParams(location.search);

    const clientId = params.get("client_id");
    const scope = params.get("scope");
    let returnAddress = params.get("returnTo");
    const useFragments = params.get("useFragments");

    if (!clientId || !scope || !returnAddress) {
        document.getElementById("statusLabel").textContent = "Error: missing parameters";
        return;
    }

    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
    const state = generateRandomString(16);

    sessionStorage.setItem("verifier", codeVerifier);
    sessionStorage.setItem("state", state);
    sessionStorage.setItem("returnAddress", returnAddress);
    sessionStorage.setItem("client_id", clientId);
    sessionStorage.setItem("scope", scope);
    if (useFragments) sessionStorage.setItem("useFragments", useFragments);

    const redirectUri =
        "https://chickpeaplane.github.io/Spotify-Authorise/callback";

    const authUrl =
        "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: clientId,
            scope,
            redirect_uri: redirectUri,
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            state
        });

    location.href = authUrl;
}

main();
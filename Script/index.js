function randomString(len = 64) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(len)))
        .map(x => chars[x % chars.length]).join("");
}

async function sha256(str) {
    const data = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", data);
}

function base64url(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function main() {
    const params = new URLSearchParams(location.search);

    const clientId = params.get("client_id");
    const scope = params.get("scope");
    let returnAddress = params.get("returnTo");

    if (!clientId || !scope || !returnAddress) {
        document.body.innerHTML = "<h2>Missing parameters</h2>";
        return;
    }

    const verifier = randomString();
    const challenge = base64url(await sha256(verifier));
    const state = randomString(16);

    sessionStorage.setItem("verifier", verifier);
    sessionStorage.setItem("state", state);
    sessionStorage.setItem("returnAddress", returnAddress);
    sessionStorage.setItem("client_id", clientId);
    sessionStorage.setItem("scope", scope);

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
            code_challenge: challenge,
            state
        });

    location.href = authUrl;
}

main();
const clientId = "0e60230dce2742ee979fc193d6cac943";
const redirectUri = "https://0fcc073d792d.ngrok-free.app/";  
let accessToken;
let expiresIn;

// --- PKCE helpers ---
function base64UrlEncode(arrayBuffer) {
  // Convert the ArrayBuffer to string of bytes
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  // Base64 encode and make URL-safe
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateCodeVerifier(length = 128) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  // map to characters [A-Z,a-z,0-9,-._~] per RFC7636 suggestion
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let str = "";
  for (let i = 0; i < array.length; i++) {
    str += chars[array[i] % chars.length];
  }
  return str;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

// --- Spotify API wrapper ---
const Spotify = {
  // Returns a promise that resolves to an access token or redirects to authorize
  async getAccessToken() {
    if (accessToken) return accessToken;

    // If we've been redirected back with an authorization code, exchange it for tokens
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    
    if (code) {
      const storedVerifier = window.localStorage.getItem("spotify_code_verifier");
      if (!storedVerifier) {
        // Can't exchange without verifier; start auth again
        console.error("Missing code_verifier in localStorage. Restarting auth.");
        this.startAuth();
        return null;
      }

      // Exchange code for access token
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: storedVerifier,
      });

      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!tokenResponse.ok) {
        console.error("Token exchange failed", await tokenResponse.text());
        return null;
      }

      const tokenJson = await tokenResponse.json();
      accessToken = tokenJson.access_token;
      expiresIn = tokenJson.expires_in;

      // Optionally store refresh_token if returned
      if (tokenJson.refresh_token) {
        window.localStorage.setItem("spotify_refresh_token", tokenJson.refresh_token);
      }

      // Clear token when it expires
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);

      // Clean the URL to remove code param
      window.history.replaceState({}, document.title, window.location.pathname);

      return accessToken;
    }

    // No token and no code: start the Authorization Code + PKCE flow
    this.startAuth();
    return null;
  },

  async startAuth() {
    const scope = "playlist-modify-public";

    const codeVerifier = generateCodeVerifier(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // store verifier for later exchange
    window.localStorage.setItem("spotify_code_verifier", codeVerifier);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location = authUrl.toString();
  },

  async search(term) {
    const token = await Spotify.getAccessToken();
    if (!token) return [];
    const headers = { Authorization: `Bearer ${token}` };

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      { headers }
    );
    const jsonResponse = await response.json();

    if (!jsonResponse.tracks) return [];

    return jsonResponse.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris || trackUris.length === 0) return;

    const token = await Spotify.getAccessToken();
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // 1: get user id
    const response = await fetch("https://api.spotify.com/v1/me", { headers });
    const jsonResponse = await response.json();
    const userId = jsonResponse.id;

    // 2: create playlist
    const createResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ name: playlistName }),
      }
    );
    const playlistResponse = await createResponse.json();
    const playlistId = playlistResponse.id;

    // 3: add tracks to playlist
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ uris: trackUris }),
    });
  },
};

export default Spotify;

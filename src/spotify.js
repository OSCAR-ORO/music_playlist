// spotify.js
const clientId = "0e60230dce2742ee979fc193d6cac943";
const redirectUri = "https://e98b97b37c2d.ngrok-free.app/"; // Must match Spotify dashboard
let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    // Look for access token in URL fragment
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      expiresIn = Number(expiresInMatch[1]);

      // Clear token when it expires
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);

      // Clean the URL so fragment isn’t visible
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    }

    // If no token found, redirect to Spotify authorization
    const scope = "playlist-modify-public";
    const authParams = new URLSearchParams({
      response_type: "token",
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
    });
    const accessUrl = `https://accounts.spotify.com/authorize?${authParams.toString()}`;
    window.location = accessUrl;
  },

  async search(term) {
    const token = Spotify.getAccessToken();
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

    const token = Spotify.getAccessToken();
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

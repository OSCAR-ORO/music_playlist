const clientId = "your spotify clientId";
const redirectUri = "your spotify redirect uri";
let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      expiresIn = expiresInMatch[1];

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessUrl = `http://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },
  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris) return;
    const token = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    //1: get user id
    const response = await fetch("https://api.spotify.com/v1/me", { headers });
    const jsonResponse = await response.json();
    const userId = jsonResponse.id;

    //2: create playlist
    const createResponse = await fetch(
      "http://api.com/v1/users/${userId}/playlists",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ name: playlistName }),
      }
    );
    const playlistResponse = await createResponse.json();
    const playlistId = playlistResponse.id;

    //3: add tracks to playlist
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ uris: trackUris }),
    });
  },

  async search(term) {
    
  }

};
export default Spotify;

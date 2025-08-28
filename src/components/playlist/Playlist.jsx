import React from "react";
import Tracklist from "../tracklist/Tracklist";

export default function Playlist({
  playlistTracks,
  playlistName,
  setPlaylistName,
  onRemove,
  onSave,
}) {
  return (
    <div>
      <input
        type="text"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />

      <h2>{playlistName}</h2>

      <Tracklist tracks={playlistTracks} onRemove={onRemove} />

      <button onClick={onSave}>Save to Spotify</button>
    </div>
  );
}

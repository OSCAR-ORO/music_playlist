import React from "react";
import PlaylistItem from "../playlist_item/PlaylistItem";

export default function PlaylistList({ getPlaylists, playlists, getPlaylist }) {
  return (
    <div>
      <h3>Local Playlists</h3>
      <button onClick={getPlaylists}>Search Playlists</button>

      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <PlaylistItem
              id={playlist.id}
              name={playlist.name}
              onClick={() => getPlaylist(playlist.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

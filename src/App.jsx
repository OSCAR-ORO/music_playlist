import React, { useState } from "react";
import Tracklist from "./components/tracklist/Tracklist";
import Playlist from "./components/playlist/Playlist";
import SearchBar from "./components/search_bar/SearchBar";
import Spotify from "./spotify";

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const addTrack = (track) => {
    if (playlistTracks.find((t) => t.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  };

  const savePlaylist = () => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  };

  // 🔑 New: search handler
  const search = (term) => {
    Spotify.search(term).then((results) => setSearchResults(results));
  };

  return (
    <div>
      <h1>Jamming Music</h1>
      <SearchBar onSearch={search} />

      {/* Search results */}
      <Tracklist tracks={searchResults} onAdd={addTrack} />

      {/* Playlist */}
      <Playlist
        playlistTracks={playlistTracks}
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}
        onRemove={removeTrack}
        onSave={savePlaylist}
      />
    </div>
  );
}

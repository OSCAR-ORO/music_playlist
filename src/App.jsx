import React, { useState } from "react";
import Tracklist from "./components/tracklist/Tracklist";
import Playlist from "./components/playlist/Playlist";
import Spotify from "./spotify";

export default function App() {
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: "Song 1",
      artist: "Artist 1",
      album: "Album 1",
      uri: "uri1",
    },
    {
      id: 2,
      name: "Song 2",
      artist: "Artist 2",
      album: "Album 2",
      uri: "uri2",
    },
    {
      id: 3,
      name: "Song 3",
      artist: "Artist 3",
      album: "Album 3",
      uri: "uri3",
    },
  ]);
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
      setPlaylistName("New playlist");
      setPlaylistTracks([]);
    });
  };

  return (
    <div>
      <h1>Jamming Music</h1>
      {/* <Searchbar /> */}
      <Tracklist tracks={searchResults} onAdd={addTrack} />
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

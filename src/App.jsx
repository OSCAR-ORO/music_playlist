import React, { useState } from "react";
import Tracklist from "./components/tracklist/Tracklist";
import Playlist from "./components/playlist/Playlist";
import PlaylistList from "./components/playlist_list/PlaylistList";
import SearchBar from "./components/search_bar/SearchBar";
import Spotify from "./spotify";

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const addTrack = (track) => {
    if (playlistTracks.find((t) => t.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  };
  const getUserPlaylists = () => {
    Spotify.getUserPlaylists().then((playlists) => {
      setUserPlaylists(
        playlists.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
        }))
      );
    });
  };

  const selectPlaylist = (PlaylistId) => {
     setSelectedPlaylistId(PlaylistId);
     Spotify.getPlaylist(PlaylistId).then(tracks => {
       setPlaylistTracks(
         tracks.map((item) => ({
           id: item.track.id,
           name: item.track.name,
           artist: item.track.artists[0].name,
           album: item.track.album.name,
           uri: item.track.uri,
         }))
       );
     });
  };

  const savePlaylist = () => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris, selectedPlaylistId).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
      setSelectedPlaylistId(null);
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
      <Tracklist tracks={searchResults} onAdd={addTrack} />
      <Playlist
        playlistTracks={playlistTracks}
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}
        onRemove={removeTrack}
        onSave={savePlaylist}
      />
      <PlaylistList
        getPlaylists={getUserPlaylists}
        playlists={userPlaylists}
        getPlaylist={selectPlaylist}
      />
    </div>
  );
}

import React, { useState } from "react";

export default function Tracklist({ tracks, onAdd, onRemove }) {
  return (
    <div>
      <h2>Tracklist</h2>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.name} - {track.artist} - {track.album}
            {onAdd && <button onClick={() => onAdd(track)}>+</button>}
            {onRemove && (
              <button onClick={() => onRemove(track)}>-</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

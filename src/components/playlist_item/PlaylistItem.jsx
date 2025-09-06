import React from "react";

export default function PlaylistItem({name, onClick}){
    return <div onClick={onClick}>{name}</div>;
}
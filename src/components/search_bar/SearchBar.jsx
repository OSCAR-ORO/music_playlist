import React, {useState} from "react";

export default SearchBar({onSearch}) {
    const [term, setTerm] = useState("");
    const handleSearch = () => {
        onSearch(term);
    };
    return(
        <div>
        <input type="text" onChange={(e)=>setTerm(e.target.value)} value={term} placeholder="Enter song, artist or album"/>
        <button onClick={handleSearch}>Search</button>
        </div>
    );
};
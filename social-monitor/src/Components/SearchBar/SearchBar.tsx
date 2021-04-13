import React from "react";

interface SearchBarProps {
    setSearchTerm: (val: any) => void,
    searchTerm: string
}
const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {
    return (
        <form method="get">
            <label>Named Entities</label>
            <input
                value={props.searchTerm}
                onInput={e => props.setSearchTerm(e.currentTarget.value)}
                type="text"
                placeholder="Search Entities"
                name="search" 
            />
        </form>
    )
};

export default SearchBar;
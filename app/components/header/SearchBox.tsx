"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/SearchBox.css";

import SearchIcon from "@/assets/icons/magnifying-glass-solid.svg";
import IconButton from "../IconButton";

type Props = {
    nfts: NFT[];
    categories: Category[];
};

const SearchBox = ({ nfts, categories }: Props) => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [categoriesResults, setCategoriesResults] = useState<Category[]>([]);
    const [nftsResults, setNftsResults] = useState<NFT[]>([]);

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        if (value === "") {
            setCategoriesResults([]);
            setNftsResults([]);
        }
        setQuery(value);

        const currentQuery = value.toLowerCase();
        const catResults = categories.filter((item) => item.name.toLowerCase().includes(currentQuery));
        const nftsResults = nfts.filter((item) => item.title.toLowerCase().includes(currentQuery));
        setCategoriesResults(catResults);
        setNftsResults(nftsResults);
    };

    function handleNFTClick(tokenId: number) {
        router.push(`/models/${tokenId}`);
        setQuery("");
    }

    function handleCategoryClick(category: Category) {
        router.push("/models?category=" + category.slug);
        setQuery("");
    }

    function handleSearchSubmit(event: React.FormEvent<HTMLElement>) {
        event.preventDefault();
        router.push(`/search/${query}`);
        setQuery("");
    }

    return (
        <>
            <form className="form-search" onSubmit={handleSearchSubmit}>
                <input type="text" placeholder="Search here" value={query} onChange={handleInputChange} />
                <button className="search-button" type="submit">
                    <SearchIcon />
                </button>
            </form>
            {query ? (
                <div className="search-results">
                    {nftsResults.length > 0 && (
                        <>
                            <h6>NFTs</h6>
                            <ul>
                                {nftsResults.slice(0, 5).map((item) => (
                                    <li key={item.tokenId} onClick={() => handleNFTClick(item.tokenId)}>
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {categoriesResults.length > 0 && (
                        <>
                            <h6>Categories</h6>
                            <ul>
                                {categoriesResults.slice(0, 5).map((item) => (
                                    <li key={item.slug} onClick={() => handleCategoryClick(item)}>
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <IconButton customClickEvent={handleSearchSubmit} text={`Search for "${query}"`} icon={<SearchIcon />} addClass="btn-contrast" />
                </div>
            ) : null}
        </>
    );
};

export default SearchBox;

"use client";
import "@/styles/SearchResults.css";
import { useEffect, useState } from "react";
import { fetchSearchResults } from "@/lib/nfts";
import SearchResults from "../../sections/SearchResults";

type Props = {
    params: {
        query: string;
    };
};

const SearchPage = ({ params: { query } }: Props) => {
    const [results, setResults] = useState<NFT[] | null>(null);

    useEffect(() => {
        fetchSearchResults(query).then((data) => setResults(data));

        return () => {
            setResults(null);
        };
    }, [query]);

    return (
        <section className="searchres-section">
            <div className="searchres-container">
                <h3>Search Results</h3>
                <p className="desc">Here is what we found for {query ? query : "your request"}!</p>
                <SearchResults query={query} nfts={results} />
            </div>
        </section>
    );
};

export default SearchPage;

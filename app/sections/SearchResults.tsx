import { useState } from "react";
import Link from "next/link";
import Loading from "@/app/components/Loading";
import NFTCard from "../components/NFTCard";

type Props = {
    nfts: NFT[] | null;
    query: string | null;
};

const SearchResults = ({ nfts, query }: Props) => {
    const [visible, setVisible] = useState(12);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 8);
    };

    return (
        <div className="searchres-content">
            {!nfts ? <Loading /> : null}
            {nfts ? (
                nfts.length > 0 ? (
                    <>
                        <div className="search-display">
                            {nfts.slice(0, visible).map((nft) => (
                                <NFTCard nft={nft} key={nft.tokenId} />
                            ))}
                        </div>
                        {nfts && visible < nfts.length && (
                            <button className="btn-contrast" onClick={showMoreItems}>
                                <span>Show More</span>
                            </button>
                        )}
                    </>
                ) : (
                    <div className="nothing-found">
                        <h4>Nothing Found...</h4>
                        <Link href="/models">
                            <button className="btn-contrast">
                                <span>Explore Other NFTs</span>
                            </button>
                        </Link>
                    </div>
                )
            ) : null}
        </div>
    );
};

export default SearchResults;

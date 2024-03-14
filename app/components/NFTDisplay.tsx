"use client";
import { useState } from "react";
import NFTCard from "./NFTCard";
import Loading from "./Loading";

type Props = {
    nfts: NFT[] | undefined | null;
    classType: string;
    cardType?: string;
};

const NFTDisplay = ({ nfts, classType, cardType }: Props) => {
    const [visible, setVisible] = useState(12);
    function showMoreItems() {
        setVisible((prevValue) => prevValue + 12);
    }
    if (nfts === undefined) return <Loading />;
    else if (nfts === null) return <h5>An error has ocurred... We are already fixing it</h5>;
    else if (nfts.length === 0) return <h5>No nfts found</h5>;
    else
        return (
            <>
                <div className={`${classType}-display`}>
                    {nfts.slice(0, visible).map((nft, index) => (
                        <NFTCard nft={nft} key={index} type={cardType} />
                    ))}
                </div>
                {visible < nfts.length ? (
                    <button className="btn-contrast" onClick={showMoreItems}>
                        <span>Explore More</span>
                    </button>
                ) : null}
            </>
        );
};

export default NFTDisplay;

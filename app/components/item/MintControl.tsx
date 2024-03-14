"use client";
import { useState, useContext } from "react";
import SystemContext from "@/app/context/SystemContext";
import IconButton from "@/app/components/IconButton";
import BuyIcon from "@/assets/icons/bag-shopping-solid.svg";
import WalletIcon from "@/assets/icons/wallet-solid.svg";
import PlusIcon from "@/assets/icons/plus-solid.svg";
import MinusIcon from "@/assets/icons/minus-solid.svg";
import { isAvailable } from "@/lib/formatting";
import { formatEther, parseEther } from "ethers";

type Props = {
    nft: NFT;
};

const MintControl = ({ nft }: Props) => {
    const { handleLogin, handleTokenMint, loading, user } = useContext(SystemContext);
    const [counter, setCounter] = useState(1);
    const available = isAvailable(nft);
    function handleDecrements() {
        if (counter <= 1) return;
        setCounter(counter - 1);
    }

    function handleIncrements(totalSupply: number, maxSupply?: number) {
        if (maxSupply && counter === maxSupply - totalSupply) return;
        setCounter(counter + 1);
    }

    return (
        <>
            <div className="control-container">
                <div className="btn-control-container">
                    <IconButton addClass="btn-contrast" customClickEvent={handleDecrements} icon={<MinusIcon />} />
                    <input type="text" value={counter} readOnly />
                    <IconButton
                        addClass="btn-contrast"
                        customClickEvent={() => handleIncrements(nft.totalSupply, nft.maxSupply)}
                        icon={<PlusIcon />}
                    />
                </div>

                <div>
                    <h6>{formatEther(BigInt(counter) * parseEther(nft.formattedPrice.toString()))} MATIC</h6>
                    <p>Total Price</p>
                </div>
                <div>
                    <h6>{nft.formattedPrice} MATIC</h6>
                    <p>Price per Token</p>
                </div>
            </div>
            {loading ? (
                <IconButton addClass="btn-grad btn-buy" text="Connecting..." icon={<WalletIcon />} disabled={true} />
            ) : !user ? (
                <IconButton customClickEvent={handleLogin} addClass="btn-grad btn-buy" text="Connect Wallet" icon={<WalletIcon />} />
            ) : !available ? (
                <IconButton addClass="btn-grad btn-buy" text="Sale Ended" icon={<BuyIcon />} disabled />
            ) : (
                <IconButton
                    customClickEvent={() =>
                        handleTokenMint(nft.collectionId.address, nft.collectionId.slug, nft.tokenId, nft.formattedPrice, counter)
                    }
                    addClass="btn-grad btn-buy"
                    text="Buy Now"
                    icon={<BuyIcon />}
                />
            )}
        </>
    );
};

export default MintControl;

import "@/styles/NFTCard.css";
import { useState, useRef, useContext } from "react";
import { ethers } from "ethers";
import { NumericFormat } from "react-number-format";

import SystemContext from "@/app/context/SystemContext";
import InfoTooltip from "../Tooltip";
import IconButton from "../IconButton";
import Image from "next/image";
import DexartImage from "@/assets/images/dexart.jpg";
import ReactCardFlip from "react-card-flip";
import { formatPriceString } from "@/lib/formatting";

type Props = {
    nft: DexArtNFT;
};

const DexArtNFTCard = ({ nft }: Props) => {
    const { user, handleListingAdd, handleDelist, handleListingEdit, handleListingBuy } = useContext(SystemContext);
    const priceInput = useRef<HTMLInputElement>();
    const [showAdditionalSection, setShowAdditionalSection] = useState(false);
    const toggleSection = () => setShowAdditionalSection(!showAdditionalSection);

    async function handleListing() {
        try {
            if (!priceInput.current) return;
            const value = priceInput.current.value.replace(/[^\d.]/g, "");
            if (value === "") return;
            const wei = ethers.parseUnits(value, 4);
            await handleListingAdd(nft.tokenId, nft.quantity, wei);
            toggleSection();
        } catch (error: any) {
            console.log(error);
        }
    }

    async function handleEdit() {
        try {
            if (!priceInput.current) return;
            const value = priceInput.current.value.replace(/[^\d.]/g, "");
            if (value === "") return;
            const wei = ethers.parseUnits(value, 4);
            await handleListingEdit(nft.listingId!, wei);
            toggleSection();
        } catch (error: any) {
            console.log(error);
        }
    }

    if (nft.active) {
        if (nft.owner != user?.wallet) {
            //// LISTED + NOT OWNER
            return (
                <div className="card-container">
                    <div className="image-container dexart">
                        <Image src={DexartImage} alt={`DEXART Metaverse Land`} width={500} height={500} />
                        <span className="price">{nft.price === "0.0" ? "FREE" : `${formatPriceString(nft.price!)} $DXA`}</span>
                    </div>
                    <h5>DEXART Metaverse Land #{nft.tokenId}</h5>
                    <div className="info-container">
                        <IconButton
                            text="Buy"
                            customClickEvent={() => {
                                handleListingBuy(nft.listingId!, ethers.parseUnits(nft.price!, 4));
                            }}
                            addClass="btn-grad"
                        />
                    </div>
                </div>
            );
        } else {
            //// LISTED + OWNED
            return (
                <ReactCardFlip isFlipped={showAdditionalSection} flipDirection="horizontal">
                    <div className="card-container dexart">
                        <div className="image-container">
                            <Image src={DexartImage} alt={`DEXART Metaverse Land`} width={500} height={500} />
                            <span className="price">{nft.price === "0.0" ? "FREE" : `${formatPriceString(nft.price!)} $DXA`}</span>
                        </div>
                        <h5>DEXART Metaverse Land #{nft.tokenId}</h5>
                        <div className="info-container">
                            <IconButton text="Edit Price" customClickEvent={toggleSection} addClass="btn-grad" />
                            <IconButton text="Delist" customClickEvent={() => handleDelist(nft.listingId!)} addClass="btn-contrast" />
                        </div>
                    </div>

                    <div className="card-container dexart">
                        <h5>DEXART Metaverse Land #{nft.tokenId}</h5>
                        <label htmlFor="listprice">
                            New Price
                            <InfoTooltip>
                                <p>The price is in $DXA token</p>
                            </InfoTooltip>
                        </label>
                        <NumericFormat
                            defaultValue={parseFloat(nft.price!)}
                            type="text"
                            placeholder="Enter price"
                            id="listprice"
                            name="listprice"
                            allowNegative={false}
                            decimalScale={4}
                            getInputRef={priceInput}
                            thousandsGroupStyle="thousand"
                            thousandSeparator=" "
                            valueIsNumericString={false}
                        />
                        <button className="btn-grad" onClick={handleEdit}>
                            Edit Listing
                        </button>
                        <button className="btn-sm btn-contrast" onClick={toggleSection}>
                            Cancel
                        </button>
                    </div>
                </ReactCardFlip>
            );
        }
    } else {
        if (nft.owner != user?.wallet) {
            //// Unlisted + Not owned
            return (
                <div className="card-container nft-disabled">
                    <div className="image-container dexart">
                        <Image src={DexartImage} alt={`DEXART Metaverse Land`} width={500} height={500} />
                        <span className="price">Not available</span>
                    </div>
                    <h5>DEXART Metaverse Land</h5>
                    <div className="info-container">
                        <IconButton text="Buy" addClass="btn-grad btn-disabled" />
                    </div>
                </div>
            );
        } else {
            //// OWNED + UNLISTED
            return (
                <ReactCardFlip isFlipped={showAdditionalSection} flipDirection="horizontal">
                    <div className="card-container dexart">
                        <div className="image-container">
                            <Image src={DexartImage} alt={`DEXART Metaverse Land`} width={500} height={500} />
                        </div>
                        <h5>DEXART Metaverse Land #{nft.tokenId}</h5>
                        <div className="info-container">
                            <IconButton text="List for Sale" customClickEvent={toggleSection} addClass="btn-grad" />
                        </div>
                    </div>

                    <div className="card-container dexart">
                        <h5>DEXART Metaverse Land #{nft.tokenId}</h5>
                        <label htmlFor="listprice">
                            Price
                            <InfoTooltip>
                                <p>The price is in $DXA token</p>
                            </InfoTooltip>
                        </label>
                        <NumericFormat
                            type="text"
                            placeholder="Enter price"
                            id="listprice"
                            name="listprice"
                            allowNegative={false}
                            decimalScale={4}
                            getInputRef={priceInput}
                            thousandsGroupStyle="thousand"
                            thousandSeparator=" "
                            valueIsNumericString={false}
                        />
                        <button className="btn-grad" onClick={handleListing}>
                            List for Sale
                        </button>
                        <button className="btn-sm btn-contrast" onClick={toggleSection}>
                            Cancel
                        </button>
                    </div>
                </ReactCardFlip>
            );
        }
    }
};

export default DexArtNFTCard;

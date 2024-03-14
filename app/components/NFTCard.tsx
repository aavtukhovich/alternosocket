import "@/styles/NFTCard.css";
import Link from "next/link";
import Image from "next/image";
import Avatars from "./Avatars";
import { formatWallet, formatTimeLeft } from "@/lib/formatting";
import IconButton from "./IconButton";
import EditIcon from "@/assets/icons/pen-to-square-solid.svg";
import EditSaleIcon from "@/assets/icons/money-check-dollar-solid.svg";

type Props = {
    nft: NFT;
    type?: string;
};

const NFTCard = ({ nft, type }: Props) => {
    if (!type)
        return (
            <Link href={`/collections/${nft.collectionId.slug}/${nft.tokenId}`} className="card-link">
                <div className="card-container">
                    <div className="image-container">
                        <Image src={nft.thumbnail} alt={nft.title} width={512} height={200} />
                        <span className="price">{nft.formattedPrice === 0 ? "FREE" : `${nft.formattedPrice} MATIC`}</span>
                        {nft.maxSupply && <span className="supply">{nft.maxSupply - nft.totalSupply} Left</span>}
                        {nft.endSale && <span className="time">{formatTimeLeft(nft.endSale)}</span>}
                    </div>
                    <h5>{nft.title}</h5>
                    <div className="info-container">
                        <Avatars link={nft.skAvatar} name={nft.skCreator} creator={nft.creator} />
                        <div>
                            <h6>{nft.creator ? nft.creator.nickname || formatWallet(nft.creator.wallet) : nft.skCreator}</h6>
                            <p>{nft.categories.length > 0 ? nft.categories[0].name : ""}</p>
                        </div>
                    </div>
                </div>
            </Link>
        );
    else
        return (
            <div className={`card-link ${type}`}>
                <div className="card-container">
                    <div className="image-container">
                        <Image src={nft.thumbnail} alt={nft.title} width={512} height={200} />
                        <span className="price">{nft.formattedPrice === 0 ? "FREE" : `${nft.formattedPrice} MATIC`}</span>
                        {nft.maxSupply && <span className="supply">{nft.maxSupply - nft.totalSupply} Left</span>}
                        {nft.endSale && <span className="time">{formatTimeLeft(nft.endSale)}</span>}
                    </div>
                    <Link href={`/collections/${nft.collectionId.slug}/${nft.tokenId}`}>{nft.title}</Link>
                    <div className="info-container">
                        <Avatars link={nft.skAvatar} name={nft.skCreator} creator={nft.creator} />
                        <div>
                            <h6>{nft.creator ? nft.creator.nickname || formatWallet(nft.creator.wallet) : nft.skCreator}</h6>
                            <p>{nft.categories.length > 0 ? nft.categories[0].name : ""}</p>
                        </div>
                    </div>
                    <div className="buttons">
                        <Link href={type === "partner" ? `/${type}/${nft.collectionId.slug}/${nft.tokenId}/info` : `/${type}/${nft.tokenId}/info`}>
                            <IconButton icon={<EditIcon />} addClass="btn-contrast btn-sm" text="Edit NFT Info" />
                        </Link>
                        <Link
                            href={type === "partner" ? `/${type}/${nft.collectionId.slug}/${nft.tokenId}/listing` : `/${type}/${nft.tokenId}/listing`}
                        >
                            <IconButton icon={<EditSaleIcon />} addClass="btn-contrast btn-sm" text="Edit Listing" />
                        </Link>
                    </div>
                </div>
            </div>
        );
};

export default NFTCard;

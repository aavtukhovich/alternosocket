import "@/styles/ModelPage.css";
import Image from "next/image";
import Link from "next/link";
import NotFound from "./not-found";
import ReactMarkdown from "react-markdown";

import Avatars from "@/app/components/Avatars";

import MintControl from "@/app/components/item/MintControl";
import { fetchCollectionNFTs, fetchSingleNFT } from "@/lib/nfts";
import { formatTimeLeft, formatWallet } from "@/lib/formatting";
import AlternoImg from "@/assets/images/alterno.jpg";

import { PARTNERS } from "@/data/Partners";
import { DOMAIN } from "@/app/context/constants";
import ModelView from "@/app/components/item/ModelView";

type Props = {
    params: {
        tokenId: string;
        collectionSlug: string;
    };
};

export async function generateMetadata({ params: { tokenId, collectionSlug } }: Props) {
    const nft = await fetchSingleNFT(collectionSlug, tokenId);

    if (!nft) {
        return {
            title: "Model Not Found",
        };
    }

    return {
        title: nft.title,
        keywords: nft.tags.map((tag) => tag.name),
        description: nft.description,
        creator: nft.creator ? nft.creator.nickname || nft.creator.wallet : nft.skCreator,
        openGraph: {
            title: nft.title,
            description: nft.description,
            url: `${DOMAIN}/models/${nft.tokenId}`,
            siteName: "Alterno | 3D Model NFT Marketplace",
            locale: "en_US",
            type: "website",
        },
    };
}

export async function generateStaticParams({ params: { collectionSlug } }: Props) {
    const nfts = await fetchCollectionNFTs(collectionSlug);

    if (!nfts) return [];

    return nfts.map((nft) => ({
        tokenId: nft.tokenId.toString(),
    }));
}

const ModelPage = async ({ params: { collectionSlug, tokenId } }: Props) => {
    const nft = await fetchSingleNFT(collectionSlug, tokenId);
    if (!nft) return <NotFound />;
    let date: Date | undefined;
    if (nft.endSale) date = new Date(nft.endSale * 1000);
    return (
        <section className="model-section">
            <div className="model-box-container">
                {nft.skAvatar ? (
                    <div className="model-container">
                        <iframe
                            className="model-preview"
                            title={nft.title}
                            allowFullScreen
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            xr-spatial-tracking="true"
                            execution-while-out-of-viewport="true"
                            execution-while-not-rendered="true"
                            web-share="true"
                            src={nft.model}
                        />
                    </div>
                ) : (
                    <ModelView slug={collectionSlug} tokenId={tokenId} />
                )}
                <div className="model-info-container">
                    <div className="title-container">
                        <h3>{nft.title}</h3>
                        {nft.maxSupply && (
                            <h5>
                                {nft.totalSupply} / {nft.maxSupply} Minted
                            </h5>
                        )}
                        {nft.endSale && date && (
                            <h5>{date > new Date() ? formatTimeLeft(nft.endSale) : "Sale ended on " + date.toLocaleDateString("en-gb")}</h5>
                        )}
                    </div>
                    <ReactMarkdown className="model-description">{nft.description}</ReactMarkdown>
                    <div className="author-section">
                        <div className="author-container">
                            <Avatars link={nft.skAvatar} name={nft.skCreator} creator={nft.creator} />
                            <div>
                                {nft.creator ? (
                                    <Link href={`/users/${nft.creator.wallet}`}>
                                        <h6>{nft.creator.nickname || formatWallet(nft.creator.wallet)}</h6>
                                    </Link>
                                ) : (
                                    <h6>{nft.skCreator}</h6>
                                )}
                                <p>Creator</p>
                            </div>
                        </div>
                        {nft.collectionId.slug === "alterno" ? (
                            <div className="author-container">
                                <Image src={AlternoImg} alt={"Collection"} width={60} height={60} />
                                <div>
                                    <h6>Alterno</h6>
                                    <p>Optimized by</p>
                                </div>
                            </div>
                        ) : (
                            <div className="author-container">
                                <Image src={nft.collectionId.avatar ?? AlternoImg} alt={"Collection"} width={60} height={60} />
                                <div>
                                    <h6>{nft.collectionId.displayName ?? nft.collectionId.name}</h6>
                                    <p>Collection</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <MintControl nft={nft} />
                </div>
            </div>
            <div className="metaverse-section">
                <h5>Metaverse Compatibility:</h5>
                <div className="metaverse-container">
                    {PARTNERS.map((partner, index) => {
                        return (
                            <a href={partner.link} key={index} target="_blank" rel="noreferrer">
                                <div className="metaverse-link">
                                    <Image src={partner.image} alt={partner.name} />
                                    <small>{partner.name}</small>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
            {nft.categories.length > 0 && (
                <div className="category-container">
                    <h5>{nft.categories.length > 1 ? "Categories:" : "Category:"}</h5>
                    {nft.categories.map((cat) => {
                        return (
                            <Link href={`/collections/all?category=${cat.slug}`} key={cat.slug}>
                                {cat.name}
                            </Link>
                        );
                    })}
                </div>
            )}
            {nft.tags.length > 0 && (
                <div className="tags-container">
                    <h5>{nft.tags.length > 1 ? "Tags:" : "Tag:"}</h5>
                    <div className="tags-list">
                        {nft.tags.map((tag) => {
                            return <a key={tag.slug}>{tag.name}</a>;
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ModelPage;

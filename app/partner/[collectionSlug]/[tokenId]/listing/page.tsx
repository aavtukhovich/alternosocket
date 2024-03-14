"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useContext, useState } from "react";
import SystemContext from "@/app/context/SystemContext";
import Loading from "@/app/components/Loading";
import { fetchSingleCollection } from "@/lib/nfts";

import { getFullNFT } from "@/lib/createNFT";
import EditNFTListingForm from "@/app/components/forms/EditNFTListingForm";
import "@/styles/Forms.css";

const EditPartnerNFTInfo = () => {
    const { collectionSlug, tokenId } = useParams();
    const { user, showErrorMessage } = useContext(SystemContext);

    const [nft, setNft] = useState<NFT | null | undefined>(undefined);
    const [collection, setCollection] = useState<Collection | null | undefined>(undefined);

    useEffect(() => {
        async function prepare() {
            try {
                if (!user || !user.isPartner || !user.partnerCollection) return restrict();
                if (!tokenId || typeof tokenId !== "string" || !collectionSlug || typeof collectionSlug !== "string") return restrict();
                const coll = await fetchSingleCollection(collectionSlug);
                if (!coll || !user.partnerCollection) return restrict();
                if (user.partnerCollection.slug !== coll.slug) return restrict();
                setCollection(coll);
                const nftFound = await getFullNFT(collectionSlug, tokenId);
                if (!nftFound) return setNft(null);
                setNft(nftFound);
                return;
            } catch (err: any) {
                console.log(err);
                restrict();
                showErrorMessage(err.message);
            }
        }
        prepare();
    }, [user]);

    function restrict() {
        setNft(null);
        setCollection(null);
        return;
    }

    if (collection === undefined || nft === undefined || user === undefined)
        return (
            <section className="edit-col-section">
                <div className="edit-message">
                    <Loading />
                </div>
            </section>
        );

    if (user === null)
        return (
            <section className="edit-col-section">
                <div className="edit-message">
                    <h3>You are not logged in</h3>
                    <Link href="/account">
                        <button className="btn-grad">Back to account</button>
                    </Link>
                </div>
            </section>
        );

    if (collection === null)
        return (
            <section className="edit-col-section">
                <div className="edit-message">
                    <h3>Collection either does not exist or you don't have access to edit it.</h3>
                    <Link href="/account">
                        <button className="btn-grad">Back to account</button>
                    </Link>
                </div>
            </section>
        );

    if (nft === null)
        return (
            <section className="edit-col-section">
                <div className="edit-message">
                    <h3>NFT not found</h3>
                    <Link href="/account">
                        <button className="btn-grad">Back to account</button>
                    </Link>
                </div>
            </section>
        );

    return (
        <section className="edit-col-section">
            <EditNFTListingForm nft={nft} collection={collection} />
        </section>
    );
};

export default EditPartnerNFTInfo;

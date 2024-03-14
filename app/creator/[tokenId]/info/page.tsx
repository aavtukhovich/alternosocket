"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useContext, useState } from "react";
import SystemContext from "@/app/context/SystemContext";
import Loading from "@/app/components/Loading";
import { fetchCategories } from "@/lib/nfts";
import { fetchSingleCollection } from "@/lib/nfts";
import EditNFTInfoForm from "@/app/components/forms/EditNFTInfoForm";

import { getFullNFT } from "@/lib/createNFT";
import "@/styles/Forms.css";

const EditCommunityrNFTInfo = () => {
    const { tokenId } = useParams();
    const { user, showErrorMessage } = useContext(SystemContext);

    const [nft, setNft] = useState<NFT | null | undefined>(undefined);
    const [collection, setCollection] = useState<Collection | null | undefined>(undefined);
    const [categories, setCategories] = useState<Category[] | null | undefined>(undefined);

    useEffect(() => {
        async function prepare() {
            try {
                if (!user || user.isPartner) return setCollection(null);
                if (typeof tokenId !== "string") return setNft(null);
                const coll = await fetchSingleCollection("community");
                if (!coll || coll.slug !== "community") return setCollection(null);
                setCollection(coll);
                fetchCategories()
                    .then((cats) => setCategories(cats))
                    .catch((err) => {
                        console.log(err);
                        setCategories(null);
                    });
                const nftFound = await getFullNFT(coll.slug, tokenId);
                if (!nftFound) return setNft(null);
                setNft(nftFound);
                return;
            } catch (err: any) {
                console.log(err);
                setNft(null);
                showErrorMessage(err.message);
            }
        }
        prepare();
    }, [user]);

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
                    <h3>Error loading collection.</h3>
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
                    {collection === undefined ? (
                        <Loading />
                    ) : (
                        <>
                            <h3>NFT not found</h3>
                            <Link href="/account">
                                <button className="btn-grad">Back to account</button>
                            </Link>
                        </>
                    )}
                </div>
            </section>
        );

    return (
        <section className="edit-col-section">
            <EditNFTInfoForm nft={nft} collection={collection} categories={categories} />
        </section>
    );
};

export default EditCommunityrNFTInfo;

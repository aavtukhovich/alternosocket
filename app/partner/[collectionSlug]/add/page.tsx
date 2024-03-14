"use client";
import "@/styles/Forms.css";
import { useState, useEffect, useContext } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import SystemContext from "@/app/context/SystemContext";
import Loading from "@/app/components/Loading";
import { fetchSingleCollection, fetchCategories } from "@/lib/nfts";

import AddNFTForm from "@/app/components/forms/AddNFTForm";

const AddPartnerNFT = () => {
    const { collectionSlug } = useParams();
    const { user, showErrorMessage } = useContext(SystemContext);
    const [collection, setCollection] = useState<undefined | null | Collection>(undefined);
    const [categories, setCategories] = useState<undefined | null | Category[]>(undefined);

    useEffect(() => {
        async function prepare() {
            try {
                if (!user || !user.isPartner || !collectionSlug || typeof collectionSlug !== "string") return setCollection(null);
                const coll = await fetchSingleCollection(collectionSlug);
                if (user.partnerCollection?.slug !== coll?.slug) return setCollection(null);
                fetchCategories()
                    .then((cats) => setCategories(cats))
                    .catch((err) => {
                        console.log(err);
                        showErrorMessage(err.message);
                        setCategories(null);
                    });
                return setCollection(coll);
            } catch (err: any) {
                console.log(err);
                setCollection(null);
                showErrorMessage(err.message);
            }
        }
        prepare();
    }, [user]);

    if (collection === undefined || user === undefined)
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

    return (
        <section className="edit-col-section">
            <AddNFTForm collection={collection} draft={user.nftDraft} categories={categories} />
        </section>
    );
};

export default AddPartnerNFT;

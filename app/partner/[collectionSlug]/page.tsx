"use client";
import "@/styles/Forms.css";
import { useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SystemContext from "@/app/context/SystemContext";
import Loading from "@/app/components/Loading";
import { fetchSingleCollection } from "@/lib/nfts";

import Link from "next/link";
import EditCollectionForm from "@/app/components/forms/EditCollectionForm";

const EditPartnerCollection = () => {
    const { collectionSlug } = useParams();
    const { user, showErrorMessage } = useContext(SystemContext);
    const [collection, setCollection] = useState<undefined | null | Collection>(undefined);

    useEffect(() => {
        async function prepare() {
            try {
                if (!user || !user.isPartner || !collectionSlug || typeof collectionSlug !== "string") return setCollection(null);
                const coll = await fetchSingleCollection(collectionSlug);
                if (!coll || user.partnerCollection?.slug !== coll.slug) return setCollection(null);
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
            <EditCollectionForm collection={collection} setCollection={setCollection} user={user} />
        </section>
    );
};

export default EditPartnerCollection;

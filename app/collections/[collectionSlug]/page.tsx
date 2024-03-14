import { fetchCategories, fetchCollectionNFTs, fetchCollections, fetchSingleCollection } from "@/lib/nfts";
import AllModels from "@/app/sections/AllModels";
import LatestModels from "@/app/sections/LatestModels";
import { MODELS_DESCRIPTION } from "@/data/Texts";

import { notFound } from "next/navigation";

export async function generateMetadata({ params: { collectionSlug } }: Props) {
    const collection = await fetchSingleCollection(collectionSlug);

    if (!collection) {
        return {
            title: "Collection Not Found",
        };
    }

    return {
        title: collection.displayName || collection.name,
        description: MODELS_DESCRIPTION,
    };
}

export async function generateStaticParams() {
    const collections = await fetchCollections();

    if (!collections) return [];

    return collections.map((collection) => ({
        tokenId: collection.slug.toString(),
    }));
}

type Props = {
    params: {
        collectionSlug: string;
    };
};

const CollectionPage = async ({ params }: Props) => {
    const collection = await fetchSingleCollection(params.collectionSlug);
    const nfts = await fetchCollectionNFTs(params.collectionSlug);
    const categories = await fetchCategories();
    if (!collection) return notFound();
    const heading = collection.displayName || collection.name;
    const description = collection.description || MODELS_DESCRIPTION;
    return (
        <>
            <AllModels nfts={nfts} categories={categories} heading={heading} description={description} avatar={collection.avatar} />
            <section className="latest-explore">
                <LatestModels />
            </section>
        </>
    );
};

export default CollectionPage;

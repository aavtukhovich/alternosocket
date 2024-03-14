import { fetchCategories, fetchNFTs } from "@/lib/nfts";
import AllModels from "@/app/sections/AllModels";
import LatestModels from "@/app/sections/LatestModels";
import { MODELS_HEADING, MODELS_DESCRIPTION } from "@/data/Texts";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Collections",
    description: MODELS_HEADING + ". " + MODELS_DESCRIPTION + ". Explore more at Alterno!",
};

const ModelsPage = async () => {
    const nfts = await fetchNFTs();
    const categories = await fetchCategories();
    return (
        <>
            <AllModels nfts={nfts} categories={categories} heading={MODELS_HEADING} description={MODELS_DESCRIPTION} />
            <section className="latest-explore">
                <LatestModels />
            </section>
        </>
    );
};

export default ModelsPage;

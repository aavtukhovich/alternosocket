import "@/styles/PopularModels.css";
import { fetchPopular } from "@/lib/nfts";
import PopularSlider from "../components/swipers/PopularSlider";

import { POPULAR_DESCRIPTION, POPULAR_HEADING } from "@/data/Texts";

const PopularModels = async () => {
    const nfts = await fetchPopular();

    return (
        <div className="popular-container">
            <div className="popular-container-content">
                <h3>{POPULAR_HEADING}</h3>
                <p>{POPULAR_DESCRIPTION}</p>
            </div>
            {nfts.length > 0 ? <PopularSlider nfts={nfts} /> : <h1>Nothing found</h1>}
        </div>
    );
};

export default PopularModels;

import "@/styles/LatestModels.css";
import { fetchLatest } from "@/lib/nfts";
import LatestSwiper from "../components/swipers/LatestSwiper";

import { LATEST_DESCRIPTION, LATEST_HEADING } from "@/data/Texts";

const LatestModels = async () => {
    const nfts = await fetchLatest();
    return (
        <div className="latest-container">
            <div className="latest-container-content">
                <h3>{LATEST_HEADING}</h3>
                <p>{LATEST_DESCRIPTION}</p>
            </div>
            {nfts.length > 0 ? <LatestSwiper nfts={nfts} /> : <h1>Nothing found</h1>}
        </div>
    );
};

export default LatestModels;

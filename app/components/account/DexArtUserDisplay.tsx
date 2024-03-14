import { useRouter } from "next/navigation";
import Loading from "../Loading";
import IconButton from "../IconButton";
import ExploreIcon from "@/assets/icons/magnifying-glass-arrow-right-solid.svg";

import DexArtNFTCard from "../dexart/DexArtNFTCard";
import { ACCOUNT_NO_DEXART } from "@/data/Texts";

type Props = {
    nfts: DexArtNFT[] | undefined | null;
};

const DexArtUserDisplay = ({ nfts }: Props) => {
    const router = useRouter();
    if (nfts === undefined)
        return (
            <div className="profile-message">
                <Loading />
            </div>
        );
    else if (nfts === null)
        return (
            <div className="profile-message">
                <h3>Error downloading data. We are fixing it...</h3>
            </div>
        );
    else if (nfts.length === 0)
        return (
            <div className="profile-message">
                <h5 className="text-center">{ACCOUNT_NO_DEXART}</h5>
                <IconButton
                    icon={<ExploreIcon />}
                    customClickEvent={() => router.push("/dexmarket")}
                    addClass="btn-grad"
                    text="Explore The Marketplace"
                />
            </div>
        );
    return (
        <div className="dexart-display">
            {nfts.map((nft, index) => (
                <DexArtNFTCard key={index} nft={nft} />
            ))}
        </div>
    );
};

export default DexArtUserDisplay;

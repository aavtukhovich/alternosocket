import NFTDisplay from "../NFTDisplay";
import Link from "next/link";

type Props = {
    user: User | null;
    nfts: NFT[] | undefined | null;
};

const CreatedDisplay = ({ user, nfts }: Props) => {
    if (!user || user.isPartner) return null;

    return (
        <div className="created-section">
            <div className="buttons">
                <Link href={`/creator/add`}>
                    <button className="btn-contrast btn-square">Add new NFT</button>
                </Link>
            </div>
            {nfts?.length === 0 && (
                <Link href={"/faq"} style={{ textDecoration: "underline" }}>
                    Learn more
                </Link>
            )}
            <NFTDisplay nfts={nfts} classType="created" cardType="creator" />
        </div>
    );
};

export default CreatedDisplay;

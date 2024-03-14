import NFTDisplay from "../NFTDisplay";
import Link from "next/link";
import Image from "next/image";
import Avatar from "boring-avatars";

type Props = {
    user: User | null;
    collection: Collection | undefined;
    nfts: NFT[] | undefined | null;
};

const PartnerCollection = ({ user, collection, nfts }: Props) => {
    if (!user || !user.isPartner || !collection) return null;

    return (
        <div className="partner-section">
            <div className="collection-info">
                {collection.avatar ? (
                    <Image src={collection.avatar} width={200} height={200} alt={collection.name} />
                ) : (
                    <Avatar size={200} name={collection.address} variant="bauhaus" />
                )}

                <div className="description">
                    <h3>{collection.displayName ?? collection.name}</h3>
                    <p>{collection.description ?? ""}</p>
                </div>
                <div className="buttons">
                    <Link href={`/partner/${collection.slug}/add`}>
                        <button className="btn-contrast btn-square">Add new NFT</button>
                    </Link>
                    <Link href={`/partner/${collection.slug}`}>
                        <button className="btn-contrast btn-square">Edit Collection Info</button>
                    </Link>
                </div>
            </div>
            <NFTDisplay nfts={nfts} classType="created" cardType="partner" />
        </div>
    );
};

export default PartnerCollection;

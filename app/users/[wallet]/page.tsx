import { getUserAndNFTs } from "@/lib/users";
import "@/styles/Account.css";
import { notFound } from "next/navigation";
import UserDisplay from "@/app/components/account/UserDisplay";
import NFTDisplay from "@/app/components/NFTDisplay";

type Props = {
    params: {
        wallet: string;
    };
};

export async function generateMetadata({ params: { wallet } }: Props) {
    const { user, nfts } = await getUserAndNFTs(wallet);

    if (!user) {
        return {
            title: "User Not Found",
        };
    }

    return {
        title: user.nickname ?? user.wallet,
    };
}

const UsersPage = async ({ params: { wallet } }: Props) => {
    const { user, nfts } = await getUserAndNFTs(wallet);
    if (!user) return notFound();
    return (
        <section className="section-account">
            <UserDisplay user={user} />
            <div className="userpage-content">
                <NFTDisplay nfts={nfts} classType="explore" />
            </div>
        </section>
    );
};

export default UsersPage;

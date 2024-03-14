import { axisoClient } from "./axios";

export async function getCurrentUser() {
    const response = await axisoClient.get("/users/data");
    return response.data as User;
}

export async function getUserAndNFTs(wallet: string) {
    try {
        const response = await axisoClient.get(`/data/user/${wallet}`);
        const user: User = response.data.user;
        const nfts: NFT[] = response.data.nfts;
        nfts.forEach((nft) => {
            nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
        });
        return { user, nfts };
    } catch (err: any) {
        console.log(err);
        return { user: null, nfts: null };
    }
}

export async function checkNickname(nickname: string) {
    try {
        const response = await axisoClient.get(`/users/settings/nickname/${nickname}`);
        return response.data.available as boolean;
    } catch (error: any) {
        console.log(error);
        return false;
    }
}

export async function updateNickname(nickname: string) {
    try {
        const response = await axisoClient.patch("/users/settings/nickname", { nickname });
        return response.data.user as User;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}

export async function updateAvatar(avatar: string) {
    try {
        const response = await axisoClient.patch("/users/settings/avatar", { avatar });
        return response.data.user as User;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}

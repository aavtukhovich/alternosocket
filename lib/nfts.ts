import { API_URL } from "@/app/context/constants";
import { axisoClient } from "./axios";

export async function fetchNFTs() {
    const response = await fetch(API_URL + "/nfts/full", { next: { revalidate: 86400, tags: ["nft"] } });
    if (response.status !== 200) return null;
    const data: NFT[] = await response.json();
    if (data.length === 0) return data;
    data.forEach((nft) => {
        nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
    });
    return data;
}

export async function fetchCollectionNFTs(slug: string) {
    const response = await fetch(API_URL + `/nfts/${slug}`, { next: { revalidate: 86400, tags: ["nft"] } });
    if (response.status !== 200) return null;
    const data: NFT[] = await response.json();
    if (data.length === 0) return data;
    data.forEach((nft) => {
        nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
    });
    return data;
}

export async function fetchCollections() {
    const response = await fetch(API_URL + `/data/collections`, { next: { revalidate: 86400, tags: ["collection"] } });
    if (response.status !== 200) return [];
    const data: Collection[] = await response.json();
    return data;
}

export async function fetchSingleNFT(collection: string, tokenId: number | string) {
    const response = await fetch(API_URL + `/nfts/${collection}/${tokenId}`, { next: { revalidate: 86400, tags: ["nft"] } });
    if (response.status !== 200) return null;
    const result: NFT = await response.json();
    result.formattedPrice = parseFloat(result.price.$numberDecimal);
    return result;
}

export async function fetchSingleCollection(slug: string) {
    const response = await fetch(API_URL + `/data/collections/${slug}`, { next: { revalidate: 86400, tags: ["collection"] } });
    if (response.status !== 200) return null;
    const data: Collection = await response.json();
    return data;
}

export async function fetchPopular() {
    const response = await fetch(API_URL + "/nfts/popular", { next: { revalidate: 86400, tags: ["nft"] } });
    if (response.status !== 200) return [];
    const data: NFT[] = await response.json();
    if (data.length === 0) return data;
    data.forEach((nft) => {
        nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
    });
    if (data.length > 12) {
        return data.slice(0, 12);
    } else {
        return data;
    }
}

export async function fetchLatest() {
    const response = await fetch(API_URL + "/nfts/latest", { next: { revalidate: 86400, tags: ["nft"] } });
    if (response.status !== 200) return [];
    const data: NFT[] = await response.json();
    if (data.length === 0) return data;
    data.forEach((nft) => {
        nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
    });
    if (data.length > 8) {
        return data.slice(0, 8);
    } else {
        return data;
    }
}

export async function fetchCreated(userId: string) {
    const response = await fetch(API_URL + "/nfts/created", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: userId,
        }),
        next: {
            revalidate: 86400,
            tags: ["nft"],
        },
    });
    if (response.status !== 200) return null;
    const data: NFT[] = await response.json();
    if (data.length === 0) return data;
    data.forEach((nft) => {
        nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
    });
    return data;
}

export async function fetchMultiple(nfts: OwnedNFT[]) {
    if (nfts.length === 0) return [];
    const response = await fetch(API_URL + "/nfts/multiple", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nfts,
        }),
        next: {
            revalidate: 86400,
            tags: ["nft"],
        },
    });
    if (response.status !== 200) return null;
    const data: NFT[] = await response.json();
    if (data.length === 0) return data;
    data.forEach((nft) => {
        nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
    });
    return data;
}

export async function fetchSearchResults(query: string | null) {
    if (!query) return [];
    const response = await fetch(API_URL + "/data/search/" + query);
    if (response.status !== 200) return [];
    const data: NFT[] = await response.json();
    if (data.length === 0) return data;
    data.forEach((nft) => {
        nft.formattedPrice = parseFloat(nft.price.$numberDecimal);
    });
    return data;
}

export async function fetchCategories() {
    const response = await fetch(API_URL + "/data/categories", { next: { revalidate: 86400, tags: ["nft"] } });
    if (response.status !== 200) return [];
    const data: Category[] = await response.json();
    const sorted = data.sort((a, b) => {
        return a.slug.localeCompare(b.slug);
    });
    return sorted;
}

export async function updateNFT(slug: string, tokenId: string | number) {
    try {
        const result = await axisoClient.put(`/users/nfts/${slug}/${tokenId}`);
        console.log(result);
    } catch (err: any) {
        console.log(err.message);
    }
}

export async function fetchDexartNFTs(wallet: string) {
    const response = await fetch(API_URL + `/data/dexart/${wallet}`);
    if (response.status !== 200) return null;
    const data: DexArtNFT[] = await response.json();
    return data;
}

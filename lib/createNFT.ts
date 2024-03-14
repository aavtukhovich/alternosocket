import { axisoClient } from "./axios";

export async function getFullNFT(collection: string, tokenId: number | string) {
    const response = await axisoClient.get(`/users/nfts/${collection}/${tokenId}`);
    return response.data as NFT;
}

export async function newNFTDraft(draft: NFTDraft) {
    const response = await axisoClient.post(`/users/drafts`, { draft });
    return response.data.draft as NFTDraft;
}

export async function saveNFTDraft(draft: NFTDraft) {
    const response = await axisoClient.patch(`/users/drafts`, { draft });
    return response.data.draft as NFTDraft;
}

export async function getAddSignature(draft: NFTDraft) {
    const response = await axisoClient.post(`/users/approvals/add`, { draft });
    if (!response.data.signature) throw new Error("Signature not found");
    return response.data.signature as string;
}

export async function finalizeNftAdd(draft: NFTDraft, collectionSlug: string, tokenId: number) {
    const response = await axisoClient.post("/users/drafts/final", { draft, collectionSlug, tokenId });
    if (!response.data.created) throw new Error("New NFT not found");
    return response.data.created as NFT;
}

export async function editNFTInfo(change: NFTEditSubmission, collectionSlug: string, tokenId: number) {
    const response = await axisoClient.patch(`/users/nfts/${collectionSlug}/${tokenId}/info`, { change });
    if (!response.data) throw new Error("NFT not changed");
    return response.data as NFT;
}

export async function editNFTListing(change: NFTEditListingSubmission, collectionSlug: string, tokenId: number) {
    const response = await axisoClient.patch(`/users/nfts/${collectionSlug}/${tokenId}/listing`, { change });
    if (!response.data) throw new Error("NFT not changed");
    return response.data as NFT;
}

export async function getEditSignature(change: NFTEditListingSubmission, collectionSlug: string, tokenId: number) {
    const response = await axisoClient.post(`/users/approvals/edit`, { change, collectionSlug, tokenId });
    if (!response.data.signature) throw new Error("Signature not found");
    return response.data.signature as string;
}

export async function getDecryptedModelLink(nftId: string) {
    const response = await axisoClient.get(`/users/downloads/model/${nftId}`, { responseType: "blob" });
    if (!response.data) throw new Error("Error retrieving data");
    const blob = new Blob([response.data], { type: response.headers["content-type"] });
    const file = new File([blob], "filename.glb", { type: response.headers["content-type"] });
    const url = URL.createObjectURL(file);
    return url;
}

export async function getDecryptedModelDraftLink() {
    const response = await axisoClient.get(`/users/downloads/model/draft`, { responseType: "blob" });
    if (!response.data) throw new Error("Error retrieving data");
    const blob = new Blob([response.data], { type: response.headers["content-type"] });
    const file = new File([blob], "filename.glb", { type: response.headers["content-type"] });
    const url = URL.createObjectURL(file);
    return url;
}

import { axisoClient } from "./axios";

type ChallengeResponse = {
    challenge: string;
    nonce: string;
};

export async function getDownloadChallenge(nftId: string) {
    const response = await axisoClient.get(`/users/downloads/${nftId}`);
    if (!response.data || !response.data.challenge || !response.data.nonce) throw new Error("Error retrieving data");
    return response.data as ChallengeResponse;
}

export async function downloadModel(nftId: string, challengeId: string, message: string) {
    const response = await axisoClient.post(`/users/downloads/${nftId}`, { challengeId, message }, { responseType: "blob" });
    if (!response.data) throw new Error("Error retrieving data");
    const blob = new Blob([response.data], { type: response.headers["content-type"] });

    const disposition = response.headers["content-disposition"];
    const filename = disposition ? disposition.split("filename=")[1].replace(/"/g, "") : "model.glb";
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
}

export async function getLegacyDownloadChallenge(nftId: string, email: string) {
    const response = await axisoClient.post(`/users/downloads/legacy/${nftId}`, { email });
    if (!response.data || !response.data.challenge || !response.data.nonce) throw new Error("Error retrieving data");
    return response.data as ChallengeResponse;
}

export async function legacyDowloadRequest(message: string, challengeId: string) {
    const response = await axisoClient.post(`/users/downloads/legacy/download`, { message, challengeId });
    if (!response.data || !response.data.created) throw new Error("Error retrieving data");
    return response.data as DonwloadRequest;
}

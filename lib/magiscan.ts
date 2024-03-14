import { axisoClient } from "./axios";

export async function getMagiscanUserStatus() {
    const response = await axisoClient.get("/users/nfts/magiscan/status");
    if (typeof response.data !== "boolean") throw new Error("Could not get MagiScan status");
    return response.data;
}

export async function getMagiscanQRCode() {
    const response = await axisoClient.get("/users/nfts/magiscan/qr");
    if (!response.data) throw new Error("Could not get MagiScan QR Code");
    const decodedQRCode = Buffer.from(response.data.qr, "base64").toString("utf-8");
    return { qr: decodedQRCode, uri: response.data.uri as string };
}

export async function getMagiscanModelsList(page?: number) {
    const response = await axisoClient.get("users/nfts/magiscan/models", { params: { page } });
    console.log(response.data);
    const models = response.data.items as MagiscanModel[];
    const totalPages = Math.ceil(response.data.total_items / response.data.limit);
    return { models, totalPages };
}

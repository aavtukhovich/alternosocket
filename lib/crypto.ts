export async function importKey(hexKey: string) {
    const keyData = hexToUint8Array(hexKey);
    return await window.crypto.subtle.importKey("raw", keyData, { name: "AES-CBC", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function encryptFile(file: Blob, key: CryptoKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const fileData = await file.arrayBuffer();
    const data = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: iv }, key, fileData);
    return { iv, data };
}

export async function decryptFile(encryptedData: ArrayBuffer, key: CryptoKey, ivString: string) {
    const iv = base64ToUint8Array(ivString);
    const decryptedData = await window.crypto.subtle.decrypt({ name: "AES-CBC", iv: iv }, key, encryptedData);
    return new Blob([decryptedData], { type: "model/gltf-binary" });
}

function hexToUint8Array(hexString: string): Uint8Array {
    const length = hexString.length;
    const uint8Array = new Uint8Array(length / 2);
    for (let i = 0; i < length; i += 2) {
        uint8Array[i / 2] = Number.parseInt(hexString.substring(i, i + 2), 16);
    }
    return uint8Array;
}

function base64ToUint8Array(base64String: string): Uint8Array {
    const decodedString = atob(base64String);
    const length = decodedString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        uint8Array[i] = decodedString.charCodeAt(i);
    }
    return uint8Array;
}

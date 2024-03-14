import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject, getBlob, getMetadata } from "firebase/storage";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export async function handleFileUpload(file: Blob | Uint8Array | ArrayBuffer, name: string, folder: string) {
    const filename = `/${folder}/${name}`;
    const fileRef = ref(storage, filename);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return { filename, url };
}

export async function uploadFileWithMetadata(file: Blob | Uint8Array | ArrayBuffer, name: string, folder: string, iv: Uint8Array) {
    const filename = `/${folder}/${name}`;
    const storageRef = ref(storage, filename);

    // Convert IV to base64 string for storage
    const ivBase64 = uint8ArrayToBase64(iv);

    // Upload the file with metadata
    const metadata = {
        customMetadata: {
            iv: ivBase64,
        },
    };

    await uploadBytes(storageRef, file, metadata);
}

// export async function handleFileDelete(filename: string) {
//     const fileRef = ref(storage, filename);
//     await deleteObject(fileRef);
//     return;
// }

export async function getLink(name: string, folder: string) {
    try {
        const filename = `/${folder}/${name}`;
        console.log(filename);
        const fileRef = ref(storage, filename);
        const url = await getDownloadURL(fileRef);
        return url;
    } catch (err: any) {
        if (err.code === "storage/object-not-found") return undefined;
        throw err;
    }
}

// export async function downloadFile(name: string, folder: string) {
//     try {
//         const filename = `/${folder}/${name}`;
//         const fileRef = ref(storage, filename);
//         const blob = await getBlob(fileRef);
//         return await blobToArrayBuffer(blob);
//     } catch (err: any) {
//         if (err.code === "storage/object-not-found") return undefined;
//         throw err;
//     }
// }

export async function getFileMetadata(name: string, folder: string) {
    const filename = `/${folder}/${name}`;
    const fileRef = ref(storage, filename);
    const metadata = await getMetadata(fileRef);
    return metadata;
}

// export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = (ev: ProgressEvent<FileReader>) => {
//             if (ev.target && ev.target.readyState === FileReader.DONE) {
//                 resolve(ev.target.result as ArrayBuffer);
//             }
//         };
//         reader.onerror = reject;
//         reader.readAsArrayBuffer(blob);
//     });
// }

export async function signInFirebase(token: string) {
    return await signInWithCustomToken(auth, token);
}

//HELPERS

function uint8ArrayToBase64(buffer: Uint8Array) {
    let binary = "";
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
}

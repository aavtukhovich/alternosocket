export function sanitizeAddress(address: string) {
    const ADDR_REG = /^0x[a-fA-F0-9]{40}$/;
    if (ADDR_REG.test(address)) {
        return address.toLowerCase();
    } else {
        throw new Error(`Incorrect address format`);
    }
}

export function sanitizeNickname(name: string) {
    const regex = /^[a-zA-Z0-9_-]{5,15}$/;
    return regex.test(name);
}

export function sanitizeCollectionName(name: string) {
    const regex = /^[a-zA-Z0-9\s]{4,15}$/;
    return regex.test(name);
}

export function sanitizeCollectionDescription(description: string) {
    const regex = /^[A-Za-z0-9.,'"?! \n]{1,200}$/;
    return regex.test(description);
}

export function sanitizeTagName(name: string) {
    if (!name) throw new Error("Tag name not provided");
    if (typeof name !== "string") throw new Error(`Wrong type of Tag name: ${name}`);
    const regex = /^[a-zA-Z\s]{3,10}$/;
    const trimmed = name.trim();
    if (!regex.test(trimmed)) throw new Error(`Incorrect Tag name format: ${name}`);
    return trimmed;
}

export function sanitizeNftnName(name: string | undefined) {
    if (!name) throw new Error("No NFT name provided");
    if (typeof name !== "string") throw new Error("Wrong type of NFT name");
    const regex = /^[a-zA-Z0-9\s]{4,40}$/;
    if (!regex.test(name)) throw new Error("Incorrect NFT name format");
    return name.trim();
}

export function sanitizeNftPrice(price: number | undefined) {
    if (price === undefined) throw new Error("No price provided");
    if (typeof price !== "number") throw new Error("Wrong price format");
    const priceNum = parseFloat(price.toString());
    if (priceNum < 0) throw new Error("Price cannot be lower than 0");
    return priceNum;
}

export function sanitizeDescription(description: string | undefined) {
    if (!description) throw new Error("No description provided");
    if (typeof description !== "string") throw new Error("Wrong type of description");
    const regex = /^[A-Za-z0-9.,'"?! \n]{1,200}$/;
    if (!regex.test(description)) throw new Error("Incorrect description format");
    return description.trim();
}

export function sanitizeTagList(list: string[] | undefined) {
    if (!list) return [];
    if (list.length === 0) return [];
    const result: string[] = [];
    list.forEach((name) => {
        const tag = sanitizeTagName(name);
        result.push(tag);
    });
    return result;
}

export function sanitizeObjectIDList(list: string[] | undefined) {
    if (!list) return [];
    if (list.length === 0) return [];
    const result: string[] = [];
    list.forEach((name) => {
        const id = sanitizeObjectID(name);
        result.push(id);
    });
    return result;
}

function sanitizeObjectID(id: string) {
    if (!id) throw new Error("ID not provided");
    const regex = /^[a-f\d]{24}$/i;
    if (!regex.test(id)) throw new Error("Wrong ID format");
    return id;
}

// export function createFileName(name: string) {
//     if (typeof name != "string") throw new Error("Incorrect input data");
//     const lowercase = name.toLowerCase();
//     const sanitized = lowercase.replace(/[^-a-zA-Z0-9 ]/g, "");
//     const array = sanitized.split(" ");
//     const filteredWords = array.filter((el) => el.length > 0);

//     const date = new Date().toISOString();
//     filteredWords.push(date);

//     const filename = filteredWords.join("-");
//     return filename;
// }

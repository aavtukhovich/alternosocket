export function formatWallet(walletAddress: string) {
    return walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);
}

export function formatTimeLeft(time: number) {
    const selected = new Date(time * 1000);
    const now = new Date();
    if (now > selected) return "Sale ended";
    const millisecondsLeft = selected.valueOf() - now.valueOf();

    // Convert milliseconds to other units
    const secondsLeft = millisecondsLeft / 1000;
    const minutesLeft = secondsLeft / 60;
    const hoursLeft = minutesLeft / 60;
    const daysLeft = hoursLeft / 24;

    // Return the biggest approximate time left
    if (daysLeft >= 1) {
        return `${Math.ceil(daysLeft)} ${daysLeft === 1 ? "day" : "days"} left`;
    } else if (hoursLeft >= 1) {
        return `${Math.ceil(hoursLeft)} ${hoursLeft === 1 ? "hour" : "hours"} left`;
    } else if (minutesLeft >= 1) {
        return `${Math.ceil(minutesLeft)} ${minutesLeft === 1 ? "minute" : "minutes left"}`;
    } else {
        return "less than a minute left";
    }
}

export function isAvailable(nft: NFT) {
    if (!nft.available) return false;
    if (nft.maxSupply && nft.maxSupply <= nft.totalSupply) return false;
    if (nft.endSale && new Date(nft.endSale * 1000) <= new Date()) return false;
    return true;
}

export function formatPriceString(bigIntString: string) {
    let [integerPart, decimalPart]: string[] | undefined[] = bigIntString.split(".");
    if (decimalPart === "0") decimalPart = undefined;

    let reversed = integerPart.split("").reverse().join("");
    let withSpaces = reversed.replace(/.{3}/g, "$& ");
    let formattedIntegerPart = withSpaces.split("").reverse().join("").trim();

    return decimalPart ? formattedIntegerPart + "." + decimalPart : formattedIntegerPart;
}

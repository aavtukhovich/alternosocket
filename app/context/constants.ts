export const API_URL = process.env.NEXT_PUBLIC_LOCAL === "true" ? "http://localhost:3000" : "https://api.alternonft.com";
export const SOCKET_URL = process.env.NEXT_PUBLIC_LOCAL === "true" ? "http://localhost:3005" : "https://socket.alternonft.com";
export const DOMAIN = process.env.NEXT_PUBLIC_LOCAL === "true" ? "http://localhost:3003" : "https://alternonft.com";

//                                                                     testnet     mainnet
export const MATIC_CHAIN = process.env.NEXT_PUBLIC_LOCAL === "true" ? "0x13881" : "0x89";
//                                                                    seppolia     bsc
export const BNB_CHAIN = process.env.NEXT_PUBLIC_LOCAL === "true" ? "0xaa36a7" : "0x38";

export const PRICE_OPTIONS: PriceSortingOption[] = [
    { choice: "ALL", name: "All Prices", min: null, max: null },
    { choice: "FREE", name: "Free", min: null, max: null },
    { choice: "0_5", name: "0-5 MATIC", min: 0, max: 5 },
    { choice: "5_10", name: "5-10 MATIC", min: 5, max: 10 },
    { choice: "10_20", name: "10-20 MATIC", min: 10, max: 20 },
    { choice: "20+", name: "20+ MATIC", min: null, max: null },
];

export const ORDER_OPTIONS: OrderSortingOption[] = [
    { choice: "NEW", name: "Newest first" },
    { choice: "OLD", name: "Oldest first" },
];

export const MARKETPLACE_OPTIONS: OrderSortingOption[] = [
    { choice: "ASC", name: "Price low to high" },
    { choice: "DESC", name: "Price high to low" },
    { choice: "NEW", name: "Recently listed" },
    { choice: "OLD", name: "Oldest" },
];

export const USER = process.env.NEXT_PUBLIC_LOCAL === "true" ? "USER" : "2e40ad879e955201df4dedbf8d479a12";
export const PARTNER = process.env.NEXT_PUBLIC_LOCAL === "true" ? "PARTNER" : "9ed8acdfad2eaad76069b0b8e256ea4e";
export const ADMIN = process.env.NEXT_PUBLIC_LOCAL === "true" ? "ADMIN" : "73acd9a5972130b75066c82595a1fae3";

export const REFERRAL_ADDRESS =
    process.env.NEXT_PUBLIC_LOCAL === "true" ? "0x7370EEAD498377a6Bc89aF5d77a95b671Ec27Ce7" : "0x1D4daF211f41Dad1b5182100A7f9703f6Ec73719";

export const MARKETPLACE_ADDRESS =
    process.env.NEXT_PUBLIC_LOCAL === "true" ? "0x0230f61FA23df17FEEE12A3346cC7Cd8A77798d7" : "0x1D4daF211f41Dad1b5182100A7f9703f6Ec73719";

export const DEXARTNFT_ADDRESS =
    process.env.NEXT_PUBLIC_LOCAL === "true" ? "0x37AAA008DF8Bf96bB31507113cAe831cd95B2f4A" : "0xD9693D2C75E824761b1Ab17B3f19a7f03bE723fb";

export const DXA_ADDRESS =
    process.env.NEXT_PUBLIC_LOCAL === "true" ? "0xb5Ba85f8ba4Fcb24845E86A368A1e083aB3CF19C" : "0x68306De72D3caD418279a0d2411C1197D34dd17F";

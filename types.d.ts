interface Window {
    // pick one
    ethereum: EthereumProvider;
    // ethereum: ExternalProvider
    // ethereum: AbstractProvider
}

enum Socials {
    Facebook,
    Instagram,
    Pinterest,
    Discord,
    LinkedIn,
    Telegram,
    Twitter,
    WhatsApp,
    TikTok,
    Reddit,
    Medium,
    Notion,
}

type ModalStatus = "none" | "success" | "error" | "processing";

type SocialName = keyof typeof Socials;

type SocialLink = {
    _id: string;
    active: boolean;
    name: SocialName;
    link: string;
    icon: string;
};

type FooterMenuItem = {
    link: string;
    name: string;
};

type FooterMenuList = {
    _id: string;
    list: FooterMenuItem[];
};

type CookiesText = {
    _id: string;
    heading: string;
    text: string;
};

type Category = {
    _id: string;
    slug: string;
    name: string;
};

type Tag = Category;

type ApiUser = {
    wallet: string;
    avatar?: string;
    nickname?: string;
    role: string;
    referrer?: string;
    isPartner: boolean;
    partnerCollection?: Collection | string;
};

type Collection = {
    _id: string;
    address: string;
    name: string;
    slug: string;
    displayName?: string;
    description?: string;
    avatar?: string;
};

type NFT = {
    _id: string;
    collectionId: Collection;
    tokenId: number;
    sketchFabId?: string;
    title: string;
    price: {
        $numberDecimal: string;
    };
    description: string;
    creator?: ApiUser;
    skCreator?: string;
    skAvatar?: string;
    thumbnail: string;
    model: string;
    available: boolean;
    totalSupply: number;
    maxSupply?: number;
    endSale?: number;
    categories: Category[];
    tags: Tag[];
    formattedPrice: number;
    secret?: string;
};

type SystemContent = {
    walletAddress: string | null;
    loggedIn: boolean;
    refreshUser: () => Promise<void>;
    user: User | null | undefined;
    loading: boolean;
    getOwnedItems: () => Promise<void>;
    ownedNFTs: NFT[] | null | undefined;
    dexartNFTs: DexArtNFT[] | null | undefined;
    getDexartItems: () => Promise<void>;
    createdNFTs: NFT[] | null | undefined;
    getCreatedItems: () => Promise<void>;
    refBalance: string | null | undefined;
    getReferralBalance: () => Promise<void>;
    handleLogin: () => Promise<boolean>;
    handleLogout: () => void;
    handleTokenMint: (collectionAddress: string, collectionSlug: string, tokenId: number, price: number, amount: number) => Promise<void>;
    handleTokenAdd: (
        collectionAddress: string,
        collectionSlug: string,
        signature: string,
        price: number,
        maxSupply: number = 0,
        endSale: number = 0
    ) => Promise<number>;
    handleTokenEdit: (
        nft: NFT,
        collectionAddress: string,
        collectionSlug: string,
        signature: string,
        price: number,
        available: boolean,
        maxSupply?: number,
        endSale?: number
    ) => Promise<void>;
    handleRefClaim: () => Promise<void>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setReferrer: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<User | null>>;
    ///PROCESSING
    showModal: boolean;
    status: ModalStatus;
    modalMessage: string | undefined;
    modalHeading: string | undefined;
    closeModal: () => void;
    showErrorMessage: (message?: string, heading?: string) => void;
    startProcessing: (message?: string, heading?: string) => void;
    showSuccessMessage: (message?: string, heading?: string) => void;
    //DOWNLOADS
    handleDownload: (nftId: string) => Promise<void>;
    handleDownloadLegacy: (nftId: string, email: string) => Promise<void>;
    handleListingAdd: (tokenId: number, quantity: number, price: bigint) => Promise<void>;
    handleDelist: (listingId: number) => Promise<void>;
    handleListingEdit: (listingId: number, price: bigint) => Promise<void>;
    handleListingBuy: (listingId: number, price: bigint) => Promise<void>;
};

type CategorySortingOption = {
    choice: string;
    name: string;
};

type OrderSortingOption = {
    choice: string;
    name: string;
};

type PriceSortingOption = {
    choice: string;
    name: string;
    min: number | null;
    max: number | null;
};

type FAQList = {
    _id: string;
    list: FAQItem[];
};

type FAQItem = {
    question: string;
    answer: string;
};

type PartnersList = {
    _id: string;
    list: PartnersItem[];
};

type PartnersItem = {
    image: string;
    name: string;
};

type User = {
    _id: string;
    wallet: string;
    avatar?: string;
    avatarFile?: string;
    nickname?: string;
    role: string;
    referrer?: string;
    isPartner: boolean;
    partnerCollection?: Collection;
    nftDraft?: NFTDraft;
};

type OwnedNFT = {
    collectionId: string;
    tokenId: number;
    amount: number;
};

type CollectionUpdateObject = {
    description?: string;
    avatar?: string;
    displayName?: string;
};

type NFTDraft = {
    draftId: string;
    collection: string;
    title?: string;
    price?: number;
    tokenId?: number;
    secret?: string;
    image: boolean;
    thumbnail?: string;
    model: boolean;
    description?: string;
    categories?: string[];
    tags?: string[];
    maxSupply?: number;
    endSale?: number;
};

type NFTEditSubmission = {
    title: string;
    description: string;
    thumbnail?: string;
    categories: string[];
    tags: string[];
};

type NFTEditListingSubmission = {
    price: number;
    available: boolean;
    maxSupply?: number;
    endSale?: number;
};

type DonwloadRequest = {
    _id: string;
    nft: string;
    walletAddress: string;
    emailAddress: string;
    done: boolean;
};

type Listing = {
    _id: string;
    listingId: number;
    tokenId: number;
    quantity: number;
    owner: string;
    price: string;
};

type DexArtNFT = {
    tokenId: number;
    active: boolean;
    owner: string;
    quantity: number;
    listingId?: number;
    price?: string;
    priceNum?: bigint;
};

type MagiscanModel = {
    id: string;
    name: string;
    created_at: string;
    thumb_uri: string;
    model_urls: {
        gltf: string;
    };
};

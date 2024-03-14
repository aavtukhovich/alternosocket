"use client";

import { createContext, useState, useEffect } from "react";
import { ContractTransactionResponse, EventLog, ethers } from "ethers";
import { axisoClient } from "@/lib/axios";
import { sanitizeAddress } from "@/lib/sanitize";
import { API_URL, REFERRAL_ADDRESS, MATIC_CHAIN, BNB_CHAIN, DEXARTNFT_ADDRESS, MARKETPLACE_ADDRESS, DXA_ADDRESS } from "./constants";
import { fetchCollections, fetchCreated, fetchDexartNFTs, fetchMultiple } from "@/lib/nfts";
import { signInFirebase } from "@/lib/firebase";
import referralAbi from "@/data/referral.json";
import parcelTokenAbi from "@/data/parcelToken.json";
import marketplaceAbi from "@/data/marketplace.json";
import dxaAbi from "@/data/dxa.json";
import { downloadModel, getDownloadChallenge, getLegacyDownloadChallenge, legacyDowloadRequest } from "@/lib/downloads";
import { getCurrentUser } from "@/lib/users";
import { updateNFT } from "@/lib/nfts";

const SystemContext = createContext<SystemContent>({
    walletAddress: null,
    loggedIn: false,
    user: undefined,
    refreshUser: async () => {},
    loading: true,
    getOwnedItems: async () => {},
    ownedNFTs: undefined,
    getDexartItems: async () => {},
    dexartNFTs: undefined,
    getCreatedItems: async () => {},
    createdNFTs: undefined,
    refBalance: undefined,
    getReferralBalance: async () => {},
    handleLogin: async () => {
        return false;
    },
    handleLogout: () => {},
    handleTokenMint: async (collectionAddress: string, collectionSlug: string, tokenId: number, price: number, amount: number) => {
        return;
    },
    handleRefClaim: async () => {
        return;
    },
    handleTokenAdd: async (
        collectionAddress: string,
        collectionSlug: string,
        signature: string,
        price: number,
        maxSupply: number = 0,
        endSale: number = 0
    ) => {
        return 0;
    },
    handleTokenEdit: async (
        nft: NFT,
        collectionAddress: string,
        collectionSlug: string,
        signature: string,
        price: number,
        available: boolean,
        maxSupply?: number,
        endSale?: number
    ) => {
        return;
    },
    setLoading: () => {},
    setReferrer: () => {},
    setUser: () => {},
    showModal: false,
    status: "none",
    modalMessage: undefined,
    modalHeading: undefined,
    closeModal: () => {},
    showErrorMessage: (message?: string, heading?: string) => {},
    startProcessing: (message?: string, heading?: string) => {},
    showSuccessMessage: (message?: string, heading?: string) => {},
    handleDownload: async (nftId: string) => {},
    handleDownloadLegacy: async (nftId: string, email: string) => {},
    handleListingAdd: async (tokenId: number, quantity: number, price: bigint) => {},
    handleDelist: async (listingId: number) => {},
    handleListingEdit: async (listingId: number, price: bigint) => {},
    handleListingBuy: async (listingId: number, price: bigint) => {},
});

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [loggedIn, setLoggedIn] = useState(false);
    const [referrer, setReferrer] = useState<string | null>(null);
    const [refBalance, setRefBalance] = useState<string | null | undefined>(undefined);

    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState<ModalStatus>("none");
    const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
    const [modalHeading, setModalHeading] = useState<string | undefined>(undefined);

    const [loading, setLoading] = useState(true);

    const [ownedNFTs, setOwnedNFTs] = useState<NFT[] | null | undefined>(undefined);
    const [createdNFTs, setCreatedNFTs] = useState<NFT[] | null | undefined>(undefined);
    const [dexartNFTs, setDexartNFTs] = useState<DexArtNFT[] | null | undefined>(undefined);

    //// AUTH ////

    async function handleLogin() {
        try {
            setLoading(true);
            const walletAddress = await handleWalletConnect();
            if (!walletAddress) throw new Error("Please reconnect your wallet");
            const nonce = await getLoginNonce(walletAddress);
            const signedMessage = await signMessage(nonce);
            const result = await handleVerify(walletAddress, signedMessage, referrer);
            setLoading(false);
            return result;
        } catch (err: any) {
            if (err.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(err.message);
            }
            setLoggedIn(false);
            setAccessToken("");
            setUser(null);
            setWalletAddress(null);
            setLoading(false);

            return false;
        }
    }

    async function handleRefresh() {
        try {
            setLoading(true);
            const refreshRes = await axisoClient.get("/login/refresh");
            setAccessToken(`${refreshRes.data.accessToken}`);
            await signInFirebase(refreshRes.data.googleToken);
            setWalletAddress(refreshRes.data.user.wallet);
            setUser(refreshRes.data.user as User);
            setLoggedIn(true);
            setLoading(false);
            return refreshRes.data.accessToken;
        } catch (err: any) {
            if (err.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(err.message);
            }
            setLoggedIn(false);
            setUser(null);
            setAccessToken("");
            setWalletAddress(null);
            setLoading(false);

            return false;
        }
    }

    function handleLogout() {
        setAccessToken("");
        setUser(null);
        setLoggedIn(false);
        setDexartNFTs(undefined);
        setOwnedNFTs(undefined);
        setCreatedNFTs(undefined);
        setRefBalance(undefined);
        setReferrer(null);
        setWalletAddress(null);
        localStorage.removeItem("loggedIn");
        setReferrer(null);
    }

    async function getLoginNonce(address: string) {
        const sanitizedAddress = sanitizeAddress(address);
        const nonceResponse = await axisoClient.get(`${API_URL}/login/${sanitizedAddress}`);
        return nonceResponse.data.nonce;
    }

    async function signMessage(nonce: string) {
        const message = `Log in Alterno\nnonce: ${nonce}`;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signedMessage = await signer.signMessage(message);
        return signedMessage;
    }

    async function handleVerify(address: string, message: string, referrer: string | null) {
        const verifyResponse = await axisoClient.post("/login/verify", { address, message, referrer });
        setUser(verifyResponse.data.user as User);
        setAccessToken(verifyResponse.data.accessToken);
        await signInFirebase(verifyResponse.data.googleToken);
        setLoggedIn(true);
        let date = new Date();
        date.setDate(date.getDate() + 1); //add 1 day
        localStorage.setItem("loggedIn", date.valueOf().toString());
        return true;
    }

    async function getCreatedItems() {
        try {
            if (user) {
                const result = await fetchCreated(user._id);
                setCreatedNFTs(result);
            }
        } catch (err: any) {
            showErrorMessage(err.message);
            setOwnedNFTs(null);
        }
    }

    async function getDexartItems() {
        try {
            if (user) {
                const result = await fetchDexartNFTs(user.wallet);
                setDexartNFTs(result);
            }
        } catch (err: any) {
            showErrorMessage(err.message);
            setDexartNFTs(null);
        }
    }

    async function getOwnedItems() {
        if (!user) return;
        try {
            await assertConnection();
            const collections = await fetchCollections();
            if (!collections || collections.length === 0) throw new Error("Collections not found");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const owned: OwnedNFT[] = [];
            for (let i = 0; i < collections.length; i++) {
                const collection = collections[i];
                const abi = require(`@/data/${collection.slug}.json`);
                const contract = new ethers.Contract(collection.address, abi, provider);
                const result: bigint[] = await contract.totalBalanceOf(user.wallet);
                result.forEach((v, index) => {
                    const amount = parseInt(v.toString());
                    if (amount > 0) owned.push({ collectionId: collection._id, tokenId: index, amount });
                });
            }

            const data = await fetchMultiple(owned);
            setOwnedNFTs(data);
        } catch (err: any) {
            showErrorMessage(err.message);
            setOwnedNFTs(null);
        }
    }

    async function getReferralBalance() {
        if (!user) return;
        try {
            await assertConnection();
            const provider = new ethers.BrowserProvider(window.ethereum);
            const refContract = new ethers.Contract(REFERRAL_ADDRESS, referralAbi, provider);
            const balance: bigint = await refContract.referralBalances(user.wallet);
            setRefBalance(ethers.formatEther(balance));
        } catch (err: any) {
            showErrorMessage(err.message);
            setRefBalance(null);
        }
    }

    //BLOCKCHAIN INTERACTIONS

    async function handleChainSanitation(chainId: string) {
        const currentChain = await window.ethereum.request({ method: "eth_chainId" });

        if (currentChain === chainId) return;

        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId }],
            });
        } catch (err: any) {
            if (err.code === -32002) {
                console.log("Switch chain request already pending. Please wait.");
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait and retry
                return handleChainSanitation(chainId);
                // } else if (err.code === 4001) {
                //     showErrorMessage("Please change your network to Polygon to continue");
                // } else {
                //     showErrorMessage(err.message);
            }
            throw err;
        }
    }

    let sharedConnectionPromise: Promise<string> | null = null;

    async function assertConnection(chain?: string) {
        if (!user) return;
        if (sharedConnectionPromise) {
            // If a shared promise already exists, return it
            return sharedConnectionPromise;
        }

        // Create a new promise for the connection attempt
        sharedConnectionPromise = new Promise<string>(async (resolve, reject) => {
            try {
                const current = await handleWalletConnect(chain);
                console.log(current);
                if (current !== user.wallet) {
                    throw new Error(`Please connect your ${walletAddress} wallet`);
                }
                resolve(current);
            } catch (error: any) {
                reject(error);
            } finally {
                // Reset the shared promise after it's settled
                sharedConnectionPromise = null;
            }
        });
        const result = await sharedConnectionPromise;

        return result;
    }

    async function handleWalletConnect(chain?: string) {
        try {
            if (!window.ethereum) throw new Error("Please install Metamask");
            const wallets: string[] = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log(wallets);
            if (wallets.length === 0) {
                setWalletAddress(null);
                return false;
            }
            await handleChainSanitation(chain || MATIC_CHAIN);
            return wallets[0];
        } catch (err: any) {
            if (err.code === "ACTION_REJECTED") {
                showErrorMessage("You have rejected the connection");
            } else if (err.message) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage(err.code);
            }
            return false;
        }
    }

    async function handleTokenAdd(
        collectionAddress: string,
        collectionSlug: string,
        signature: string,
        price: number,
        maxSupply: number = 0,
        endSale: number = 0
    ) {
        const priceWEI = ethers.parseEther(price.toString());
        const signer = await getSigner();
        const abi = require(`@/data/${collectionSlug}.json`);
        const contract = new ethers.Contract(collectionAddress, abi, signer);
        const response = (await contract.addToken(priceWEI, maxSupply, endSale, signature)) as ContractTransactionResponse;
        const receipt = await response.wait();
        if (!receipt || receipt.status !== 1) throw new Error("Transaction was reverted");
        const events = receipt.logs as EventLog[];
        if (events.length === 0) throw new Error("No events found");
        const tokenId = events[0].args[0] as bigint;
        return parseInt(tokenId.toString());
    }

    async function handleTokenEdit(
        nft: NFT,
        collectionAddress: string,
        collectionSlug: string,
        signature: string,
        price: number,
        available: boolean,
        maxSupply?: number,
        endSale?: number
    ) {
        const priceWEI = ethers.parseEther(price.toString());
        const signer = await getSigner();
        const abi = require(`@/data/${collectionSlug}.json`);
        const contract = new ethers.Contract(collectionAddress, abi, signer);
        const newMaxSuuply = maxSupply ?? nft.maxSupply ?? 0;
        const newEndSale = endSale ?? nft.endSale ?? 0;
        const response = await contract.editToken(nft.tokenId, priceWEI, newMaxSuuply, newEndSale, available, signature);
        const receipt = await response.wait();
        if (!receipt || receipt.status !== 1) throw new Error("Transaction was reverted");
        return;
    }

    async function handleTokenMint(collectionAddress: string, collectionSlug: string, tokenId: number, price: number, amount: number) {
        try {
            startProcessing("Please confirm the transaction...");
            const totalPrice = price * amount;
            const signer = await getSigner();
            const abi = require(`@/data/${collectionSlug}.json`);
            const contract = new ethers.Contract(collectionAddress, abi, signer);
            let res;
            if (user?.referrer) {
                res = await contract.mintReferral(tokenId, amount, user.referrer, {
                    value: ethers.parseEther(totalPrice.toString()),
                });
            } else {
                res = await contract.mint(tokenId, amount, {
                    value: ethers.parseEther(totalPrice.toString()),
                });
            }
            startProcessing("Transaction sent! Waiting for confirmation...");
            const receipt = await res.wait();
            if (receipt.status === 1) {
                showSuccessMessage("Transaction confirmed!");
                getOwnedItems();
                updateNFT(collectionSlug, tokenId);
            } else {
                showErrorMessage("Transaction was reverted :(");
            }
        } catch (err: any) {
            console.log(err);
            if (err.code === -32603) {
                showErrorMessage("Not enough MATIC");
            } else if (err.code === "ACTION_REJECTED" || err.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(err.message);
            }
            return;
        }
    }

    async function handleRefClaim() {
        try {
            startProcessing("Please confirm the claim transaction...");
            if (!refBalance || parseFloat(refBalance) === 0) throw new Error("You can't withdraw");
            const signer = await getSigner();
            const contract = new ethers.Contract(REFERRAL_ADDRESS, referralAbi, signer);
            const res = await contract.withdraw();
            const receipt = await res.wait();
            if (receipt.status === 1) {
                showSuccessMessage("Transaction confirmed!");
                getReferralBalance();
            } else {
                showErrorMessage("Transaction was reverted :(");
            }
        } catch (err: any) {
            console.log(err);
            if (err.code === -32603) {
                showErrorMessage("Not enough MATIC");
            } else if (err.code === "ACTION_REJECTED" || err.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(err.message);
            }
            return;
        }
    }

    async function handleListingAdd(tokenId: number, quantity: number, price: bigint) {
        try {
            //CHECK APPROVAL
            const signer = await getSigner(BNB_CHAIN);
            const nftContract = new ethers.Contract(DEXARTNFT_ADDRESS, parcelTokenAbi, signer);
            const approved = await nftContract.isApprovedForAll(signer.address, MARKETPLACE_ADDRESS);
            if (!approved) {
                startProcessing("Please approve the collection to list on the marketplace...");
                const approveTx = await nftContract.setApprovalForAll(MARKETPLACE_ADDRESS, true);
                startProcessing("Approval transaction sent! Waiting for confirmation...");
                const approveReceipt = await approveTx.wait();
                if (approveReceipt.status !== 1) {
                    throw new Error("Approval transaction reverted.");
                }
            }
            startProcessing("Please approve the listing transaction...");
            const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi, signer);
            const addTx = await marketplaceContract.addListing(tokenId, price, quantity);
            startProcessing("Listing transaction sent! Waiting for confirmation...");
            const receipt = await addTx.wait();
            if (receipt.status === 1) {
                setTimeout(() => {
                    showSuccessMessage("Transaction confirmed!");
                    getDexartItems();
                }, 2000);
            } else {
                showErrorMessage("Transaction was reverted :(");
            }
        } catch (err: any) {
            console.log(err);
            if (err.code === -32603) {
                showErrorMessage("Not enough BNB");
            } else if (err.code === "ACTION_REJECTED" || err.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(err.message);
            }
            return;
        }
    }

    async function handleDelist(listingId: number) {
        try {
            const signer = await getSigner(BNB_CHAIN);
            startProcessing("Please approve the delisting transaction...");
            const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi, signer);
            const delistTx = await marketplaceContract.removeListing(listingId);
            startProcessing("Delisting transaction sent! Waiting for confirmation...");
            const receipt = await delistTx.wait();
            if (receipt.status === 1) {
                setTimeout(() => {
                    showSuccessMessage("Transaction confirmed!");
                    getDexartItems();
                }, 2000);
            } else {
                showErrorMessage("Transaction was reverted :(");
            }
        } catch (err: any) {
            console.log(err);
            if (err.code === -32603) {
                showErrorMessage("Not enough BNB");
            } else if (err.code === "ACTION_REJECTED" || err.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(err.message);
            }
            return;
        }
    }

    async function handleListingEdit(listingId: number, price: bigint) {
        try {
            const signer = await getSigner(BNB_CHAIN);
            startProcessing("Please approve the edit transaction...");
            const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi, signer);
            const delistTx = await marketplaceContract.editListing(listingId, price);
            startProcessing("Edit transaction sent! Waiting for confirmation...");
            const receipt = await delistTx.wait();
            if (receipt.status === 1) {
                setTimeout(() => {
                    showSuccessMessage("Transaction confirmed!");
                    getDexartItems();
                }, 2000);
            } else {
                showErrorMessage("Transaction was reverted :(");
            }
        } catch (err: any) {
            console.log(err);
            if (err.code === -32603) {
                showErrorMessage("Not enough BNB");
            } else if (err.code === "ACTION_REJECTED" || err.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(err.message);
            }
            return;
        }
    }

    async function handleListingBuy(listingId: number, price: bigint) {
        try {
            await assertConnection(BNB_CHAIN);

            //CHECK APPROVAL
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const tokenContract = new ethers.Contract(DXA_ADDRESS, dxaAbi, signer);
            const userBalance = await tokenContract.balanceOf(signer.address);
            if (userBalance < price) throw new Error("Not enough $DXA token");
            const allowance = await tokenContract.allowance(signer.address, MARKETPLACE_ADDRESS);
            if (allowance < price) {
                startProcessing("Please approve the use of $DXA to purchase on the marketplace...");
                const approveTx = await tokenContract.approve(MARKETPLACE_ADDRESS, price + 10000n);
                startProcessing("Approval transaction sent! Waiting for confirmation...");
                const approveReceipt = await approveTx.wait();
                if (approveReceipt.status !== 1) {
                    throw new Error("Approval transaction reverted.");
                }
            }
            startProcessing("Please approve the purchase transaction...");
            const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi, signer);
            const buyTx = await marketplaceContract.buyListing(listingId);
            startProcessing("Listing transaction sent! Waiting for confirmation...");
            const receipt = await buyTx.wait();
            if (receipt.status === 1) {
                showSuccessMessage("Transaction confirmed!");
                setTimeout(() => {
                    getDexartItems();
                }, 2000);
            } else {
                showErrorMessage("Transaction was reverted :(");
            }
        } catch (err: any) {
            if (err.code === -32603) {
                showErrorMessage("Not enough BNB");
            } else if (err.code === "ACTION_REJECTED" || err.code === 4001) {
                showErrorMessage("You have rejected the transaction");
            } else {
                showErrorMessage(err.message);
            }
            return;
        }
    }

    async function getSigner(chainId?: string) {
        if (!user) throw new Error("Please log in");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log(signer.address);
        if (signer.address.toLowerCase() !== user.wallet) throw new Error(`Please connect ${user.wallet} wallet`);
        await handleChainSanitation(chainId || MATIC_CHAIN);
        return signer;
    }

    async function refreshUser() {
        if (!loggedIn || !user) throw new Error("You are not logged in");
        const updated = await getCurrentUser();
        setUser(updated);
    }

    // //FILE DOWNLOAD
    async function handleDownloadLegacy(nftId: string, email: string) {
        try {
            startProcessing("Please confirm the download");
            const { challenge, nonce } = await getLegacyDownloadChallenge(nftId, email);

            const message = `You are approving the download request for email address: ${email}\nnonce: ${nonce}`;
            const signer = await getSigner();
            const signedMessage = await signer.signMessage(message);
            const result = await legacyDowloadRequest(signedMessage, challenge);
            showSuccessMessage("Download Request has been succesffully received!\nWe will get back to you as soon as possible.");
        } catch (error: any) {
            showErrorMessage(error.message);
        }
    }

    async function handleDownload(nftId: string) {
        try {
            startProcessing("Please confirm the download");
            const { challenge, nonce } = await getDownloadChallenge(nftId);
            const message = `You are approving the download request.\nnonce: ${nonce}`;
            const signer = await getSigner();
            const signedMessage = await signer.signMessage(message);
            startProcessing("Prepairing the download");
            await downloadModel(nftId, challenge, signedMessage);
            showSuccessMessage("Your download will start soon.");
        } catch (error: any) {
            showErrorMessage(error.message);
        }
    }

    // PROCESSING

    function closeModal() {
        setStatus("none");
        setModalMessage(undefined);
        setModalHeading(undefined);
    }

    function showErrorMessage(message?: string, heading?: string) {
        setModalMessage(message);
        setModalHeading(heading ?? "Error Occured");
        setStatus("error");
    }

    function startProcessing(message?: string, heading?: string) {
        setModalMessage(message);
        setModalHeading(heading ?? "Processing");
        setStatus("processing");
    }

    function showSuccessMessage(message?: string, heading?: string) {
        setModalMessage(message);
        setModalHeading(heading ?? "Success");
        setStatus("success");
    }

    useEffect(() => {
        const requestIntercept = axisoClient.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axisoClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await handleRefresh();
                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axisoClient(prevRequest);
                }
                if (error?.response?.status === 403 && prevRequest?.sent) {
                    setLoggedIn(false);
                    setAccessToken("");
                    setUser(null);
                    setWalletAddress(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axisoClient.interceptors.request.eject(requestIntercept);
            axisoClient.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken]);

    useEffect(() => {
        async function handleStartupRefresh() {
            const saved = localStorage.getItem("loggedIn");
            if (saved) {
                try {
                    let savedDate = new Date(parseInt(saved));
                    let currentDate = new Date();
                    if (currentDate < savedDate) {
                        await handleRefresh();
                    }
                } catch (err: any) {
                    showErrorMessage(err.message);
                }
            }
            setLoading(false);
        }
        handleStartupRefresh();
    }, []);

    useEffect(() => {
        if (status === "none") {
            setModalMessage(undefined);
            setModalMessage(undefined);
            setShowModal(false);
            return;
        }
        return setShowModal(true);
    }, [status]);

    return (
        <SystemContext.Provider
            value={{
                walletAddress,
                loggedIn,
                user,
                refreshUser,
                loading,
                getOwnedItems,
                ownedNFTs,
                dexartNFTs,
                getDexartItems,
                createdNFTs,
                getCreatedItems,
                getReferralBalance,
                refBalance,
                handleLogin,
                handleLogout,
                handleTokenMint,
                handleTokenAdd,
                handleTokenEdit,
                handleRefClaim,
                setLoading,
                setReferrer,
                setUser,
                showModal,
                status,
                modalMessage,
                modalHeading,
                closeModal,
                showErrorMessage,
                startProcessing,
                showSuccessMessage,
                handleDownload,
                handleDownloadLegacy,
                handleListingAdd,
                handleDelist,
                handleListingEdit,
                handleListingBuy,
            }}
        >
            {children}
        </SystemContext.Provider>
    );
};

export default SystemContext;

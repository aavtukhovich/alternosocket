"use client";
import "@/styles/NFTDisplay.css";
import "@/styles/Dropdown.css";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Dropdown from "react-bootstrap/Dropdown";
import Loading from "../Loading";
import DexArtNFTCard from "./DexArtNFTCard";

import { MARKETPLACE_OPTIONS, SOCKET_URL } from "@/app/context/constants";
import { ethers } from "ethers";
import Link from "next/link";
import IconButton from "../IconButton";
import UserIcon from "@/assets/icons/circle-user-solid.svg";

let socket: Socket;

const DexArtNFTDisplay = () => {
    const [visible, setVisible] = useState(12);
    const [sortSelection, setSortSelection] = useState(MARKETPLACE_OPTIONS[0]);
    const [listings, setListings] = useState<DexArtNFT[] | undefined>(undefined);
    const [displayListings, setDisplayListings] = useState<DexArtNFT[]>([]);
    useEffect(() => {
        socket = io(SOCKET_URL, { withCredentials: true });

        socket.on("update-listings", (updatedItems: Listing[]) => {
            console.log("update");
            console.log(updatedItems);
            const formatted = formatListings(updatedItems);
            setListings(formatted);
            return;
        });

        socket.on("new-listing", (item: Listing) => {
            console.log("new");
            const newListing = formatListing(item);
            setListings((currentItems) => (currentItems ? [...currentItems, newListing] : [newListing]));
            return;
        });

        socket.on("removed-listing", (listingId: number) => {
            console.log("removed");
            setListings((currentItems) => (currentItems ? currentItems.filter((item) => item.listingId !== listingId) : []));
            return;
        });

        socket.on("edited-listing", (listing: Listing) => {
            setListings((currentItems) => {
                if (!currentItems) return [];
                const updated = [...currentItems];
                const formatted = formatListing(listing);
                const index = updated.findIndex((item) => item.listingId === listing.listingId);
                if (index !== -1) updated[index] = { ...updated[index], ...formatted };
                return updated;
            });
        });

        return () => {
            socket.off("update-listings");
            socket.disconnect();
        };
    }, []);

    //// SORT

    useEffect(() => {
        console.log("Sorting");
        let current = listings;
        console.log(current);
        if (listings && listings.length > 0) {
            current = sortListings(sortSelection, listings);
            console.log(current);
        }
        const populated = populateItems(current || []);
        setDisplayListings(populated);
    }, [sortSelection, listings]);

    function sortListings(selection: OrderSortingOption, array: DexArtNFT[]) {
        console.log("Fire");
        if (selection.choice === "ASC") {
            return array.sort((a, b) => {
                if (a.priceNum! > b.priceNum!) return 1;
                if (a.priceNum! < b.priceNum!) return -1;
                return 0;
            });
        } else if (selection.choice === "NEW") {
            return array;
        } else if (selection.choice === "OLD") {
            return array.reverse();
        } else {
            return array.sort((a, b) => {
                if (a.priceNum! > b.priceNum!) return -1;
                if (a.priceNum! < b.priceNum!) return 1;
                return 0;
            });
        }
    }

    ////

    function formatListings(items: Listing[]): DexArtNFT[] {
        return items.map((item) => formatListing(item));
    }

    function formatListing(item: Listing) {
        const formatted: DexArtNFT = {
            ...item,
            active: true,
            priceNum: ethers.parseUnits(item.price, 4),
        };
        return formatted;
    }

    function populateItems(itemArray: DexArtNFT[]) {
        if (itemArray.length >= 12) return itemArray;
        const formatted = [...itemArray];
        const toAdd = 12 - itemArray.length;
        for (let i = 0; i < toAdd; i++) {
            formatted.push({ active: false, listingId: 0, tokenId: 0, quantity: 0, owner: "" });
        }
        return formatted;
    }

    function showMoreItems() {
        setVisible((prevValue) => prevValue + 12);
    }

    return (
        <section className="models-section">
            <div className="models-container">
                <h3>DexArt Marketplace</h3>
                <p className="desc">Buy and Sell your DexArt NFTs using $DXA</p>
                <div className="sort-container dexart">
                    <Link href={"/account?tab=dexart"}>
                        <IconButton text="Your Items" addClass="btn-grad btn-square" icon={<UserIcon />} />
                    </Link>
                    <Dropdown>
                        <Dropdown.Toggle className="btn-drop" id="dropdown-basic">
                            <span>{sortSelection.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {MARKETPLACE_OPTIONS.map((option) => {
                                return (
                                    <Dropdown.Item key={option.choice} onClick={() => setSortSelection(option)}>
                                        <span>{option.name}</span>
                                    </Dropdown.Item>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {listings === undefined ? (
                    <Loading />
                ) : listings === null ? (
                    <h5>Error retrieving data</h5>
                ) : (
                    <>
                        <div className="dexart-display">
                            {displayListings.slice(0, visible).map((listing, index) => (
                                <DexArtNFTCard nft={listing} key={index} />
                            ))}
                        </div>
                        {visible < listings.length ? (
                            <button className="btn-contrast" onClick={showMoreItems}>
                                <span>Explore More</span>
                            </button>
                        ) : null}
                    </>
                )}
            </div>
        </section>
    );
};

export default DexArtNFTDisplay;

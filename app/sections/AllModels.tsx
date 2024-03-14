"use client";
import "@/styles/NFTDisplay.css";
import "@/styles/Dropdown.css";
import { useState, useEffect, Suspense } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import NFTDisplay from "../components/NFTDisplay";
import Image from "next/image";

import CategoryFinder from "../components/finders/CategoryFinder";
import { PRICE_OPTIONS, ORDER_OPTIONS } from "@/app/context/constants";

type Props = {
    nfts: NFT[] | null | undefined;
    categories: Category[];
    heading: string;
    description: string;
    avatar?: string;
};

const AllModels = ({ nfts, categories, heading, description, avatar }: Props) => {
    const [sortSelection, setSortSelection] = useState({
        category: { choice: "ALL", name: "All Categories" },
        price: PRICE_OPTIONS[0],
        order: ORDER_OPTIONS[0],
    });
    const [displayNfts, setDisplayNfts] = useState(nfts);

    function handleCategoryParam(param: string | null) {
        if (!param) return;
        const category = categories.filter((cat) => cat.slug === param);
        if (category.length > 0) setCategoryChoice(param, category[0].name);
    }

    useEffect(() => {
        sortNFTs(sortSelection);
    }, [sortSelection, nfts]);

    function sortNFTs(sortOptions: typeof sortSelection) {
        if (!nfts) return setDisplayNfts(null);
        const categorySorted = sortByCategory(sortOptions.category);
        const priceSorted = sortByPrice(sortOptions.price, categorySorted);
        const orderSorted = sortByOrder(sortOptions.order, priceSorted);
        setDisplayNfts(orderSorted);
    }

    function sortByCategory(categorySelection: CategorySortingOption) {
        if (!nfts) return [];
        const nftCopy = [...nfts];
        if (categorySelection.choice === "ALL") return nftCopy;
        const selected = nftCopy.filter((nft) => nft.categories.some((cat) => cat.slug === categorySelection.choice));
        return selected;
    }

    function sortByPrice(priceSelection: PriceSortingOption, array: NFT[]) {
        if (priceSelection.choice === "ALL") {
            return array;
        } else if (priceSelection.choice === "FREE") {
            return array.filter((nft) => nft.formattedPrice === 0);
        } else if (priceSelection.choice === "20+") {
            return array.filter((nft) => nft.formattedPrice >= 20);
        } else {
            // @ts-ignore
            return array.filter((nft) => nft.formattedPrice >= priceSelection.min && nft.formattedPrice <= priceSelection.max);
        }
    }

    function sortByOrder(orderSelection: OrderSortingOption, array: NFT[]) {
        if (orderSelection.choice === "NEW") return array.sort((a, b) => b.tokenId - a.tokenId);
        else return array.sort((a, b) => a.tokenId - b.tokenId);
    }

    function setCategoryChoice(choice: string, name: string) {
        const newSelection = { ...sortSelection, category: { choice, name } };
        setSortSelection(newSelection);
    }

    function setPriceChoice(choice: PriceSortingOption) {
        const newSelection = { ...sortSelection, price: choice };
        setSortSelection(newSelection);
    }

    function setOrderChoice(choice: OrderSortingOption) {
        const newSelection = { ...sortSelection, order: choice };
        setSortSelection(newSelection);
    }

    return (
        <section className="models-section">
            <div className="models-container">
                <Suspense fallback={null}>
                    <CategoryFinder onCatChange={handleCategoryParam} />
                </Suspense>
                {avatar && <Image src={avatar} height={150} width={150} alt={heading} className="collection-avatar" />}
                <h3>{heading}</h3>
                <p className="desc">{description}</p>
                <div className="sort-container">
                    <Dropdown>
                        <Dropdown.Toggle className="btn-drop" id="dropdown-basic">
                            <span>{sortSelection.category.name}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item key="default" onClick={() => setCategoryChoice("ALL", "All Categories")}>
                                <span>All Categories</span>
                            </Dropdown.Item>
                            {categories.map((cat) => {
                                return (
                                    <Dropdown.Item key={cat.slug} onClick={() => setCategoryChoice(cat.slug, cat.name)}>
                                        <span>{cat.name}</span>
                                    </Dropdown.Item>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle className="btn-drop" id="dropdown-basic">
                            <span>{sortSelection.price.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {PRICE_OPTIONS.map((option) => {
                                return (
                                    <Dropdown.Item key={option.choice} onClick={() => setPriceChoice(option)}>
                                        <span>{option.name}</span>
                                    </Dropdown.Item>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle className="btn-drop" id="dropdown-basic">
                            <span>{sortSelection.order.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {ORDER_OPTIONS.map((option) => {
                                return (
                                    <Dropdown.Item key={option.choice} onClick={() => setOrderChoice(option)}>
                                        <span>{option.name}</span>
                                    </Dropdown.Item>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <NFTDisplay nfts={displayNfts} classType="explore" />
            </div>
        </section>
    );
};

export default AllModels;

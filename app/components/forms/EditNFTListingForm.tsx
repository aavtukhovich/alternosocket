import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";

import SystemContext from "@/app/context/SystemContext";
import InfoTooltip from "../Tooltip";
import Divider from "../Divider";
import Toggle from "../Toggle";

import { sanitizeNftPrice } from "@/lib/sanitize";
import { editNFTListing, getEditSignature } from "@/lib/createNFT";

import type { FormEvent } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { triggerRevalidation } from "@/lib/revalidation";

type Props = {
    collection: Collection;
    nft: NFT;
};

interface NFTEditForm extends EventTarget {
    available: { checked: boolean };
    price: { value: string };
    maxSupply: { value: string };
    maxSupplyActive: { checked: boolean };
    endSale: { value: string };
    endSaleActive: { checked: boolean };
}

const EditNFTListingForm = ({ collection, nft }: Props) => {
    const { showErrorMessage, startProcessing, showSuccessMessage, handleTokenEdit, getCreatedItems } = useContext(SystemContext);
    const router = useRouter();

    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        if (nft.endSale) {
            const saved = new Date(nft.endSale * 1000);
            setEndDate(saved);
        }
    }, [nft]);

    function processDate(savedNFT: NFT, selected: Date) {
        if (savedNFT.endSale) {
            const saved = new Date(savedNFT.endSale * 1000);
            if (selected === saved) return savedNFT.endSale as number;
        }
        if (new Date() >= selected) throw new Error("Sale end must be in the future");
        return selected.valueOf() / 1000;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            startProcessing("Processing information...");
            const form = event.target as NFTEditForm;

            const price = sanitizeNftPrice(parseFloat(form.price.value));

            const maxSupplyActive = form.maxSupplyActive.checked;
            let maxSupply: number | undefined = undefined;
            if (maxSupplyActive) {
                maxSupply = parseInt(form.maxSupply.value);
                if (maxSupply < 1) throw new Error("Max supply cannot be lower than 1");
                if (nft.maxSupply && nft.maxSupply < maxSupply) throw new Error("New max supply cannot be greater than previous");
            }

            const endSaleActive = form.endSaleActive.checked;
            let endSale: number | undefined = undefined;
            if (endSaleActive) {
                endSale = processDate(nft, endDate);
            }

            const available = form.available.checked;

            const editSubmission: NFTEditListingSubmission = {
                price,
                maxSupply,
                endSale,
                available,
            };
            startProcessing("Please confirm the transaction...");
            const signature = await getEditSignature(editSubmission, collection.slug, nft.tokenId);
            await handleTokenEdit(nft, collection.address, collection.slug, signature, price, available, maxSupply, endSale);
            await editNFTListing(editSubmission, collection.slug, nft.tokenId);
            await getCreatedItems();
            await triggerRevalidation("nft");
            showSuccessMessage("Successfully changed listing info!");
            router.push("/account?tab=created");
        } catch (error: any) {
            if (error.code === -32603) {
                showErrorMessage("Not enough MATIC");
            } else if (error.code === "ACTION_REJECTED" || error.code === 4001) {
                showErrorMessage("You have rejected the request");
            } else {
                showErrorMessage(error.message);
            }
        }
    }

    return (
        <div className="edit-content">
            <h3>Edit {collection.name} NFT</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="price">Price in MATIC</label>
                    <input type="number" id="price" min="0" step={0.001} name="price" defaultValue={parseFloat(nft.price.$numberDecimal) ?? 1.0} />
                </div>
                <div className="input-group">
                    <Toggle id="available" labelText="Sale enabled" defaultChecked={nft.available} />
                </div>
                <Divider text="optional" />
                <div className="optionals">
                    <div className="input-group">
                        <label htmlFor="maxSupply">
                            Max supply of NFTs
                            <InfoTooltip>
                                <ul>
                                    <li>Limits the total possible amount of NFTs in existence</li>
                                    <li>IMPORTANT: Can only be lowered once set</li>
                                </ul>
                            </InfoTooltip>
                        </label>
                        <input type="number" id="maxSupply" min="1" step={1} name="maxSupply" defaultValue={nft.maxSupply ?? ""} />
                        <Toggle
                            id="maxSupplyActive"
                            labelText="Use this feature"
                            defaultChecked={typeof nft.maxSupply === "number"}
                            disabled={typeof nft.maxSupply === "number"}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="endSale">
                            Sale End
                            <InfoTooltip>
                                <ul>
                                    <li>Limits the length of the sale</li>
                                    <li>Can be changed in the future</li>
                                </ul>
                            </InfoTooltip>
                        </label>
                        <DatePicker
                            selected={endDate}
                            dateFormat={"dd/MM/yyyy HH:mm"}
                            minDate={new Date()}
                            showTimeSelect
                            id="endSale"
                            name="endSale"
                            onChange={(date) => date && setEndDate(date)}
                        />
                        <Toggle
                            id="endSaleActive"
                            labelText="Use this feature"
                            defaultChecked={typeof nft.endSale === "number"}
                            disabled={typeof nft.endSale === "number"}
                        />
                    </div>
                </div>
                <button type="submit" className="btn-grad">
                    Edit Listing
                </button>
                <Link href="/account?tab=created">
                    <button className="btn-contrast">Cancel</button>
                </Link>
            </form>
        </div>
    );
};

export default EditNFTListingForm;

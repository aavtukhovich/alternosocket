import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import SystemContext from "@/app/context/SystemContext";
import ModelPreview from "@/app/components/ModelPreview";
import Loading from "../Loading";
import InfoTooltip from "../Tooltip";
import Divider from "../Divider";
import Toggle from "../Toggle";
import CloseIcon from "@/assets/icons/xmark-solid.svg";

import { sanitizeDescription, sanitizeNftPrice, sanitizeNftnName, sanitizeTagName } from "@/lib/sanitize";
import { finalizeNftAdd, getAddSignature, newNFTDraft, saveNFTDraft, getDecryptedModelDraftLink } from "@/lib/createNFT";
import { importKey, encryptFile } from "@/lib/crypto";
import { handleFileUpload, uploadFileWithMetadata } from "@/lib/firebase";

import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { triggerRevalidation } from "@/lib/revalidation";
import MagiScanFiles from "./MagiScanFiles";

type Props = {
    collection: Collection;
    draft?: NFTDraft;
    categories: undefined | null | Category[];
    user: User;
};

interface NFTAddForm extends EventTarget {
    title: { value: string };
    price: { value: string };
    description: { value: string };
    categories: { options: HTMLOptionsCollection };
    maxSupply: { value: string };
    maxSupplyActive: { checked: boolean };
    endSale: { value: string };
    endSaleActive: { checked: boolean };
}

const AddNFTForm = ({ collection, draft, categories, user }: Props) => {
    const { showErrorMessage, startProcessing, showSuccessMessage, handleTokenAdd, refreshUser, getCreatedItems } = useContext(SystemContext);
    const router = useRouter();

    const [thumbnailFile, setThumbnailFile] = useState<undefined | File>(undefined);
    const [thumbanilPreview, setThumbanilPreview] = useState<undefined | string | null>(undefined);

    const [modelFile, setModelFile] = useState<undefined | File>(undefined);
    const [modelPreview, setModelPreview] = useState<undefined | string | null>(undefined);

    const [endDate, setEndDate] = useState(new Date());
    const [tags, setTags] = useState<string[]>([]);

    const [modelTab, setModelTab] = useState("file");

    useEffect(() => {
        if (draft) {
            if (draft.tags) setTags(draft.tags);
            if (draft.endSale) {
                const saved = new Date(draft.endSale * 1000);
                if (saved > new Date()) setEndDate(saved);
            }
            if (draft.image) {
                setThumbanilPreview(draft.thumbnail);
            }
            if (draft.model && draft.secret) {
                getDecryptedModelDraftLink().then((url) => setModelPreview(url));
            } else setModelPreview(null);
        }
    }, [draft]);

    const handleThumbnailChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        try {
            const file = event.target.files[0];
            if (!file) throw new Error("No file selected");
            if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
            if (file.size > 1024 * 1024 * 4) throw new Error("File size should be less than 4 MB.");

            const reader = new FileReader();

            await new Promise<void>((resolve) => {
                reader.onload = (event) => {
                    if (!event || !event.target) throw new Error("Error parsing file");
                    const preview = event.target.result as string;
                    setThumbanilPreview(preview);
                    resolve();
                };
                reader.readAsDataURL(file);
            });

            setThumbnailFile(file);
        } catch (err: any) {
            showErrorMessage(err.message);
        }
    };

    const handleModelChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        try {
            const file = event.target.files[0];
            if (!file) throw new Error("No file selected");
            if (file.size > 1024 * 1024 * 50) throw new Error("File size should be less than 50 MB.");

            const url = URL.createObjectURL(file);
            setModelPreview(url);

            setModelFile(file);
        } catch (err: any) {
            showErrorMessage(err.message);
        }
    };

    const handleMagiscanModelSelect = async (event: MouseEvent<HTMLButtonElement>, url: string) => {
        event.preventDefault();
        try {
            startProcessing("Loading model from URL");

            // Fetch the model from the URL
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch the model");
            }

            // Convert response to blob
            const modelBlob = await response.blob();

            // Create a File instance from the blob
            const modelFile = new File([modelBlob], "model.gltf", {
                type: "model/gltf-binary",
            });

            // Update the model file and preview states
            setModelFile(modelFile);
            setModelPreview(URL.createObjectURL(modelFile));
        } catch (error: any) {
            showErrorMessage(error.message);
        } finally {
            showSuccessMessage("Model loaded successfully");
        }
    };

    function handleTagAdd(event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (tags.length >= 10) return;
        try {
            const input = document.getElementById("tag-input") as HTMLInputElement;
            const value = input.value;
            console.log(value);
            const name = sanitizeTagName(value);
            setTags([...tags, name]);
            input.value = "";
        } catch (err: any) {
            showErrorMessage(err.message);
        }
    }

    function handleTagRemove(event: MouseEvent<HTMLSpanElement>, tag: string) {
        event.preventDefault();
        const index = tags.indexOf(tag);
        console.log(index);
        if (index === -1) return;
        const updated = [...tags];
        updated.splice(index, 1);
        setTags(updated);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        /// handle tag add
        if (document.activeElement === document.getElementById("tag-input")) {
            event.preventDefault();
            return handleTagAdd(event);
        }
        try {
            startProcessing("Uploading data to the database.");
            let storedDraft = draft;
            if (storedDraft && !storedDraft.secret) {
                console.log("corrupted draft");
                storedDraft = undefined;
            }
            //Check if everything is added otherwise return
            const form = event.target as NFTAddForm;
            const title = sanitizeNftnName(form.title.value);
            const price = sanitizeNftPrice(parseFloat(form.price.value));
            const description = sanitizeDescription(form.description.value);
            const categoriesSelection = Array.from(form.categories.options)
                .filter((o) => o.selected)
                .map((o) => o.value);
            const maxSupplyActive = form.maxSupplyActive.checked;
            let maxSupply: number | undefined = undefined;
            if (maxSupplyActive) {
                maxSupply = parseInt(form.maxSupply.value);
                if (maxSupply < 1) throw new Error("Max supply cannot be lower than 1");
            }
            const endSaleActive = form.endSaleActive.checked;
            let endSale: number | undefined = undefined;
            if (endSaleActive) {
                if (new Date() >= endDate) throw new Error("Sale end must be in the future");
                endSale = endDate.valueOf() / 1000;
            }
            let DBResult: NFTDraft;
            if (storedDraft) {
                const updated = {
                    ...storedDraft,
                    title,
                    price,
                    description,
                    categories: categoriesSelection,
                    tags,
                    maxSupply,
                    endSale,
                };
                if (!storedDraft.image || thumbnailFile) {
                    console.log("No image saved in DB");
                    if (!thumbnailFile) throw new Error("Please upload thumbnail");
                    const image = await handleFileUpload(thumbnailFile, storedDraft.draftId, `nfts/images/${collection.slug}`);
                    updated.image = true;
                    updated.thumbnail = image.url;
                }
                if (!storedDraft.model || modelFile) {
                    console.log("No model saved in DB");
                    if (!modelFile) throw new Error("Please upload model file");
                    const key = await importKey(storedDraft.secret!);
                    const encryptedData = await encryptFile(modelFile, key);
                    await uploadFileWithMetadata(encryptedData.data, storedDraft.draftId, `nfts/models/${collection.slug}`, encryptedData.iv);
                    updated.model = true;
                }
                DBResult = await saveNFTDraft(updated);
            } else {
                if (!thumbnailFile) throw new Error("Please upload thumbnail");
                if (!modelFile) throw new Error("Please upload model file");
                const draftId = crypto.randomUUID();
                const image = await handleFileUpload(thumbnailFile, draftId, `nfts/images/${collection.slug}`);

                const newDraft: NFTDraft = {
                    draftId,
                    collection: collection.slug,
                    title,
                    price,
                    description,
                    categories: categoriesSelection,
                    tags,
                    maxSupply,
                    endSale,
                    image: true,
                    thumbnail: image.url,
                    model: false,
                };
                const newSaveResult = await newNFTDraft(newDraft);
                if (!newSaveResult) throw new Error("Error uploading draft");
                if (!newSaveResult.secret) throw new Error("No secret found");
                const key = await importKey(newSaveResult.secret);
                const encryptedData = await encryptFile(modelFile, key);
                await uploadFileWithMetadata(encryptedData.data, draftId, `nfts/models/${collection.slug}`, encryptedData.iv);
                const draftAfterModel: NFTDraft = { ...newSaveResult, model: true };
                DBResult = await saveNFTDraft(draftAfterModel);
            }
            if (DBResult) {
                startProcessing("Please approve the transaction to add NFT to the blockchain. Do not close this window...");
                const signature = await getAddSignature(DBResult);
                const tokenId = await handleTokenAdd(collection.address, collection.slug, signature, price, maxSupply, endSale);
                await finalizeNftAdd(DBResult, collection.slug, tokenId);
                await refreshUser();
                await getCreatedItems();
                await triggerRevalidation("nft");
                showSuccessMessage("Successfully added a new NFT!");
                router.push("/account?tab=created");
            }
        } catch (error: any) {
            console.log(error);
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
            <h3>Add new {collection.name} NFT</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="title">
                        NFT title
                        <InfoTooltip>
                            <ul>
                                <li>4 to 40 characters</li>
                                <li>Letters, numbers, and spaces allowed</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    <input type="text" id="title" name="title" defaultValue={draft?.title ?? ""} />
                </div>
                <div className="input-group">
                    <label htmlFor="price">Price in MATIC</label>
                    <input type="number" id="price" min="0" step={0.001} name="price" defaultValue={draft?.price ?? 1.0} />
                </div>
                <div className="input-group">
                    <label htmlFor="description">
                        Model description
                        <InfoTooltip>
                            <ul>
                                <li>Max 200 characters</li>
                                <li>No special characters beside punctuation</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    <textarea id="description" name="description" defaultValue={draft?.description ?? ""} />
                </div>
                <div className="input-group thumbnail">
                    <label htmlFor="thumbanil">
                        Thumbnail image
                        <InfoTooltip>
                            <ul>
                                <li>Max 4Mb images</li>
                                <li>Suggested resoulution: 1024 x 576 px</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    {thumbanilPreview && <Image src={thumbanilPreview} alt="Thumbnail" width={400} height={200} />}
                    <input type="file" accept="image/*" name="thumbanil" onChange={(e) => handleThumbnailChange(e)} />
                </div>
                <div className="input-group model">
                    <label htmlFor="model">
                        Model
                        <InfoTooltip>
                            <ul>
                                <li>Max 50Mb models for uploaded files</li>
                                <li>GLB format</li>
                                <li>You can use your scanned models in MagiScan app</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    {draft || modelFile ? (
                        <div className="model-container">
                            {modelPreview === undefined ? (
                                <Loading />
                            ) : modelPreview === null ? (
                                <p>Error loading model</p>
                            ) : (
                                <ModelPreview url={modelPreview} />
                            )}
                        </div>
                    ) : null}
                    <Tabs id="model-tabs" activeKey={modelTab} onSelect={(k) => setModelTab(k || "file")} className="model-tabs">
                        <Tab eventKey="file" title="Upload File">
                            <input type="file" accept=".glb" name="model" onChange={(e) => handleModelChange(e)} />
                        </Tab>
                        <Tab eventKey="magiscan" title="MagiScan">
                            <MagiScanFiles handleModelSelect={handleMagiscanModelSelect} />
                        </Tab>
                    </Tabs>
                </div>
                <div className="input-group">
                    <label htmlFor="category">
                        Categories
                        <InfoTooltip>
                            <ul>
                                <li>Select by clicking</li>
                                <li>Select multiple by using CMD for Mac or CTRL for PC</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    {categories === undefined ? (
                        <Loading />
                    ) : categories === null ? (
                        <p>Error loading categories</p>
                    ) : (
                        <select multiple id="categories" name="categories" defaultValue={draft?.categories ?? []}>
                            {categories.map((cat) => (
                                <option value={cat._id} key={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="input-group tags">
                    <label>
                        Tags
                        <InfoTooltip>
                            <ul>
                                <li>Max 10 tags</li>
                                <li>Each tag can be 3 to 10 characters</li>
                                <li>Only letters and spaces allowed</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    <ul>
                        {tags.map((tag, index) => {
                            return (
                                <li key={index}>
                                    {tag}
                                    <span onClick={(e) => handleTagRemove(e, tag)}>
                                        <CloseIcon />
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                    <input type="text" name="tag-input" id="tag-input" />
                    <button
                        className={tags.length >= 10 ? "btn-contrast btn-sm btn-disabled" : "btn-contrast btn-sm"}
                        type="button"
                        onClick={handleTagAdd}
                    >
                        Add new tag
                    </button>
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
                        <input type="number" id="maxSupply" min="1" step={1} name="maxSupply" defaultValue={draft?.maxSupply ?? ""} />
                        <Toggle id="maxSupplyActive" labelText="Use this feature" defaultChecked={typeof draft?.maxSupply === "number"} />
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
                        <Toggle id="endSaleActive" labelText="Use this feature" defaultChecked={typeof draft?.endSale === "number"} />
                    </div>
                </div>
                <button type="submit" className="btn-grad">
                    Submit New NFT
                </button>
                <Link href="/account?tab=created">
                    <button className="btn-contrast">Cancel</button>
                </Link>
            </form>
        </div>
    );
};

export default AddNFTForm;

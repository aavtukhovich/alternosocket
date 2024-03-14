import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SystemContext from "@/app/context/SystemContext";
import ModelPreview from "@/app/components/ModelPreview";
import Loading from "../Loading";
import InfoTooltip from "../Tooltip";
import CloseIcon from "@/assets/icons/xmark-solid.svg";

import { sanitizeDescription, sanitizeNftnName, sanitizeObjectIDList, sanitizeTagList, sanitizeTagName } from "@/lib/sanitize";
import { editNFTInfo, getDecryptedModelLink } from "@/lib/createNFT";
import { importKey, encryptFile } from "@/lib/crypto";
import { handleFileUpload, uploadFileWithMetadata } from "@/lib/firebase";

import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { triggerRevalidation } from "@/lib/revalidation";

type Props = {
    collection: Collection;
    nft: NFT;
    categories: undefined | null | Category[];
};

interface NFTEditForm extends EventTarget {
    title: { value: string };
    description: { value: string };
    categories: { options: HTMLOptionsCollection };
}

const EditNFTInfoForm = ({ collection, nft, categories }: Props) => {
    const { showErrorMessage, startProcessing, showSuccessMessage, getCreatedItems } = useContext(SystemContext);
    const router = useRouter();

    const [thumbnailFile, setThumbnailFile] = useState<undefined | File>(undefined);
    const [thumbanilPreview, setThumbanilPreview] = useState<undefined | string | null>(undefined);

    const [modelFile, setModelFile] = useState<undefined | File>(undefined);
    const [modelPreview, setModelPreview] = useState<undefined | string | null>(undefined);

    const [tags, setTags] = useState<string[]>([]);
    const [catSelection, setCatSelection] = useState<string[]>([]);

    useEffect(() => {
        if (nft.tags.length > 0) {
            const mappedTags = nft.tags.map((v) => v.name);
            setTags(mappedTags);
        }
        if (nft.categories.length > 0) {
            const mappedCats = nft.categories.map((v) => v._id);
            setCatSelection(mappedCats);
        }
        getDecryptedModelLink(nft._id).then((url) => setModelPreview(url));
        setThumbanilPreview(nft.thumbnail);
    }, [nft]);

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

    function handleTagAdd(event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (tags.length >= 10) return;
        try {
            const input = document.getElementById("tag-input") as HTMLInputElement;
            const value = input.value;
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

    function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
        const selectedCategories = Array.from(event.target.selectedOptions, (option) => option.value);
        setCatSelection(selectedCategories);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        /// handle tag add
        if (document.activeElement === document.getElementById("tag-input")) {
            event.preventDefault();
            return handleTagAdd(event);
        }
        try {
            startProcessing("Updating database info...");
            if (!nft.secret) throw new Error("Corrupted NFT");
            const form = event.target as NFTEditForm;
            const title = sanitizeNftnName(form.title.value);
            const description = sanitizeDescription(form.description.value);
            const tagsSelection = sanitizeTagList(tags);
            const categoriesSelection = sanitizeObjectIDList(catSelection);
            if (modelFile) {
                const key = await importKey(nft.secret);
                const encryptedData = await encryptFile(modelFile, key);
                await uploadFileWithMetadata(encryptedData.data, nft.model, `nfts/models/${collection.slug}`, encryptedData.iv);
            }
            if (thumbnailFile) {
                await handleFileUpload(thumbnailFile, nft.model, `nfts/images/${collection.slug}`);
            }
            const editSubmission: NFTEditSubmission = {
                title,
                description,
                categories: categoriesSelection,
                tags: tagsSelection,
            };
            await editNFTInfo(editSubmission, collection.slug, nft.tokenId);
            await getCreatedItems();
            await triggerRevalidation("nft");
            showSuccessMessage("Successfully edited NFT information!");
            router.push("/account?tab=created");
        } catch (error: any) {
            console.log(error);
            showErrorMessage(error.message);
        }
    }

    return (
        <div className="edit-content">
            <h3>Edit {collection.name} NFT</h3>
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
                    <input type="text" id="title" name="title" defaultValue={nft.title ?? ""} />
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
                    <textarea id="description" name="description" defaultValue={nft.description ?? ""} />
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
                                <li>Max 50Mb models</li>
                                <li>GLB format</li>
                            </ul>
                        </InfoTooltip>
                    </label>

                    <div>
                        {modelPreview === undefined ? (
                            <Loading />
                        ) : modelPreview === null ? (
                            <p>Error loading model</p>
                        ) : (
                            <ModelPreview url={modelPreview} />
                        )}
                    </div>
                    <input type="file" accept=".glb" name="model" onChange={(e) => handleModelChange(e)} />
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
                        <select multiple id="categories" name="categories" value={catSelection} onChange={handleCategoryChange}>
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
                <button type="submit" className="btn-grad">
                    Edit NFT
                </button>
                <Link href="/account?tab=created">
                    <button className="btn-contrast">Cancel</button>
                </Link>
            </form>
        </div>
    );
};

export default EditNFTInfoForm;

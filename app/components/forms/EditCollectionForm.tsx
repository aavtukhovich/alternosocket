"use client";
import Image from "next/image";
import Avatar from "boring-avatars";

import { useState, useContext, useRef } from "react";
import SystemContext from "@/app/context/SystemContext";
import { updateCollection } from "@/lib/collectionsAPI";
import { handleFileUpload } from "@/lib/firebase";
import InfoTooltip from "../Tooltip";
import Link from "next/link";
import { triggerRevalidation } from "@/lib/revalidation";

import type { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";

type Props = {
    collection: Collection;
    setCollection: Dispatch<SetStateAction<Collection | null | undefined>>;
    user: User;
};

interface CollectionForm extends EventTarget {
    displayName: {
        value: string;
    };
    description: {
        value: string;
    };
}

const EditCollectionForm = ({ collection, user, setCollection }: Props) => {
    const { showErrorMessage, startProcessing, showSuccessMessage, refreshUser } = useContext(SystemContext);
    const [avatarUpload, setAvatarUpload] = useState<undefined | File>(undefined);
    const [avatarPreview, setAvatarPreview] = useState<undefined | string | null>(undefined);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const [nameChange, setNameChange] = useState(false);
    const [descChange, setDescChange] = useState(false);

    function handleClick(event: React.MouseEvent) {
        event.preventDefault();
        inputFileRef.current?.click();
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files) throw new Error("No file selected");
            const file = event.target.files[0];
            if (!file) throw new Error("No file selected");

            if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");

            if (file.size > 1024 * 1024) throw new Error("File size should be less than 1MB.");

            const reader = new FileReader();

            await new Promise<void>((resolve) => {
                reader.onload = (event) => {
                    if (!event || !event.target) throw new Error("Error parsing file");
                    const preview = event.target.result as string;
                    setAvatarPreview(preview);
                    resolve();
                };
                reader.readAsDataURL(file);
            });

            setAvatarUpload(file);
        } catch (err: any) {
            showErrorMessage(err.message);
        }
    };

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!collection || !user) return;
        if (!nameChange && !avatarUpload && !descChange) return;
        try {
            startProcessing("Saving to database...");
            const form = event.target as CollectionForm;
            let collectionObject: CollectionUpdateObject = {};
            if (nameChange) collectionObject.displayName = form.displayName.value;
            if (descChange) collectionObject.description = form.description.value;
            if (avatarUpload !== undefined) {
                const newAvatar = await handleFileUpload(avatarUpload, collection.address, "avatars");
                collectionObject.avatar = newAvatar.url;
            }
            const result = await updateCollection(collection._id, collectionObject);
            setCollection(result);
            setAvatarUpload(undefined);
            setNameChange(false);
            setDescChange(false);
            await refreshUser();
            await triggerRevalidation("collection");
            showSuccessMessage("Successfully updated collection info!");
        } catch (err: any) {
            console.log(err);
            if (err.response) {
                showErrorMessage(err.response.data.message);
            } else {
                showErrorMessage(err.message);
            }
        }
    }

    return (
        <div className="edit-content">
            <h3>Editing Collection: {collection.name}</h3>
            <p>{collection.address}</p>
            <form onSubmit={handleSave}>
                <div className="input-group coll-avatar">
                    <label htmlFor="avatar">
                        Avatar
                        <InfoTooltip>
                            <ul>
                                <li>Max 1Mb images</li>
                                <li>Suggested resoulution: 400px by 400px</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    {avatarUpload && avatarPreview ? (
                        <Image src={avatarPreview} alt={collection.name} width={200} height={200} />
                    ) : collection.avatar ? (
                        <Image src={collection.avatar} alt={collection.name} width={200} height={200} />
                    ) : (
                        <Avatar size={100} name={collection.address} variant="bauhaus" />
                    )}
                    <button className="btn-contrast btn-sm" onClick={handleClick}>
                        Change
                    </button>
                    <input type="file" accept="image/*" ref={inputFileRef} className="hidden-input" onChange={(e) => handleFileChange(e)} />
                </div>
                <div className="input-group">
                    <label htmlFor="displayName">
                        Name
                        <InfoTooltip>
                            <ul>
                                <li>Min 4 characters</li>
                                <li>Max 15 characters</li>
                                <li>Letters, numbers and spaces are allowed</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        defaultValue={collection.displayName ?? collection.name}
                        onChange={() => setNameChange(true)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="collDescription">
                        Description
                        <InfoTooltip>
                            <ul>
                                <li>Max 200 characters</li>
                                <li>No special characters beside punctuation</li>
                            </ul>
                        </InfoTooltip>
                    </label>
                    <textarea
                        id="collDescription"
                        name="description"
                        maxLength={200}
                        defaultValue={collection.description ?? ""}
                        onChange={() => setDescChange(true)}
                    />
                </div>
                <button type="submit" className="btn-grad">
                    Save
                </button>
                <Link href="/account?tab=created">
                    <button className="btn-contrast">Back to Account</button>
                </Link>
            </form>
        </div>
    );
};

export default EditCollectionForm;

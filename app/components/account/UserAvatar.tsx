"use client";
import { ChangeEvent, useContext, useRef } from "react";
import Avatar from "boring-avatars";
import Image from "next/image";
import SystemContext from "@/app/context/SystemContext";
import { updateAvatar } from "@/lib/users";
import { handleFileUpload } from "@/lib/firebase";
import InfoTooltip from "../Tooltip";

type Props = {
    user: User | null;
};

const UserAvatar = ({ user }: Props) => {
    if (!user) return null;
    const { setUser, showErrorMessage, startProcessing, showSuccessMessage } = useContext(SystemContext);
    const inputFileRef = useRef<HTMLInputElement>(null);

    function handleClick(event: React.MouseEvent) {
        event.preventDefault();
        inputFileRef.current?.click();
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        try {
            const file = event.target.files[0];
            if (!file) throw new Error("No file selected");

            if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");

            if (file.size > 1024 * 1024) throw new Error("File size should be less than 1MB.");

            startProcessing("Uploading your new avatar...");
            const newAvatar = await handleFileUpload(file, user.wallet, "avatars");
            const updatedUser = await updateAvatar(newAvatar.url);
            if (updatedUser === null) window.alert("Error uploading");
            setUser(updatedUser);
            showSuccessMessage("Avatar set successfully!");
        } catch (err: any) {
            showErrorMessage(err.message);
        }
    };

    return (
        <div className="input-group avatar">
            <label htmlFor="avatar">
                Avatar
                <InfoTooltip>
                    <ul>
                        <li>Max 1Mb images</li>
                        <li>Suggested resoulution: 80px by 80px</li>
                    </ul>
                </InfoTooltip>
            </label>
            {user.avatar ? (
                <Image src={user.avatar} alt={"Avatar"} width={100} height={100} />
            ) : (
                <Avatar size={100} name={user.wallet} variant="beam" />
            )}
            <button className="btn-contrast btn-sm" onClick={handleClick}>
                Change
            </button>
            <input type="file" accept="image/*" ref={inputFileRef} className="hidden-input" onChange={(e) => handleFileChange(e)} />
        </div>
    );
};

export default UserAvatar;

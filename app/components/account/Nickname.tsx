"use client";
import "@/styles/Forms.css";
import { checkNickname, updateNickname } from "@/lib/users";
import { sanitizeNickname } from "@/lib/sanitize";
import { ChangeEvent, useState } from "react";
import { useEffect, useContext } from "react";
import SystemContext from "@/app/context/SystemContext";
import InfoTooltip from "../Tooltip";

type Props = {
    user: User;
};

const Nickname = ({ user }: Props) => {
    const { setUser, showErrorMessage, startProcessing, showSuccessMessage } = useContext(SystemContext);
    const [nickname, setNickname] = useState(user.nickname ?? "");
    const [nicknameQuery, setNicknameQuery] = useState("");
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (nickname.length === 0) return;
        const timeOutId = setTimeout(() => handleNicknameQueryChange(nickname), 500);
        return () => {
            clearTimeout(timeOutId);
            setNicknameQuery(user.nickname ?? "");
        };
    }, [nickname]);

    function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const name = event.target.value;
        setNickname(name);
    }

    async function handleNicknameQueryChange(name: string) {
        if (name === "" || name === user.nickname) return;
        if (!sanitizeNickname(name)) {
            showNicknameError("Not a valid nickname");
        } else {
            removeNicknameError();
            const check = document.getElementById("checking-message") as HTMLParagraphElement;
            setProcessing(true);
            const available = await checkNickname(name);
            setProcessing(false);
            if (available) {
                setNicknameQuery(name);
            } else {
                showNicknameError("Nickame is taken");
            }
        }
    }

    async function handleSave() {
        try {
            if (!sanitizeNickname(nicknameQuery)) throw new Error("Not a valid nickname");
            startProcessing("Updating your username...");
            const updatedUser = await updateNickname(nicknameQuery);
            if (updatedUser === null) return window.alert("Error updating data");
            setUser(updatedUser);
            showSuccessMessage("Username changed successfully!");
        } catch (err: any) {
            showErrorMessage(err.message);
        }
    }

    function showNicknameError(message: string) {
        const input = document.getElementById("nickname-input") as HTMLInputElement;
        const errMessage = document.getElementById("error-message") as HTMLParagraphElement;
        setNicknameErrorMessage(message);
        if (!input.classList.contains("input-danger")) input.classList.toggle("input-danger");
        if (errMessage.classList.contains("hidden")) errMessage.classList.toggle("hidden");
    }

    function removeNicknameError() {
        const input = document.getElementById("nickname-input") as HTMLInputElement;
        const errMessage = document.getElementById("error-message") as HTMLParagraphElement;
        setNicknameErrorMessage("");
        if (input.classList.contains("input-danger")) input.classList.toggle("input-danger");
        if (!errMessage.classList.contains("hidden")) errMessage.classList.toggle("hidden");
    }

    return (
        <div className="info">
            <div className="input-group">
                <label htmlFor="nickname">
                    Username
                    <InfoTooltip>
                        <ul>
                            <li>Min 5 characters</li>
                            <li>Max 15 characters</li>
                            <li>Letters, numbers and dashes are allowed</li>
                        </ul>
                    </InfoTooltip>
                </label>
                <input
                    type="text"
                    id="nickname-input"
                    name="nickname"
                    placeholder="Enter your username"
                    defaultValue={nickname}
                    onChange={handleNicknameChange}
                />
                <button
                    className={processing ? "btn-contrast btn-sm btn-disabled" : "btn-contrast btn-sm"}
                    onClick={handleSave}
                    disabled={processing}
                >
                    Save
                </button>
                <p id="error-message" className="error-message hidden">
                    Error: {nicknameErrorMessage}
                </p>
            </div>
        </div>
    );
};

export default Nickname;

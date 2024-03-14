"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import SystemContext from "@/app/context/SystemContext";
import IconButton from "../IconButton";
import WalletIcon from "@/assets/icons/wallet-solid.svg";
import UserIcon from "@/assets/icons/user-solid.svg";
import UserDisplay from "./UserDisplay";

const ConnectWallet = () => {
    const { loggedIn, loading, handleLogin, user } = useContext(SystemContext);
    const router = useRouter();
    function handleRouting() {
        if (typeof window !== "undefined") {
            if (window.screen.width < 750) {
                const button = document.getElementById("btn-toggle");
                const menu = document.getElementById("main-menu");
                button?.classList.toggle("active");
                menu?.classList.toggle("active");
            }
        }
        router.push("/account");
    }
    return (
        <>
            {loading ? (
                <IconButton icon={<WalletIcon />} addClass="btn-grad btn-connect" text="Connecting..." />
            ) : !user ? (
                <IconButton icon={<WalletIcon />} addClass="btn-grad btn-connect" customClickEvent={handleLogin} text="Connect Wallet" />
            ) : (
                <UserDisplay user={user} customClickEvent={handleRouting} />
            )}
        </>
    );
};

export default ConnectWallet;

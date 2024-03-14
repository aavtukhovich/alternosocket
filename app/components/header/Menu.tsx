"use client";
import { useEffect, useRef } from "react";
import Navigation from "./Navigation";
import ConnectWallet from "./ConnectWallet";
import DarkMode from "./DarkMode";

const Menu = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    function handleClick(target: any) {
        if (typeof window !== "undefined") {
            if (window.screen.width < 750) {
                const button = document.getElementById("btn-toggle");
                if (target === button) return;
                const menu = document.getElementById("main-menu");
                button?.classList.toggle("active");
                menu?.classList.toggle("active");
            }
        }
    }

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            const menu = document.getElementById("main-menu");
            if (menu && menu.classList.contains("active") && !ref.current?.contains(event.target)) {
                handleClick(event.target);
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [ref]);

    return (
        <div className="menu" id="main-menu" ref={ref}>
            <Navigation />
            <div className="buttons-box">
                <ConnectWallet />
                <DarkMode />
            </div>
        </div>
    );
};

export default Menu;

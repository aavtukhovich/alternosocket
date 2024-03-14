"use client";
import "@/styles/CookiesBanner.css";
import { useState, useEffect } from "react";

type Props = {
    heading: string;
    text: string;
};

const CookiesBanner = ({ heading, text }: Props) => {
    const [consent, setConsent] = useState(getLocalStorage());

    function getLocalStorage() {
        let savedValue: string | null;
        if (typeof window !== "undefined") {
            savedValue = localStorage.getItem("cookies-consent");
        } else {
            savedValue = null;
        }

        return savedValue !== null && savedValue !== "undefined" ? Boolean(savedValue) : false;
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setConsent(true);
        localStorage.setItem("cookies-consent", "true");
        document.getElementById("cookie-banner")?.classList.remove("active");
    }

    useEffect(() => {
        if (!consent) {
            document.getElementById("cookie-banner")?.classList.add("active");
        }
    }, [consent]);

    return (
        <div className="cookie-banner" id="cookie-banner">
            <div>
                <h5>{heading}</h5>
                <p>{text}</p>
            </div>
            <button className="btn-contrast" onClick={handleClick}>
                Ok
            </button>
        </div>
    );
};

export default CookiesBanner;

"use client";
import { Suspense, useEffect, useState } from "react";
import IconButton from "../IconButton";
import SunIcon from "@/assets/icons/sun-svgrepo-com.svg";

const DarkMode = () => {
    let savedTheme: string;
    if (typeof window !== "undefined") {
        savedTheme = localStorage.getItem("theme") || "dark";
    } else {
        savedTheme = "dark";
    }
    const [theme, setTheme] = useState<string>(savedTheme);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.dataset.theme = theme;
    }, [theme]);

    function handleSwitch() {
        const updated = theme === "dark" ? "light" : "dark";
        setTheme(updated);
    }

    return (
        <Suspense>
            <IconButton icon={<SunIcon />} customClickEvent={handleSwitch} addClass="btn-mode" />
        </Suspense>
    );
};

export default DarkMode;

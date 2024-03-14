"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuDropdown from "../MenuDropdown";

const Navigation = () => {
    const pathname = usePathname();

    function handleClick() {
        if (typeof window !== "undefined") {
            if (window.screen.width < 750) {
                const button = document.getElementById("btn-toggle");
                const menu = document.getElementById("main-menu");
                button?.classList.toggle("active");
                menu?.classList.toggle("active");
            }
        }
    }
    return (
        <nav>
            <Link onClick={handleClick} className={pathname === "/" ? "current" : undefined} href="/">
                Home
            </Link>
            <MenuDropdown customClickEvent={handleClick} />
            <Link onClick={handleClick} className={pathname === "/faq" ? "current" : undefined} href="/faq">
                FAQ
            </Link>
        </nav>
    );
};

export default Navigation;

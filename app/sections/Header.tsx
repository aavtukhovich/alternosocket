import "@/styles/Header.css";
import Link from "next/link";
import Menu from "../components/header/Menu";
import SearchBox from "../components/header/SearchBox";
import MobileMenuButton from "../components/header/MobileMenuButton";
import SystemModal from "../components/header/SystemModal";
import { fetchNFTs, fetchCategories } from "@/lib/nfts";

const Header = async () => {
    const nfts = await fetchNFTs();
    const categories = await fetchCategories();

    return (
        <div className="header">
            <SystemModal />
            <div className="header-content">
                <Link href="/" className="logo" />
                <SearchBox nfts={nfts ?? []} categories={categories} />
                <Menu />
                <MobileMenuButton />
            </div>
        </div>
    );
};

export default Header;

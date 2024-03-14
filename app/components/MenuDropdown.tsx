"use client";
import Dropdown from "react-bootstrap/Dropdown";
import "@/styles/Dropdown.css";
import "@/styles/MenuDropdown.css";
import Link from "next/link";

type Props = {
    customClickEvent: any;
};

const MenuDropdown = ({ customClickEvent }: Props) => {
    return (
        <Dropdown className="nav-drop">
            <Dropdown.Toggle>Explore</Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item as={Link} onClick={customClickEvent} href={"/collections/all"}>
                    All Collections
                </Dropdown.Item>
                <Dropdown.Item as={Link} onClick={customClickEvent} href="/collections/alterno">
                    Alterno Specials
                </Dropdown.Item>
                <Dropdown.Item as={Link} onClick={customClickEvent} href="/dexmarket">
                    DexArt Marketplace
                </Dropdown.Item>
                <Dropdown.Item as={Link} onClick={customClickEvent} href="/collections/community">
                    Community
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default MenuDropdown;

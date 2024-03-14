"use client";
import "@/styles/Accordion.css";
import { useState } from "react";
import CaretIcon from "@/assets/icons/angle-down-solid.svg";

type Props = {
    heading: string;
    content: string;
    isActive?: boolean;
};

const Accordion = ({ heading, content, isActive }: Props) => {
    const [active, setActive] = useState(isActive ? isActive : false);

    function handleClick() {
        setActive((prev) => !prev);
    }
    return (
        <div className={active ? "accordion active" : "accordion"}>
            <div onClick={handleClick}>
                <h5>{heading}</h5>
                <CaretIcon />
            </div>
            <p>{content}</p>
        </div>
    );
};

export default Accordion;

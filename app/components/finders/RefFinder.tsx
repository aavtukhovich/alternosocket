"use client";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import SystemContext from "../../context/SystemContext";
import { useEffect } from "react";

const RefFinder = () => {
    const searchParams = useSearchParams();
    const { setReferrer } = useContext(SystemContext);
    useEffect(() => {
        const ref = searchParams.get("ref");
        setReferrer(ref);
    }, []);
    return null;
};

export default RefFinder;

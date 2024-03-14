"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {
    onTabChange: (tab: string) => void;
};

const TabFinder = ({ onTabChange }: Props) => {
    const params = useSearchParams();

    useEffect(() => {
        const selected = params.get("tab");
        if (selected) {
            onTabChange(selected);
        } else {
            onTabChange("collected");
        }
    }, [params]);

    return null;
};

export default TabFinder;

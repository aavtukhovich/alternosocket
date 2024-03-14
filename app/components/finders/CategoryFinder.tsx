"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {
    onCatChange: (cat: string) => void;
};

const CategoryFinder = ({ onCatChange }: Props) => {
    const params = useSearchParams();

    useEffect(() => {
        const selected = params.get("category");
        if (selected) {
            onCatChange(selected);
        }
    }, [params]);
    return null;
};

export default CategoryFinder;

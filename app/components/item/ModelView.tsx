"use client";
import { useState } from "react";
import { API_URL } from "@/app/context/constants";
import Loading from "../Loading";

type Props = {
    slug: string;
    tokenId: string;
};

const ModelView = ({ slug, tokenId }: Props) => {
    const [loading, setLoading] = useState(true);

    const handleLoad = () => {
        setLoading(false);
    };

    const handleError = () => {
        setLoading(false); // Hide loading on error as well
        console.error("Error loading iframe content.");
    };

    return (
        <div className="model-container custom">
            {loading && <Loading />}
            <iframe
                className={loading ? "model-preview hidden" : "model-preview"}
                src={`${API_URL}/preview/${slug}/${tokenId}`}
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};

export default ModelView;

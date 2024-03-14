import "@/styles/LoadingSmall.css";
import { type } from "os";

import React from "react";

type Props = {
    id?: string;
    addClass?: string;
};

const LoadingSmall = ({ id, addClass }: Props) => {
    return (
        <div className={addClass ? "loading-sm " + addClass : "loading-sm"} id={id}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default LoadingSmall;

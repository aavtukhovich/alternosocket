"use client";
import "@/styles/Tickers.css";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Ticker from "../components/Ticker";
import { TICKER_HEADING, TICKER_DESCRIPTION } from "@/data/Texts";
import RocketImg from "@/assets/images/rocket.png";

const Tickers = () => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const element = elementRef.current;
            if (element) {
                const { top, bottom } = element.getBoundingClientRect();
                const newIsVisible = top < window.innerHeight && bottom >= 0;
                if (newIsVisible && !isVisible) {
                    setIsVisible(newIsVisible);
                    window.removeEventListener("scroll", handleScroll);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isVisible]);

    return (
        <section className="tickers-home">
            <div ref={elementRef} className="tickers-container">
                <div className="tickers-content">
                    <h3>{TICKER_HEADING}</h3>
                    <p>{TICKER_DESCRIPTION}</p>
                    <div className="ticker-container">
                        <h3>
                            <Ticker isCounting={isVisible} start={700} end={1800} duration={3} addText={"k"} /> Models created
                        </h3>
                    </div>
                    <div className="ticker-container">
                        <h3>
                            <Ticker isCounting={isVisible} start={0} end={20} duration={3} /> Metaverse Partnerships
                        </h3>
                    </div>
                    <div className="ticker-container">
                        <h3>
                            <Ticker isCounting={isVisible} start={10} end={200} duration={3} addText={"k"} /> Purchases by Clients
                        </h3>
                    </div>
                </div>
                <Image src={RocketImg} alt="Rocket" />
            </div>
        </section>
    );
};

export default Tickers;

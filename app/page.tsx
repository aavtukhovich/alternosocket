import HeroBanner from "./sections/HeroBanner";
import PopularModels from "./sections/PopularModels";
import LatestModels from "./sections/LatestModels";
import Tickers from "./sections/Tickers";
import Partners from "./sections/Partners";
import RefFinder from "./components/finders/RefFinder";
import { Suspense } from "react";

export default function Home() {
    return (
        <>
            <HeroBanner />
            <section className="latest-home">
                <LatestModels />
            </section>
            <Tickers />
            <section className="popular-home">
                <PopularModels />
            </section>
            <Partners />
            <Suspense fallback={null}>
                <RefFinder />
            </Suspense>
        </>
    );
}

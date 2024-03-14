import "@/styles/HeroBanner.css";
import Image from "next/image";
import { HERO_HEADING, HERO_DESCRIPTION } from "@/data/Texts";
import IconButton from "../components/IconButton";
import ExploreIcon from "@/assets/icons/magnifying-glass-arrow-right-solid.svg";

import img1 from "@/assets/slider/img-1.jpg";
import img2 from "@/assets/slider/img-2.jpg";
import img3 from "@/assets/slider/img-3.jpg";
import Link from "next/link";

const HeroBanner = () => {
    return (
        <section className="hero-container">
            <div className="overlay"></div>
            <div className="hero-content">
                <div className="hero-text">
                    <h1>{HERO_HEADING}</h1>
                    <h5>{HERO_DESCRIPTION}</h5>
                    <Link href={"/collections/all"}>
                        <IconButton addClass="btn-contrast btn-hero" text="Explore" icon={<ExploreIcon />} />
                    </Link>
                </div>
                <div className="hero-img-container">
                    <div className="img-left">
                        <div className="img1">
                            <Image src={img1} alt="Best" width={240} />
                        </div>
                        <div>
                            <Image src={img2} alt="3D" width={240} />
                        </div>
                    </div>
                    <div className="img-right">
                        <Image src={img3} alt="Models" width={280} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;

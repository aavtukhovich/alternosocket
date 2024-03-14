"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/a11y";
import "swiper/css/grid";
import { Navigation, A11y, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import NFTCard from "../NFTCard";

type Props = {
    nfts: NFT[];
};

const PopularSlider = ({ nfts }: Props) => {
    return (
        <Swiper
            modules={[Navigation, A11y, Grid]}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                    grid: { rows: 2 },
                },
                730: {
                    slidesPerView: 2,
                    grid: { rows: 2 },
                },
                900: {
                    slidesPerView: 3,
                    grid: { rows: 2 },
                },
                1300: {
                    slidesPerView: 4,
                    grid: { rows: 2 },
                },
                1500: {
                    slidesPerView: 5,
                    grid: { rows: 2 },
                },
            }}
            navigation
        >
            {nfts.map((nft, index) => {
                return (
                    <SwiperSlide key={index}>
                        <NFTCard nft={nft} />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default PopularSlider;

"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import NFTCard from "../NFTCard";

type Props = {
    nfts: NFT[];
};

const LatestSwiper = ({ nfts }: Props) => {
    return (
        <Swiper
            modules={[Navigation, Pagination, A11y]}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                },
                730: {
                    slidesPerView: "auto",
                },
            }}
            navigation
            pagination={{ clickable: true }}
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

export default LatestSwiper;

"use client";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {
    partners: PartnersItem[];
};

const PatnersSlider = ({ partners }: Props) => {
    return (
        <div className="partners-slider">
            <Swiper
                speed={5000}
                modules={[Autoplay]}
                breakpoints={{
                    0: { slidesPerView: 3 },
                    630: { slidesPerView: 6 },
                }}
                spaceBetween={10}
                loop
                autoHeight
                autoplay={{ delay: 0, disableOnInteraction: false }}
            >
                {partners.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className="slide-content">
                                <Image src={item.image} alt={item.name} width={150} height={150} />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default PatnersSlider;

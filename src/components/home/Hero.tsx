"use client";

import { Swiper, SwiperSlide } from "swiper/react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Modules
import { Mousewheel, Pagination, Autoplay } from "swiper/modules";

const items = [
  { img: "/images/hero/hero-1.jpg" },
  { img: "/images/hero/hero-2.jpg" },
  { img: "/images/hero/hero-3.jpg" },
];

export default function Hero() {
  return (
    <div className="hero h-[500px] w-full">
      <Swiper
        direction={"vertical"}
        slidesPerView={1}
        spaceBetween={30}
       /*  mousewheel={true} */
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Mousewheel, Pagination, Autoplay]}
        className="h-full w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">

              {/* IMAGE */}
              <img
                src={item.img}
                alt={`Hero ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* CONTENT */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">

                  {/* TAG */}
                  <p className="uppercase tracking-[4px] text-[#7aa209] font-semibold mb-3">
                    100% Organic Food
                  </p>

                  {/* TITLE */}
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    Fresh & Healthy Organic Products
                  </h1>

                  {/* DESCRIPTION */}
                  <p className="text-gray-200 mb-6 text-sm md:text-base">
                    Eat fresh, live healthy. We provide natural organic food directly
                    from farms to your home with no chemicals and no preservatives.
                  </p>

                  {/* BUTTON */}
                  <button className="bg-[#7aa209] hover:bg-green-700 transition text-white px-8 py-3 rounded-full font-semibold">
                    Shop Now
                  </button>

                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
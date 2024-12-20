"use client";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { BsChevronCompactDown } from "react-icons/bs";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./navbar";
import { Skeleton } from "./ui/skeleton";

const Hero = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const [images, setImages] = useState<string[]>([]);
  const [scrollPos, setScrollPos] = useState(0); // Track scroll position

  const fetchHeroImages = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-images?populate[heroImages][fields][0]=url&populate[heroImages][fields][1]=alternativeText`
      );
      const data = await res.json();
      const imageUrls = data.data[0]?.heroImages?.map((imgObj: any) => {
        const imgUrl = imgObj.url.startsWith("http")
          ? imgObj.url
          : `${process.env.NEXT_PUBLIC_BASE_URL}${imgObj.url}`;
        return imgUrl;
      });
      console.log("Clean Image URLs:", imageUrls);
      setImages(imageUrls || []);

      console.log("images are ", imageUrls);

      setImages(imageUrls || []);
    } catch (error) {
      console.error("Error fetching hero images:", error);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollPos(scrollY); // Update scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (inView) {
    controls.start("visible");
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
  };

  // Calculate zoom scale for the image container based on scroll
  const zoomScale = Math.max(1 - scrollPos / 1000, 0.8);

  return (
    <div>
      <div className="flex w-full items-center h-screen justify-center ">
        {/* Zoom effect applied to image container */}
        <div
          className="relative h-screen w-full overflow-hidden "
          style={{
            // transform: `scale(${zoomScale})`,
            // transition: "transform 0.2s ease-out", // Smooth transition
            width: "100vw",
            height: "100vh",
          }}
        >
          {/* Slider */}
          {images.length > 0 ? (
            <Slider {...settings}>
              {images.map((img, i) => (
                <div key={i} className="flex w-full relative">
                  <img
                    src={img}
                    alt={`Slide ${i + 1}`}
                    className="w-full h-screen lg:h-auto object-cover object-center"
                    style={{
                      // Adjust as needed
                      overflow: "hidden",
                    }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="flex flex-col gap-4">
              <Skeleton className="w-full h-[400px]" />
              <Skeleton className="w-full h-[50px]" />
            </div>
          )}

          {/* Animated Text */}
          <motion.div
            className="absolute bg-black bg-opacity-30 top-0 left-0 w-full h-full flex px-8 md:px-20 xl:px-40"
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -100 },
            }}
            transition={{ duration: 1 }}
          >
            <div className="flex px-2 md:px-4 gap-[20px] flex-col w-full justify-center items-center">
              <p className="text-white text-[16px] md:text-[36px]">
                <strong className="text-[#A8CF45] w-full">SOLVE</strong> -
                Solutions for Livestock <br /> Value-added Enterprises
              </p>
              {/* <p className="text-white md:w-[60%] w-full">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Adipisci doloremque tempora quae, laborum sunt quam rerum magnam
                itaque impedit dolorem!
              </p> */}

              {/* <a href="/projects">
                <button className="bg-LG text-white py-2 px-2 md:mb-0 mb-2 md:px-3 text-[13px] md:text-lg rounded-lg">
                  Explore More
                </button>
              </a> */}
            </div>
          </motion.div>

          {/* Bouncing Icon */}
          <div className="absolute bottom-32 w-full flex animate-bounce justify-center items-center">
            <BsChevronCompactDown className="text-white text-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

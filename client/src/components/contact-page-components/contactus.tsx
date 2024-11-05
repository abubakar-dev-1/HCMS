"use client";
import ContactComp from "./contactComp";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div
      className="relative w-full flex flex-col  lg:flex-row h-screen bg-cover justify-center bg-center"
      style={{ backgroundImage: "url(/contactus/contactimg.jpeg)" }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Centered Text Div */}
      <div className="relative inset-0 flex flex-col items-center justify-center  z-[100] text-white">
        <h1 className="text-[36px] font-[500] mb-4">Contact Us</h1>
        <p className="text-white text-[16px] max-w-[460px] px-2 md:px-0">
        We're here to help with all your dairy and agricultural needs. Reach out to us for expert guidance and personalized solutions.
        </p>
      </div>

      {/* Centered Contact Form */}
      {/* <div className="relative z-10 pb-3 w-[100%] mb-3 lg:mb-0 flex justify-center lg:justify-end items-center lg:items-end">
        <ContactComp />
      </div> */}
    </div>
  );
};

export default Contact;

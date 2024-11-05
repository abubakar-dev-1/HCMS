"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ServiceData } from "@/types/all-types";
import qs from "qs";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import { ArrowRight } from 'lucide-react';

const getImageUrl = (imageUrl: string | undefined): string =>
  imageUrl?.startsWith("http")
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl || "/fallback-image.jpg"}`;

export default function ServicePage() {
  const params = useParams();
  const serviceId = Array.isArray(params?.documentId) ? params.documentId[0] : params?.documentId;
  const router = useRouter();

  const [service, setService] = useState<ServiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<BlocksContent | null>(null);
  const [about, setAbout] = useState<BlocksContent | null>(null);
  const [advertisement, setAdvertisement] = useState<BlocksContent | null>(null);

  useEffect(() => {
    if (serviceId) {
      fetchService(serviceId);
    }
  }, [serviceId]);

  async function fetchService(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const path = `/api/services/${id}`;
      const url = new URL(path, baseUrl);
  
      url.search = qs.stringify({
        populate: {
          serviceImage: { fields: ["url", "alternativeText"] },
          heroImage: { fields: ["url", "alternativeText"] },
          ctaImage: { fields: ["url", "alternativeText"] },
        },
      });
  
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch service");
  
      const data = await res.json();
      setService(data.data);
      setContent(data.data.serviceContent || null);
      setAbout(data.data.serviceAbout || null);
      setAdvertisement(data.data.serviceAd || null);
    } catch (error) {
      const errMessage = (error as Error).message || "An error occurred while fetching the service.";
      console.error("Error fetching service:", errMessage);
      setError(errMessage);
    }
  }

  return (
    <>
      <main className="flex flex-col gap-8 md:gap-20 mb-9 md:mb-20">
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <div className="h-screen flex items-center justify-center relative w-full overflow-hidden">
              <img
                src={getImageUrl(service?.heroImage?.url)}
                alt={service?.heroImage?.alternativeText || service?.heroHeadings}
                className="object-cover w-full h-full"
                onError={(e) => {
                  console.error("Image failed to load:", service?.heroImage?.url);
                  e.currentTarget.src = "/fallback-image.jpg";
                }}
              />
              <h1 className="absolute top-[50%] w-full text-center left-1/2 -translate-x-1/2 text-2xl md:text-5xl text-white font-semibold tracking-wide">
                {service?.heroHeadings}
              </h1>
            </div>

            <div className="px-4 md:px-20 w-full flex flex-col md:flex-row justify-between md:gap-20 gap-5">
              <div className="w-[100%] rounded-lg flex gap-20">
                <img
                  src={getImageUrl(service?.serviceImage?.url)}
                  alt={service?.serviceImage?.alternativeText || service?.heroHeadings}
                  className="w-full md:w-[100%] rounded-lg"
                  onError={(e) => {
                    console.error("Image failed to load:", service?.serviceImage?.url);
                    e.currentTarget.src = "/fallback-image.jpg";
                  }}
                />
              </div>
              <div className="w-full md:w-[50%] py-0 md:py-16">
                {about ? renderDescription(about) : <p>No about content available.</p>}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start bg-LG py-8 items-start md:px-24 px-4">
              <div className="md:w-[70%] w-full">
                {content ? renderDescription(content) : <p>No content available.</p>}
              </div>
            </div>

            <div className="px-4 md:px-20 w-full flex flex-col md:flex-row gap-5 md:gap-12">
              
              <div className="w-full self-center">
                {advertisement ? renderDescription(advertisement) : <p>No about content available.</p>}
              </div>
                <img
                  src={getImageUrl(service?.ctaImage?.url)}
                  alt={service?.ctaImage?.alternativeText || service?.heroHeadings}
                  className="w-full md:w-[60%] rounded-lg"
                  onError={(e) => {
                    console.error("Image failed to load:", service?.ctaImage?.url);
                    e.currentTarget.src = "/fallback-image.jpg";
                  }}
                />
            </div>
          </>
        )}
      </main>
      <div className="flex md:flex-row flex-col justify-between bg-[#A8CF45]">
        <div className="w-full self-center px-3 md:px-16">
              <h1 className="text-[29px] md:text-[36px] font-[600]">Let’s join hands for a sustainable economy</h1>
              <a href="/contactus">
              <button className="flex items-center gap-[6px] mt-6 bg-[#000C36] rounded-full text-white p-[6px] px-5">Contact Us <span className="mt-1"><ArrowRight size={15}/></span> </button>
              </a>
        </div>
        <div className="w-full h-full mt-3 md:mt-0 md:h-[50%] block md:flex  md:justify-end">
          <img src="/contactus/ctaimg.jpeg" className="md:w-[90%] " alt="" />
        </div>
      </div>
    </>
  );
}

// Render rich text blocks with specific styles for headings and paragraphs
function renderDescription(blocks: any[]) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {renderChildren(block.children)}
          </p>
        );

      case "heading":
        const HeadingTag = (`h${block.level || 3}` as keyof JSX.IntrinsicElements);
        return (
          <HeadingTag key={index} className="mt-6 mb-4 text-2xl md:text-4xl font-semibold text-black">
            {renderChildren(block.children)}
          </HeadingTag>
        );

      default:
        return <p key={index} className="mb-6">Unsupported block type: {block.type}</p>;
    }
  });
}

// Helper function to render child elements with specific styles
function renderChildren(children: any[]) {
  return children.map((child, childIndex) => (
    <p
      key={childIndex}
      style={{ fontWeight: child.bold ? "bold" : "normal" }}
    >
      {child.text}
    </p>
  ));
}

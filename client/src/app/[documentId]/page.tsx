"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ServiceData } from "@/types/all-types"; // Ensure this path is correct
import qs from "qs";
import Navbar from "@/components/navbar";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";

// Dynamic services data interface
interface ServicesDataType {
  [key: string]: ServiceData;
}

export default function ServicePage() {
  const params = useParams();
  const serviceId = Array.isArray(params?.documentId)
    ? params.documentId[0]
    : params?.documentId;
  const router = useRouter();

  const [service, setService] = useState<ServiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [content, setContent] = useState<BlocksContent | null>(null); // Added content state

  useEffect(() => {
    if (serviceId) {
      fetchServices(serviceId);
    }
    fetchAllServices();
  }, [serviceId]);

  async function fetchServices(id: string) {
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
      if (!res.ok) throw new Error(`Failed to fetch service with id ${id}.`);

      const data = await res.json();
      setService(data.data);

      const content: BlocksContent = data.data.serviceContent || null;
      console.log(content) // Extracting serviceContent
      setContent(content); // Storing in state
      console.log(data); // Keeping your console log
    } catch (error: any) {
      console.error("Error fetching service:", error);
      setError(
        error.message || "An error occurred while fetching the service."
      );
    }
  }

  async function fetchAllServices() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const path = `/api/services`;

      const url = new URL(path, baseUrl);
      url.search = qs.stringify({
        populate: { serviceImage: { fields: ["url", "alternativeText"] } },
      });

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Failed to fetch services.`);

      const data = await res.json();
      setServices(data.data);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      setError(error.message || "An error occurred while fetching services.");
    }
  }

  return (
    <>
      <div className="fixed w-full" style={{ zIndex: "999" }}>
        <Navbar />
      </div>

      <main className="flex flex-col gap-20 mb-40">
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <div className="h-screen flex items-center justify-center relative w-full overflow-hidden">
              <img
                src={
                  service?.heroImage?.url?.startsWith("http")
                    ? service.heroImage.url
                    : `${process.env.NEXT_PUBLIC_BASE_URL}${service?.heroImage?.url}`
                }
                alt={
                  service?.heroImage?.alternativeText || service?.heroHeadings
                }
                className="object-cover w-full h-full"
                onError={(e) => {
                  console.error(
                    "Image failed to load:",
                    service?.heroImage?.url
                  );
                  e.currentTarget.src = "/fallback-image.jpg"; // Optional fallback image
                }}
              />
              <h1 className="absolute top-[50%] left-1/2 -translate-x-1/2 text-2xl md:text-5xl text-white font-semibold tracking-wide">
                {service?.heroHeadings}
              </h1>
            </div>

            <div className="px-4 md:px-20 xl:px-40 w-full flex flex-col gap-20">
              <div className="w-full flex gap-20">
                <img
                  src={
                    service?.serviceImage?.url?.startsWith("http")
                      ? service?.serviceImage.url
                      : `${process.env.NEXT_PUBLIC_BASE_URL}${service?.serviceImage?.url}`
                  }
                  alt={
                    service?.serviceImage?.alternativeText ||
                    service?.heroHeadings
                  }
                  className="hidden lg:block w-[50%]"
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      service?.serviceImage?.url
                    );
                    e.currentTarget.src = "/fallback-image.jpg"; // Optional fallback image
                  }}
                />
              </div>
            </div>

            {/* <div className="w-full lg:w-1/2 flex flex-col gap-6"> */}
              {/* Render the content with BlocksRenderer
              {content ? (
                <BlocksRenderer content={content} />
              ) : (
                <p>No content available</p>
              )}

              <ReactMarkdown>
                {service?.advertisement || "Advertisement details not available"}
              </ReactMarkdown>
              <ReactMarkdown>
                {service?.about || "About information not provided"}
              </ReactMarkdown> */}
            {/* </div> */}

            <section className="mt-20">
              <h2 className="text-center text-3xl font-bold mb-8">
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8 relative">
                {services.map((service, index) => (
                  <div
                    key={service.documentId}
                    className={`bg-white w-[80%] md:w-[60%] shadow-md rounded-lg hover:shadow-lg transition cursor-pointer random-position-${index}`}
                    onClick={() => router.push(`/${service.documentId}`)}
                  >
                    <img
                      src={
                        service?.serviceImage?.url?.startsWith("http")
                          ? service?.serviceImage.url
                          : `${process.env.NEXT_PUBLIC_BASE_URL}${service?.serviceImage?.url}`
                      }
                      alt={
                        service?.serviceImage?.alternativeText ||
                        service?.heroHeadings
                      }
                      className="w-full h-40 object-cover rounded-t-md"
                      onError={(e) => {
                        console.error(
                          "Image failed to load:",
                          service?.serviceImage?.url
                        );
                        e.currentTarget.src = "/fallback-image.jpg"; // Optional fallback image
                      }}
                    />
                    <h3 className="text-lg text-center font-semibold mt-4 mb-4">
                      {service.name}
                    </h3>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-screen flex items-center justify-center relative w-full overflow-hidden">
              <img
                src={
                  service?.ctaImage?.url?.startsWith("http")
                    ? service?.ctaImage.url
                    : `${process.env.NEXT_PUBLIC_BASE_URL}${service?.ctaImage?.url}`
                }
                alt={
                  service?.ctaImage?.alternativeText || service?.heroHeadings
                }
                className="object-cover w-[90%] h-[80%]"
                onError={(e) => {
                  console.error(
                    "Image failed to load:",
                    service?.ctaImage?.url
                  );
                  e.currentTarget.src = "/fallback-image.jpg"; // Optional fallback image
                }}
              />
              <h1 className="absolute top-[50%] left-1/2 -translate-x-1/2 text-2xl md:text-5xl text-white font-semibold">
                {service?.ctaText}
              </h1>
              <p className="absolute top-[70%] left-1/2 -translate-x-1/2 text-white font-semibold">
                {service?.ctaPara}
              </p>
              <a href="/contactus">
                <button className="absolute top-[78%] left-[50%] bg-LG p-2 rounded-xl">
                  Get Started
                </button>
              </a>
            </div>
          </>
        )}
      </main>
    </>
  );
}

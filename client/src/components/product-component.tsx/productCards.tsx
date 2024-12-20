"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AnimateToView from "../AnimateToView";
import { Product } from "@/types/all-types";
import qs from "qs";
import { useRouter } from "next/navigation";

const ProductCat = () => {
  const [categories, setCategories] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:1337";
        const path = "/api/products";
  
        // Adjusted query structure for nested population
        const query = qs.stringify(
          {
            populate: {
              productImage: {
                fields: ["url", "alternativeText"], // Ensuring fields for each image
              },
            },
          },
          { encodeValuesOnly: true } // This option helps avoid overly complex URL encoding
        );
  
        const url = `${baseUrl}${path}?${query}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
  
        const data = await response.json();
        console.log("Fetched Products Data:", data); // Log data for verification
  
        if (!Array.isArray(data.data)) {
          throw new Error("Unexpected API response structure");
        }
  
        setCategories(data.data);
        setIsLoading(false); // Set loading to false after fetching the data
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error}</div>;
  }

  const displayedCategories = new Set();

  return (
    <div className="px-4 md:px-20 md:py-20 py-10 w-full">
      <AnimateToView>
        <h1 className="md:text-[40px] text-[30px] mb-3 text-white">
          Our featured products.
        </h1>
      </AnimateToView>
      <div className="flex mt-5">
        <div className="w-full flex flex-col gap-12">
          <AnimateToView className="flex w-full gap-4">
            <div className="h-[1px] ml-[-30px] mt-3 w-20 bg-DG" />
            <p className="text-white text-lg md:text-xl font-light">
              Explore our carefully chosen featured products below, specifically
              curated to meet all your essential livestock needs with ease.
            </p>
          </AnimateToView>
          <div className="lg:flex grid md:grid-cols-2 grid-cols-1 justify-items-center items-center gap-6 flex-wrap md:gap-10">
            {categories.length > 0 ? (
              categories
                .filter((product) => {
                  if (displayedCategories.has(product.productCategory)) {
                    return false;
                  }
                  displayedCategories.add(product.productCategory);
                  return true;
                })
                .map((product) => (
                  <div
                    key={product.pid}
                    className="relative group cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 max-w-xs"
                  >
                    {/* Image Section */}
                    <div className="h-48 w-auto lg:w-[340px] overflow-hidden">
                      <img
                        onClick={() =>
                          router.push(
                            `/product/category/${product.productCategory}`
                          )
                        }
                        className=" object-cover object-center transition-transform duration-300 group-hover:scale-110"
                        src={
                          product.productImage?.[0]?.url
                            ? product.productImage[0].url.startsWith("http")
                              ? product.productImage[0].url
                              : `${process.env.NEXT_PUBLIC_BASE_URL}${product.productImage[0].url}`
                            : "/default-image.jpg" // Fallback image if no images are available
                        }
                        alt={
                          product.productImage?.[0]?.alternativeText ||
                          product.productTitle
                        }
                        onError={(e) => {
                          console.error(
                            `Image failed to load: ${product.productImage?.[0]?.url}`,
                            e
                          );
                          e.currentTarget.src = "/default-image.jpg"; // Fallback image on error
                        }}
                      />
                    </div>

                    {/* Category Title */}
                    <div className="flex items-center justify-between p-4 text-center bg-white">
                      <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                        {product.productCategory}
                      </h1>
                      <Link
                        href={`/product/category/${product.productCategory}`}
                        className="mt-2 inline-flex items-center justify-center text-white bg-[#000C36] px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-[#000c36ac]"
                      >
                        Explore <span className="ml-1">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                ))
            ) : (
              <p>No products available at the moment.</p>
            )}
          </div>

          {/* View All Products Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/product"
              className="border border-green-600 text-black bg-[#A8CF45] py-3 px-12 rounded-full transition duration-300"
            >
              View All Products <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCat;

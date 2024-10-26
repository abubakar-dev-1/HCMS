'use client';

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types/all-types";
import { toast } from "react-hot-toast";
import qs from "qs";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const getImageUrl = (imageUrl: string | undefined): string=>
  imageUrl?.startsWith("http")
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl || "/default-image.jpg"}`;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const sliderRef = useRef<Slider | null>(null);

  const productId = Array.isArray(params?.documentId) ? params.documentId[0] : params?.documentId;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [description, setDescription] = useState<any | null>(null);

  useEffect(() => {
    if (productId) fetchProduct(productId);
  }, [productId]);

  async function fetchProduct(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const path = `/api/products/${id}`;

      const url = new URL(path, baseUrl);
      url.search = qs.stringify({
        populate: {
          productImage: { fields: ["url", "alternativeText"] },
        },
      });

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch product");

      const data = await res.json();
      setProduct(data.data);
      setDescription(data.data.description || null);

      fetchRelatedProducts(data.data.productCategory, data.data.documentId);
    } catch (error) {
      console.error("Error fetching the product:", error);
      toast.error("Error fetching the product.");
    }
  }

  async function fetchRelatedProducts(category: string, currentProductId: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const path = `/api/products`;

      const url = new URL(path, baseUrl);
      url.search = qs.stringify({
        filters: { productCategory: { $eq: category } },
        populate: {
          productImage: { fields: ["url", "alternativeText"] },
        },
      });

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch related products");

      const data = await res.json();
      const filteredProducts = data.data.filter(
        (p: Product) => p.documentId !== currentProductId
      );

      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  }

  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(relatedProducts.length, 3),
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(relatedProducts.length, 2) } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      <main className="my-40 px-4 md:px-20 xl:px-40 w-full flex flex-col">
        {product ? (
          <div>
          <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <img
                src={getImageUrl(product.productImage?.url)}
                alt={product.productImage?.alternativeText || product.productTitle}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                onError={(e) => (e.currentTarget.src = "/default-image.jpg")}
              />
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-sm font-semibold text-gray-500 italic">
                {`${product.productCategory} > ${product.productSubCategory}`}
              </p>
              <p className="prose mt-6 font-bold text-xl">{product.productDescription}</p>
              <h2 className="text-3xl font-bold mt-4">{product.productTitle}</h2>
              <div className="mt-8">
                <p className="text-lg"><strong>SKU:</strong> {product.SKU}</p>
                <p className="text-lg mt-2"><strong>Price:</strong> ${product.productPrice}</p>
              </div>
            </div>
          </div>
            <div className="prose prose-lg text-gray-700 w-full">
            {description ? renderDescription(description) : <p>No content available.</p>}
        </div>
          </div>
          
        ) : (
          <p>Loading product data...</p>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
            <div className="relative">
              <Slider ref={sliderRef} {...sliderSettings}>
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="p-4">
                    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
                      <Link href={`/product/${relatedProduct.documentId}`}>
                        <img
                          src={getImageUrl(relatedProduct.productImage?.url)}
                          alt={relatedProduct.productImage?.alternativeText || relatedProduct.productTitle}
                          className="w-full h-40 object-contain rounded-md"
                        />
                        <h4 className="mt-4 font-semibold text-lg">{relatedProduct.productTitle}</h4>
                        <p className="text-gray-500 text-sm mt-1">${relatedProduct.productPrice}</p>
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>

              <div className="flex justify-center gap-5 items-center mt-4">
                <button className="text-3xl" onClick={() => sliderRef.current?.slickPrev()}>
                  <IoIosArrowBack />
                </button>
                <button className="text-3xl" onClick={() => sliderRef.current?.slickNext()}>
                  <IoIosArrowForward />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function renderDescription(blocks: any[]) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-4">
            {renderChildren(block.children)}
          </p>
        );

      case "heading":
        const HeadingTag = (`h${block.level || 2}` as keyof JSX.IntrinsicElements); // Dynamically set heading level
        return (
          <HeadingTag key={index} className="mt-6 mb-2 font-semibold">
            {renderChildren(block.children)}
          </HeadingTag>
        );

      case "list":
        return (
          <ul key={index} className="">
            {block.children.map((listItem: any, listItemIndex: number) => (
              <li key={listItemIndex}>
                {renderChildren(listItem.children)}
              </li>
            ))}
          </ul>
            
        );

      default:
        return <p key={index}>Unsupported block type: {block.type}</p>;
    }
  });
}

/* Helper function to render children elements */
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

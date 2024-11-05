'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types/all-types";
import { toast } from "react-hot-toast";
import qs from "qs";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Utility function to get image URL
const getImageUrl = (imageUrl: string | undefined): string =>
  imageUrl?.startsWith("http")
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl || "/default-image.jpg"}`;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Array.isArray(params?.documentId) ? params.documentId[0] : params?.documentId;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          productImage: { fields: ["url", "alternativeText"] }, // Note: Updated to fetch multiple images
        },
      });

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch product");

      const data = await res.json();
      setProduct(data.data);

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
      const filteredProducts = data.data
        .filter((p: Product) => p.documentId !== currentProductId)
        .slice(0, 4); // Limit to 4 related products

      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  }

  // Handle main image update from thumbnails
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <main className="my-20 px-4 md:px-20 xl:px-40 w-full flex flex-col">
        {product ? (
          <div>
            {/* Carousel for product images */}
            
            <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-normal items-center gap-12 lg:gap-20">

             <div className="w-full md:w-1/2 relative"> 
              <div className=" border-[1px] border-black ">
                {product.productImage && product.productImage.length > 0 && (
                  <div className="relative">
                    <img
                      src={getImageUrl(product.productImage[currentImageIndex]?.url)}
                      alt={product.productImage[currentImageIndex]?.alternativeText || product.productTitle}
                      className="w-full h-auto object-cover rounded-lg p-5"
                      onError={(e) => (e.currentTarget.src = "/default-image.jpg")}
                    />
                    <p className="text-center py-2">{`${currentImageIndex + 1} / ${product.productImage.length}`}</p>
                  </div>
                )}

                {/* Thumbnails */}
              </div>
                <div className="flex gap-2 mt-4 justify-center">
                  {product?.productImage?.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image.url)}
                      alt={image.alternativeText || product.productTitle}
                      className={`w-16 h-16 object-cover rounded-md cursor-pointer ${index === currentImageIndex ? "border-2 border-blue-500" : ""}`}
                      onClick={() => handleThumbnailClick(index)}
                      onError={(e) => (e.currentTarget.src = "/default-image.jpg")}
                    />
                  ))}
                </div>
                </div>

              {/* Product Info */}
              <div className="w-full md:w-1/2">
                <p className="text-sm font-semibold text-gray-500 italic">
                  {`${product.productCategory} > ${product.productSubCategory}`}
                </p>
                <h2 className="text-3xl font-bold mt-4">{product.productTitle}</h2>
                <p className="prose mt-6 font-bold text-xl">{product.productDescription}</p>
                <div className="mt-8">
                  <p className="text-lg"><strong>SKU:</strong> {product.SKU}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12 text-gray-700">
              {typeof product.description === "string"
                ? <p>{product.description}</p>
                : product.description 
                  ? renderDescription(product.description)
                  : <p>No content available.</p>
              }
            </div>
          </div>
        ) : (
          <p>Loading product data...</p>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 ">
            <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className=" bg-white shadow-md hover:shadow-lg transition">
                  <Link href={`/product/${relatedProduct.documentId}`}>
                    <img
                      src={getImageUrl(relatedProduct.productImage?.[0]?.url)}
                      alt={relatedProduct.productImage?.[0]?.alternativeText || relatedProduct.productTitle}
                      className="w-full h-40 object-cover bg-[#EFF0F0]"
                    />
                    <h4 className="mt-4 font-semibold text-lg px-4">{relatedProduct.productTitle}</h4>
                    <p className="text-gray-500 text-sm mt-1 px-4 mb-3">${relatedProduct.productPrice}</p>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

// Render rich text blocks for description
function renderDescription(blocks: any[]) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-4 w-full">
            {renderChildren(block.children)}
          </p>
        );

      case "heading":
        const HeadingTag = (`h${block.level || 2}` as keyof JSX.IntrinsicElements);
        return (
          <HeadingTag key={index} className="mt-6 mb-2 font-semibold text-center">
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

// Helper function to render children elements
function renderChildren(children: any[]) {
  return children.map((child, childIndex) => (
    <span
      key={childIndex}
      style={{ fontWeight: child.bold ? "bold" : "normal" }}
    >
      {child.text}
    </span>
  ));
}

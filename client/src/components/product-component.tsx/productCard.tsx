import Link from "next/link";
import { Product } from "@/types/all-types";
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Star icons

export default function ProductCard({ product }: { product: Product }) {
  // Access the first image in productImages array if available
  const firstImageUrl = product.productImage?.[0]?.url?.startsWith("http")
    ? product.productImage[0].url
    : `${process.env.NEXT_PUBLIC_BASE_URL}${product.productImage?.[0]?.url || "/default-image.jpg"}`;

  // Simulating a random rating between 1 and 5 (since Strapi doesn’t provide it)
  const rating = Math.floor(Math.random() * 5) + 1;

  return (
    <Link
      href={`/product/${product.documentId}`}
      className="w-[270px] h-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer mb-3"
    >
      {/* Image Section */}
      <div className="relative w-full h-auto rounded-lg overflow-hidden">
        <img
          src={firstImageUrl}
          alt={product.productTitle}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            console.error(`Image failed to load: ${firstImageUrl}`, e);
            e.currentTarget.src = "/default-image.jpg"; // Fallback image
          }}
        />
        {product.isOnSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            SALE!
          </span>
        )}
      </div>

      {/* Product Info Section */}
      <section className="mt-3 flex flex-col gap-1 p-5">
        <h4 className="text-gray-900 font-semibold text-lg">
          {product.productTitle}
        </h4>
        <p className="text-sm text-gray-500">
          {product.productCategory || "Category"}
        </p>

        {/* Price and Rating */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, index) =>
              index < rating ? (
                <AiFillStar key={index} className="text-yellow-500" />
              ) : (
                <AiOutlineStar key={index} className="text-gray-300" />
              )
            )}
          </div>
          <p className="text-red-500 font-semibold">
            ${product.productPrice}
          </p>
        </div>

        {/* SKU Information */}
        <p className="italic text-xs text-gray-500">
          SKU: {product.SKU || "N/A"}
        </p>
      </section>
    </Link>
  );
}

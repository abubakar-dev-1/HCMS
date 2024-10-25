import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/all-types"; // Adjust the import path as needed

export default function ProjectCard({ project }: { project: Project }) {
  const truncatedSubtitle =
    project.projSubTitle.length > 30
      ? project.projSubTitle.substring(0, 30) + "..."
      : project.projSubTitle;

  const truncatedTitle =
    project.projTitle.length > 40
      ? project.projTitle.substring(0, 40) + "..."
      : project.projTitle;

  const truncatedDescription = project.html;

  // Handle image URL properly
  const imageUrl = project.projImage?.url?.startsWith("http")
    ? project.projImage.url
    : `${process.env.NEXT_PUBLIC_BASE_URL}${project.projImage?.url || "/default-image.jpg"}`;

  return (
    <Link
      href={`/projects/${project.documentId}`}
      className="h-auto shadow-lg shadow-gray-400 relative overflow-hidden bg-LG"
    >
      <div className="h-[240px] overflow-hidden">
        {/* Use Next.js Image component for optimized image loading */}
        <Image
          src={imageUrl}
          alt={project.projTitle}
          width={400}
          height={300}
          className="hover:scale-110 duration-300 transition cursor-pointer w-full h-full object-cover"
          onError={(e) => {
            console.error(`Image failed to load: ${imageUrl}`, e);
          }}
          unoptimized
        />
      </div>

      <h2 className="text-2xl p-3 font-semibold">{truncatedTitle}</h2>
      <p className="px-3  pb-4">{truncatedDescription} </p>
    </Link>
  );
}

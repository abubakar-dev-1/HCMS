"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Project } from "@/types/all-types";
import qs from "qs";
import Navbar from "@/components/navbar";
import ReactMarkdown from "react-markdown";

export default function ProjectPage() {
  const params = useParams();
  const projId = Array.isArray(params?.documentId)
    ? params.documentId[0]
    : params?.documentId;
  const [project, setProject] = useState<Project | null>(null);
  const [description, setDescription] = useState<any | null>(null); // Adjusted type to `any` to handle multiple formats

  useEffect(() => {
    if (projId) fetchProject(projId);
  }, [projId]);

  async function fetchProject(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const path = `/api/projects/${id}`;
      const url = new URL(path, baseUrl);

      url.search = qs.stringify({
        populate: {
          projImage: { fields: ["url", "alternativeText"] },
        },
      });

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch project");

      const data = await res.json();
      console.log("Fetched project data:", data); // Log to see data structure

      setProject(data.data);
      setDescription(data.data.projDescription || null); // Store the description content
    } catch (error) {
      console.error("Error fetching the project:", error);
      toast.error("Error fetching the project.");
    }
  }

  if (!project) return <p>Loading...</p>;

  const imageUrl = project.projImage?.url?.startsWith("http")
    ? project.projImage.url
    : `${process.env.NEXT_PUBLIC_BASE_URL}${
        project.projImage?.url || "/default-image.jpg"
      }`;

  return (
    <>
      <div className="fixed w-full" style={{ zIndex: "999" }}>
        <Navbar />
      </div>
      <main className="flex my-40 flex-col gap-10 px-4 md:px-20 lg:px-32 xl:px-64">
        <section className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl md:text-3xl text-black tracking-wide font-semibold">
            {project.projHeader}
          </h1>
          <h3 className="text-gray-500 tracking-wide">{project.projTitle}</h3>
        </section>

        <div className="w-full grid-cols-1 rounded-3xl max-h-[600px] overflow-hidden gap-x-8 gap-y-12">
          <img
            src={imageUrl}
            alt={project.projImage?.alternativeText || project.projTitle}
            className="w-full object-cover object-center"
            onError={(e) => {
              console.error(`Image failed to load: ${imageUrl}`, e);
              e.currentTarget.src = "/default-image.jpg";
            }}
          />
        </div>

        {/* Render description based on its structure */}
        <div className="prose prose-lg text-gray-700 w-full">
          {renderDescription(description)}
        </div>
      </main>
    </>
  );
}

/* Helper function to render the description */
function renderDescription(description: any) {
  if (!description) return <p>No description available.</p>;

  if (typeof description === "string") {
    // If it's an HTML string, use dangerouslySetInnerHTML
    return (
      <div
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
    );
  } else if (Array.isArray(description)) {
    // If it's an array of blocks, map over them
    return description.map((block, index) => (
      <div key={index}>
        <p>{block.content || block.text}</p>
      </div>
    ));
  } else if (description.markdown) {
    // If the content is Markdown
    return <ReactMarkdown>{description.markdown}</ReactMarkdown>;
  } else {
    // Fallback if content is in another unexpected format
    console.warn("Unexpected description format:", description);
    return <p>Unable to render description.</p>;
  }
}

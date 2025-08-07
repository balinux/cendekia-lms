"use client";
import TextAlign from "@tiptap/extension-text-align";
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import parse from "html-react-parser";

export function RenderDescription({ json }: { json: JSONContent }) {
  const [htmlOutput, setHtmlOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const generateHtml = async () => {
      try {
        // Dynamic import untuk client-side only
        const { generateHTML } = await import("@tiptap/html");

        if (isMounted) {
          const output = generateHTML(json, [
            StarterKit,
            TextAlign.configure({
              types: ["paragraph", "heading"],
            }),
          ]);

          setHtmlOutput(output);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error generating HTML:", error);
        setIsLoading(false);
      }
    };

    generateHtml();

    return () => {
      isMounted = false;
    };
  }, [json]);

  if (isLoading) {
    return (
      <div className="prose dark:prose-invert prose-li:marker:text-primary">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(htmlOutput)}
    </div>
  );
}

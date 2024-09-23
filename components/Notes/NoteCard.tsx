"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Note } from "@/types/next-auth";
import { formatTimestamp, sanitizeAndStyleHtml, tagColors } from "@/lib/utils";

const NoteCard = ({
  id,
  title,
  description,
  tags,
  authorName,
  authorImage,
  createdAt,
}: Note) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const getTagColor = (index: number) => tagColors[index % tagColors.length];
  const styledDescription = sanitizeAndStyleHtml(description || "");

  return (
    <Link href={`/notes/${id}`} passHref>
      <div className="cursor-pointer bg-background-primary border border-border-primary rounded-md space-y-3 px-6 py-4 max-w-md hover:shadow transition-shadow duration-200">
        <div className="flex items-center gap-3">
          {tags.map((tag, index) => {
            const color = getTagColor(index);
            return (
              <span
                key={index}
                className={`text-xs font-medium px-1.5 py-1 rounded ${color.bg} ${color.text}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
        <h3 className="text-lg font-medium text-dark-primary">{title}</h3>
        <div
          className="text-sm text-dark-secondary font-normal overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
          }}
          dangerouslySetInnerHTML={{
            __html: styledDescription,
          }}
        />
        <div className="flex items-center justify-between border-t border-border-primary pt-3">
          <div className="flex items-center gap-3">
            {isImageLoading && <Skeleton className="w-6 h-6 rounded-full" />}
            <Image
              src={authorImage || "Unknown Author"}
              alt={authorName || "/icons/UserCircle.svg"}
              className={`w-6 h-6 rounded-full ${
                isImageLoading ? "hidden" : "block"
              }`}
              width={20}
              height={20}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
            <span className="text-sm text-dark-primary font-medium">
              {authorName}
            </span>
          </div>
          <span className="text-xs text-dark-secondary font-medium">
            {formatTimestamp(createdAt.toString())}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;

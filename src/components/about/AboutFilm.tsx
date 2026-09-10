"use client";

import { Mp4Sources } from "@/components/media/Mp4Sources";
import { useInlineVideoAutoplay } from "@/hooks/useInlineVideoAutoplay";
import { cn } from "@/lib/utils";

type AboutFilmProps = {
  image: string;
  video?: string;
  alt: string;
  className?: string;
  objectPosition?: string;
};

export function AboutFilm({
  image,
  video,
  alt,
  className,
  objectPosition = "center 22%",
}: AboutFilmProps) {
  const videoRef = useInlineVideoAutoplay(video);

  return (
    <div className={cn("about-film", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        className="about-film__img"
        style={{ objectPosition }}
        draggable={false}
      />
      {video ? (
        <video
          ref={videoRef}
          className="about-film__video"
          style={{ objectPosition }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={image}
          controls={false}
          disablePictureInPicture
          aria-hidden="true"
        >
          <Mp4Sources src={video} />
        </video>
      ) : null}
    </div>
  );
}

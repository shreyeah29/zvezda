import { videoSourcePair } from "@/lib/videoSources";

export function Mp4Sources({ src }: { src: string }) {
  const { sharp, fallback } = videoSourcePair(src);

  if (sharp !== fallback) {
    return (
      <>
        {/* 1080p 8-bit H.264 first so Chrome/desktop never fall through to 720p ambient. */}
        <source src={fallback} type="video/mp4" />
        <source src={sharp} type='video/mp4; codecs="hvc1"' />
      </>
    );
  }

  return <source src={src} type="video/mp4" />;
}

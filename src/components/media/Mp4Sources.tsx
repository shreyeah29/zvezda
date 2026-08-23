import { videoSourcePair } from "@/lib/videoSources";

export function Mp4Sources({ src }: { src: string }) {
  const { sharp, fallback } = videoSourcePair(src);

  if (sharp !== fallback) {
    return (
      <>
        <source src={sharp} type='video/mp4; codecs="hvc1"' />
        <source src={fallback} type="video/mp4" />
      </>
    );
  }

  return <source src={src} type="video/mp4" />;
}

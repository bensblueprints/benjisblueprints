"use client";

import { useRef } from "react";

export default function HoverVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      void v.play();
    } catch {}
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    try {
      v.currentTime = 0;
    } catch {}
  };

  return (
    <div className="thumb-wrap" onMouseEnter={play} onMouseLeave={stop} onTouchStart={play}>
      <video
        ref={ref}
        className="thumb"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
      />
      <span className="thumb-play" aria-hidden="true">▶</span>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const overlays = [
  { text: "Precisión en cada capa" },
  { text: "Tecnología de vanguardia" },
  { text: "Tu visión, hecha realidad" },
];

export default function VideoScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const text1Ref = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);
  const text3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const textRefs = [text1Ref.current, text2Ref.current, text3Ref.current];

    // Text opacity ranges: [fadeInStart, peakStart, peakEnd, fadeOutEnd]
    const textRanges = [
      [0, 0.08, 0.3, 0.42],
      [0.42, 0.52, 0.72, 0.82],
      [0.82, 0.9, 1.0, 1.0],
    ];

    const getTextOpacity = (progress: number, range: number[]) => {
      const [fi, ps, pe, fo] = range;
      if (progress < fi || progress > fo) return 0;
      if (progress < ps) return (progress - fi) / (ps - fi);
      if (progress <= pe) return 1;
      if (progress <= fo) return 1 - (progress - pe) / (fo - pe);
      return 0;
    };

    const getTextY = (progress: number, range: number[]) => {
      const [fi, ps] = range;
      if (progress < fi) return 16;
      if (progress < ps) {
        const t = (progress - fi) / (ps - fi);
        return 16 * (1 - t);
      }
      return 0;
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Sync video playback
          if (video.readyState >= 1 && video.duration) {
            video.currentTime = p * video.duration;
          }

          // Animate text overlays
          textRefs.forEach((el, i) => {
            if (!el) return;
            const opacity = getTextOpacity(p, textRanges[i]);
            const y = getTextY(p, textRanges[i]);
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${y}px)`;
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0a0a0a]">
        <video
          ref={videoRef}
          src="/videos/gear.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.55)" }}
        />

        {/* Text overlays */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          {overlays.map((item, i) => {
            const refs = [text1Ref, text2Ref, text3Ref];
            return (
              <p
                key={i}
                ref={refs[i]}
                className="absolute text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center max-w-4xl leading-tight"
                style={{ opacity: 0, transform: "translateY(16px)" }}
              >
                {item.text}
              </p>
            );
          })}
        </div>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-white/15" />
        </div>
      </div>
    </section>
  );
}

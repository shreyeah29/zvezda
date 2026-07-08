"use client";

import { useEffect, useRef, useState } from "react";
import { createElement, type CSSProperties, type Ref } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(GSAPSplitText, useGSAP);

type SplitTarget = "chars" | "words" | "lines" | "words, chars";
type SplitTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitTarget;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  textAlign?: CSSProperties["textAlign"];
  tag?: SplitTag;
  onLetterAnimationComplete?: () => void;
};

type SplitElement = HTMLElement & {
  _rbsplitInstance?: GSAPSplitText | null;
};

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<SplitElement | null>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
      return;
    }

    void document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      if (el._rbsplitInstance) {
        el._rbsplitInstance.revert();
        el._rbsplitInstance = null;
      }

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
      });

      let targets: Element[] = [];
      if (splitType.includes("chars") && splitInstance.chars.length) targets = splitInstance.chars;
      else if (splitType.includes("words") && splitInstance.words.length) targets = splitInstance.words;
      else if (splitType.includes("lines") && splitInstance.lines.length) targets = splitInstance.lines;
      else targets = splitInstance.chars ?? splitInstance.words ?? splitInstance.lines;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          force3D: true,
          onComplete: () => onCompleteRef.current?.(),
        }
      );

      el._rbsplitInstance = splitInstance;

      return () => {
        splitInstance.revert();
        el._rbsplitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        fontsLoaded,
      ],
      scope: ref,
    }
  );

  return createElement(
    tag,
    {
      ref: ref as Ref<HTMLElement>,
      className: `split-parent ${className}`,
      style: {
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        willChange: "transform, opacity",
      } satisfies CSSProperties,
    },
    text
  );
}

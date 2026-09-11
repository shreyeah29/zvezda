"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { AboutFilm } from "@/components/about/AboutFilm";
import { useAboutPinProgress } from "@/hooks/useAboutPinProgress";
import {
  aboutArchive,
  aboutMarqueeItems,
  aboutMedia,
  atelierContact,
  atelierCraft,
  atelierTimeline,
  founderStory,
  zvezdaNameReveal,
} from "@/data/atelier";
import "./AboutExperience.css";

const HERO_LINES = ["Feel", "like", "a star"] as const;
const MARQUEE_LOOP = [...aboutMarqueeItems, ...aboutMarqueeItems];

function MaskLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={className ? `about-mask ${className}` : "about-mask"}>
      <span className="about-mask__in">{children}</span>
    </span>
  );
}

export function AboutExperience() {
  return <AboutScroll />;
}

function AboutScroll() {
  const rootRef = useRef<HTMLElement>(null);
  const heroStickyRef = useRef<HTMLDivElement>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useAboutPinProgress(rootRef);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setHeroReady(true), reduce ? 0 : 80);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const sticky = heroStickyRef.current;
    if (!sticky) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = sticky.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      setDrift({
        x: Math.max(-1, Math.min(1, nx)) * 16,
        y: Math.max(-1, Math.min(1, ny)) * 10,
      });
    };

    sticky.addEventListener("pointermove", onMove);
    return () => sticky.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <main
      ref={rootRef}
      id="main-content"
      className={heroReady ? "about-page is-ready" : "about-page"}
    >
      <section
        className="about-pin about-hero"
        data-about-pin
        aria-labelledby="about-hero-title"
        style={{ viewTimelineName: "--about-hero" } as CSSProperties}
      >
        <div ref={heroStickyRef} className="about-pin__sticky about-hero__sticky">
          <div className="about-hero__grid">
            <div className="about-hero__cell about-hero__cell--left">
              <div
                className="about-hero__drift about-hero__clip about-hero__clip--left"
                style={{ transform: `translate3d(${drift.x}px, ${drift.y}px, 0)` }}
              >
                <AboutFilm
                  image={aboutMedia.heroLeft.image}
                  video={aboutMedia.heroLeft.video}
                  alt={aboutMedia.heroLeft.alt}
                />
              </div>
            </div>

            <div className="about-hero__type">
              <h1 id="about-hero-title" className="about-hero__title">
                {HERO_LINES.map((line) => (
                  <MaskLine key={line} className="about-hero__line">
                    {line}
                  </MaskLine>
                ))}
              </h1>
              <span className="about-rule about-rule--hero" aria-hidden="true" />
              <p className="about-hero__sub">
                A made-to-order house of quiet luxury.
              </p>
            </div>

            <div className="about-hero__cell about-hero__cell--right">
              <div
                className="about-hero__drift about-hero__clip about-hero__clip--right"
                style={{ transform: `translate3d(${-drift.x}px, ${-drift.y}px, 0)` }}
              >
                <AboutFilm
                  image={aboutMedia.heroRight.image}
                  video={aboutMedia.heroRight.video}
                  alt={aboutMedia.heroRight.alt}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="about-marquee" aria-hidden="true">
        <div className="about-marquee__track">
          {MARQUEE_LOOP.map((item, i) => (
            <span key={`${item}-${i}`} className="about-marquee__item">
              {item}
              <span className="about-marquee__star">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="about-founder" aria-labelledby="founder-title">
        <div className="about-founder__intro">
          <p className="about-eyebrow">{founderStory.eyebrow}</p>
          <h2 id="founder-title" className="about-founder__name">
            Bindu
            <span>Reddy</span>
          </h2>
        </div>
        <div className="about-founder__portrait">
          <AboutFilm
            image={aboutMedia.founder.image}
            alt={aboutMedia.founder.alt}
            objectPosition="center 12%"
          />
        </div>
        <div className="about-founder__prose">
          <p className="about-founder__lead">{founderStory.intro}</p>
          {founderStory.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        className="about-pin about-lens-pin"
        data-about-pin
        aria-labelledby="atelier-film-label"
        style={{ viewTimelineName: "--about-film" } as CSSProperties}
      >
        <div className="about-pin__sticky about-lens-pin__sticky">
          <p id="atelier-film-label" className="about-lens__label">
            The Atelier Film
          </p>
          <div className="about-lens">
            <div className="about-lens__frame">
              <div className="about-lens__media">
                <AboutFilm
                  image={aboutMedia.atelierFilm.image}
                  video={aboutMedia.atelierFilm.video}
                  alt={aboutMedia.atelierFilm.alt}
                />
              </div>
            </div>
          </div>
          <p className="about-lens__quote">Every piece begins as a conversation.</p>
        </div>
      </section>

      <section className="about-name" aria-labelledby="name-title">
        <h2 id="name-title" className="about-name__sentence">
          {zvezdaNameReveal.words.map((word) => (
            <span key={word} className="about-name__word">
              {word}
            </span>
          ))}
        </h2>
        <span className="about-rule about-rule--name" aria-hidden="true" />
        <p className="about-name__caption">{zvezdaNameReveal.caption}</p>
      </section>

      <section
        className="about-pin about-archive"
        data-about-pin
        aria-labelledby="archive-title"
        style={{ viewTimelineName: "--about-archive" } as CSSProperties}
      >
        <div className="about-pin__sticky about-archive__sticky">
          <h2 id="archive-title" className="about-archive__heading">
            The Archive
          </h2>
          <div className="about-archive__viewport">
            <ul className="about-archive__track">
              {aboutArchive.map((frame) => (
                <li key={frame.index} className="about-archive__item">
                  <figure>
                    <div className="about-archive__frame">
                      <AboutFilm
                        image={frame.image}
                        video={"video" in frame ? frame.video : undefined}
                        alt={frame.alt}
                      />
                    </div>
                    <figcaption>
                      <span>{frame.caption}</span>
                      <span>{frame.index}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
          <div className="about-archive__progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      <section className="about-atelier" aria-labelledby="atelier-title">
        <div className="about-atelier__inner">
          <p className="about-eyebrow">{atelierCraft.eyebrow}</p>
          <h2 id="atelier-title" className="about-atelier__title">
            {atelierCraft.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <div className="about-atelier__prose">
            {atelierCraft.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 36)}>{paragraph}</p>
            ))}
          </div>
          <ol className="about-atelier__timeline">
            {atelierTimeline.map((entry) => (
              <li key={entry.year}>
                <p className="about-atelier__year">{entry.year}</p>
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="about-pin about-close"
        data-about-pin
        aria-labelledby="close-title"
        style={{ viewTimelineName: "--about-close" } as CSSProperties}
      >
        <div className="about-pin__sticky about-close__sticky">
          <div className="about-close__col about-close__col--left">
            <AboutFilm
              image={aboutMedia.closeLeft.image}
              video={aboutMedia.closeLeft.video}
              alt={aboutMedia.closeLeft.alt}
            />
          </div>
          <div className="about-close__invite">
            <h2 id="close-title">Begin a piece of your own.</h2>
            <span className="about-rule about-rule--close" aria-hidden="true" />
            <Link href="/contact#enquiry" className="about-enquire">
              Enquire with the atelier
            </Link>
          </div>
          <div className="about-close__col about-close__col--right">
            <AboutFilm
              image={aboutMedia.closeRight.image}
              video={aboutMedia.closeRight.video}
              alt={aboutMedia.closeRight.alt}
            />
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <p>
          ZVEZDA Atelier — Jubilee Hills, Hyderabad
          <br />
          Open 11:00 am – 7:00 pm IST
        </p>
        <nav aria-label="About footer">
          <a
            href={atelierContact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <Link href="/contact">Contact</Link>
          <Link href="/shipping">Shipping</Link>
        </nav>
      </footer>
    </main>
  );
}

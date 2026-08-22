"use client";

import Link from "next/link";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import {
  aboutHero,
  aboutPortraits,
  atelierTimeline,
  craftNote,
  founderStory,
  zvezdaMeaning,
} from "@/data/atelier";
import "@/components/home/jacquemus/jacquemus-theme.css";
import "./AboutExperience.css";

export function AboutExperience() {
  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content" className="about-page jacquemus-home">
          <section className="about-hero" aria-labelledby="about-hero-title">
            <div className="about-hero__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={aboutHero.image} alt={aboutHero.imageAlt} />
            </div>
            <div className="about-hero__copy">
              <p className="about-kicker">{aboutHero.eyebrow}</p>
              <h1 id="about-hero-title" className="about-hero__title">
                {aboutHero.title}
              </h1>
            </div>
          </section>

          <section className="about-section about-founder" aria-labelledby="founder-title">
            <div className="about-founder__intro">
              <p className="about-kicker">{founderStory.eyebrow}</p>
              <h2 id="founder-title" className="about-display">
                {founderStory.name}
              </h2>
              <p className="about-lead">{founderStory.intro}</p>
            </div>
            <div className="about-prose">
              {founderStory.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="about-meaning" aria-labelledby="meaning-title">
            <p className="about-kicker">{zvezdaMeaning.eyebrow}</p>
            <h2 id="meaning-title" className="about-display about-display--wide">
              {zvezdaMeaning.title}
            </h2>
            <p className="about-lead about-lead--center">{zvezdaMeaning.body}</p>
          </section>

          <section className="about-section about-craft" aria-labelledby="craft-title">
            <div>
              <p className="about-kicker">{craftNote.eyebrow}</p>
              <h2 id="craft-title" className="about-display">
                {craftNote.title}
              </h2>
            </div>
            <div className="about-prose">
              {craftNote.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="about-timeline" aria-labelledby="timeline-title">
            <p className="about-kicker">Timeline</p>
            <h2 id="timeline-title" className="about-display">
              The house, so far
            </h2>
            <ol className="about-timeline__list">
              {atelierTimeline.map((entry) => (
                <li key={entry.year} className="about-timeline__item">
                  <p className="about-timeline__year">{entry.year}</p>
                  <div>
                    <h3 className="about-timeline__title">{entry.title}</h3>
                    <p className="about-timeline__body">{entry.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="about-gallery" aria-labelledby="gallery-title">
            <div className="about-gallery__intro">
              <p className="about-kicker">The Atelier</p>
              <h2 id="gallery-title" className="about-display">
                In pictures
              </h2>
            </div>
            <ul className="about-gallery__grid">
              {aboutPortraits.map((portrait) => (
                <li key={portrait.src} className="about-gallery__card">
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={portrait.src} alt={portrait.alt} />
                    <figcaption>
                      <span>{portrait.caption}</span>
                      <span>{portrait.note}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>

          <section className="about-close" aria-label="Continue">
            <p className="about-lead about-lead--center">
              Every woman deserves to feel like a star.
            </p>
            <div className="about-close__actions">
              <Link href="/shop" className="about-cta">
                Shop the collection
              </Link>
              <Link href="/contact#enquiry" className="about-cta about-cta--ghost">
                Enquire
              </Link>
            </div>
          </section>
        </main>
        <JacquemusFooter />
      </SmoothScroll>
    </SessionLoadGate>
  );
}

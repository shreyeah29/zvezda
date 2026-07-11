"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import "./HomeNewsletter.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state !== "idle") return;
    setState("loading");
    await new Promise((r) => setTimeout(r, 700));
    setState("success");
    setEmail("");
    await new Promise((r) => setTimeout(r, 1800));
    setState("idle");
  };

  return (
    <section className="home-newsletter editorial-section" aria-labelledby="home-newsletter-heading">
      <div className="editorial-container home-newsletter__inner">
        <motion.div
          className="home-newsletter__copy"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="editorial-eyebrow">Private List</p>
          <h2 id="home-newsletter-heading" className="editorial-heading home-newsletter__title">
            Join the Atelier
          </h2>
          <p className="editorial-body home-newsletter__text">
            Early access to collections, private viewings, and stories from inside the house.
          </p>
        </motion.div>

        <motion.form
          className="home-newsletter__form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="home-newsletter__input"
            disabled={state !== "idle"}
          />
          <motion.button
            type="submit"
            className="home-newsletter__submit"
            disabled={state !== "idle"}
            whileHover={state === "idle" ? { scale: 1.02 } : undefined}
            whileTap={state === "idle" ? { scale: 0.98 } : undefined}
            animate={
              state === "loading"
                ? { opacity: 0.7 }
                : state === "success"
                  ? { scale: [1, 1.04, 1] }
                  : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.35 }}
          >
            {state === "loading" ? "Subscribing…" : state === "success" ? "Welcome" : "Subscribe"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}

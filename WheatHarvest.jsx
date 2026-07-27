/* ============================================================================
   WheatHarvest - Decarbonizing Nestlé's Wheat Value Chain
   Emission Quantification Report for Rabi Wheat 2025 · Grow Indigo
   ----------------------------------------------------------------------------
   Content source: "Low-Carbon Wheat Programme 2025-2026" report PDF (Grow
   Indigo, Rabi Season 2025) - restructured section-for-section to match that
   document's own table of contents. Nothing in this file states a fact,
   figure or claim that isn't drawn directly from that PDF. Anywhere the
   source PDF itself never filled in a figure (its own "Xxxx"/"xx%"
   placeholders), that block was removed entirely rather than shown empty.

   Design tokens, motion system and shared chrome are unchanged from
   ClearHarvest.jsx (the rice report) - only content and section structure
   were replaced, per the PDF restructure.
   ========================================================================== */

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  LayoutGroup,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ----------------------------------------------------------------------------
   PHOTO / MEDIA IMPORTS - WHEAT PROGRAMME ONLY, SOURCED FROM THE PDF
   Every image below was extracted directly from the "Low-Carbon Wheat
   Programme 2025-2026" report PDF and lives in src/assets/wheat/pdf/ and
   src/assets/wheat/brand/. Nothing here is a placeholder image.
---------------------------------------------------------------------------- */
import wheatPartnerLogo from "./src/assets/wheat/brand/gilogo1.png";
import wheatProgrammeLogo from "./src/assets/wheat/brand/chnlogo-removebg.png";

import heroFarmerPhoto from "./src/assets/wheat/pdf/hero-farmer.png";
import overviewInfographic from "./src/assets/wheat/pdf/overview-infographic.png";
import enrolledFieldsMap from "./src/assets/wheat/pdf/enrolled-fields-map.png";
import identityPreservationAerial from "./src/assets/wheat/pdf/identity-preservation-aerial.png";
import cropCalendar from "./src/assets/wheat/pdf/crop-calendar.png";
import appOtp from "./src/assets/wheat/pdf/app-otp.jpg";
import appFieldTag from "./src/assets/wheat/pdf/app-field-tag.jpg";
import appSampleSurvey from "./src/assets/wheat/pdf/app-sample-survey.jpg";
import appAadhaarBank from "./src/assets/wheat/pdf/app-aadhaar-bank.jpg";
import appAarhtiya from "./src/assets/wheat/pdf/app-aarhtiya.jpg";
import lowCarbonJourney from "./src/assets/wheat/pdf/low-carbon-journey.png";
import baggedWheatPhoto from "./src/assets/wheat/pdf/bagged-wheat.jpg";
import stakeholderMeetingPhoto from "./src/assets/wheat/pdf/stakeholder-meeting-indoor.jpg";
import villageMeetingPhoto from "./src/assets/wheat/pdf/village-meeting-outdoor.jpg";
import glanceAerialPhoto from "./src/assets/wheat/pdf/glance-aerial.png";

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------------------
   1 · DESIGN TOKENS (unchanged system, wheat-toned palette)
---------------------------------------------------------------------------- */
const C = {
  ink: "#20180B",
  inkSoft: "#2E2211",
  field: "#8A6D1F",
  leaf: "#7C9A3B",
  water: "#3D6B8C",
  waterDeep: "#274A61",
  husk: "#C9A227",
  clay: "#7A5230",
  paper: "#F7F1E1",
  paperDim: "#EDE3C8",
  line: "#DCCB9C",
  mute: "#6E624A",
};

const FONT_DISPLAY = "'Times New Roman', Times, Georgia, 'Liberation Serif', serif";
const FONT_BODY = "'Times New Roman', Times, Georgia, 'Liberation Serif', serif";
const FONT_DATA = "'Times New Roman', Times, Georgia, 'Liberation Serif', serif";

const EASE = [0.22, 0.61, 0.36, 1];
const GSAP_EASE = "power3.out";

function GlobalStyle() {
  return (
    <style>{`
      .wh-root { font-family: ${FONT_BODY}; background: ${C.paper}; color: ${C.ink};
        overflow-x: hidden; }
      .wh-display { font-family: ${FONT_DISPLAY}; letter-spacing: -0.03em; line-height: 0.98; }
      .wh-data { font-family: ${FONT_DATA}; font-variant-numeric: tabular-nums; }

      .wh-mask { display: block; overflow: hidden; }
      .wh-scrub { will-change: transform; }

      .wh-root ::selection { background: ${C.husk}; color: #fff; }
      .wh-root :focus-visible { outline: 2px solid ${C.water}; outline-offset: 3px; border-radius: 2px; }
      .wh-scroll::-webkit-scrollbar { height: 6px; }
      .wh-scroll::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 99px; }

      .wh-grain { position: fixed; inset: 0; pointer-events: none; z-index: 60; opacity: .035;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E"); }
    `}</style>
  );
}

/* ----------------------------------------------------------------------------
   2 · MOTION SYSTEM (identical to ClearHarvest.jsx)
---------------------------------------------------------------------------- */
function useGsapContext(setup, deps = []) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context((self) => setup(self, scope.current), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}

const vFadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};
const vFadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};
const vStagger = (stagger = 0.09, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

function Reveal({ children, delay = 0, variants = vFadeUp, amount = 0.25, className = "", style, ...rest }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function Stagger({ children, stagger = 0.09, delay = 0, className = "", amount = 0.2, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={vStagger(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

function MaskedHeading({ text, className = "", style, delay = 0, as: Tag = "h2" }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag] || motion.h2;
  return (
    <MotionTag
      className={className}
      style={style}
      variants={vStagger(0.055, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="wh-mask"
          style={{ display: "inline-block", verticalAlign: "bottom", marginRight: i < words.length - 1 ? "0.28em" : 0 }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: "108%", opacity: 0, rotate: 2 },
              show: { y: "0%", opacity: 1, rotate: 0, transition: { duration: 0.8, ease: EASE } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

function Counter({ value, decimals = 0, duration = 1.8, className = "", style, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  useGsapContext(() => {
    const node = ref.current;
    if (!node) return;
    const obj = { v: 0 };
    const fmt = (n) =>
      decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-IN");
    node.textContent = `${prefix}0${suffix}`;
    gsap.to(obj, {
      v: value,
      duration,
      ease: "power2.out",
      snap: decimals ? { v: 1 / Math.pow(10, decimals) } : { v: 1 },
      onUpdate: () => { node.textContent = `${prefix}${fmt(obj.v)}${suffix}`; },
      scrollTrigger: { trigger: node, start: "top 88%", once: true },
    });
  }, [value]);
  return <span ref={ref} className={className} style={style} />;
}

function Magnetic({ children, strength = 0.35, className = "", style, ...rest }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });
  const onMove = useCallback(
    (e) => {
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - (r.left + r.width / 2)) * strength);
      my.set((e.clientY - (r.top + r.height / 2)) * strength);
    },
    [mx, my, strength]
  );
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, ...style }}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function useBatchReveal(selector, opts = {}) {
  return useGsapContext((self, el) => {
    const items = gsap.utils.toArray(selector, el);
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 34 });
    ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: GSAP_EASE,
          stagger: opts.stagger ?? 0.08,
          overwrite: true,
        }),
    });
  }, []);
}

/* ---- shared chrome ----------------------------------------------------- */
function Eyebrow({ children, color = C.husk, className = "" }) {
  return (
    <div className={`wh-data text-xs uppercase ${className}`} style={{ color, letterSpacing: "0.18em", fontWeight: 600 }}>
      {children}
    </div>
  );
}

function SectionHead({ index, title, lede, tone = "light" }) {
  const fg = tone === "dark" ? "#fff" : C.field;
  const body = tone === "dark" ? "rgba(255,255,255,.72)" : C.mute;
  const rule = tone === "dark" ? "rgba(255,255,255,.18)" : C.line;
  return (
    <div className="mb-10 md:mb-14">
      <Stagger stagger={0.1}>
        <motion.div variants={vFadeIn} className="flex items-baseline gap-4">
          <span className="wh-data text-sm" style={{ color: C.husk, fontWeight: 600 }}>{index}</span>
          <motion.span
            style={{ height: 1, background: rule, transformOrigin: "left center", flex: 1 }}
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease: EASE } } }}
          />
        </motion.div>
      </Stagger>
      <MaskedHeading
        text={title}
        className="wh-display mt-4 text-3xl md:text-5xl"
        style={{ color: fg, fontWeight: 800, maxWidth: "26ch" }}
        delay={0.1}
      />
      {lede && (
        <Reveal delay={0.18}>
          <p className="mt-5 text-base md:text-lg" style={{ color: body, maxWidth: "68ch", lineHeight: 1.65 }}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}

function Section({ id, children, tone = "light", className = "" }) {
  return (
    <section
      id={id}
      className={`px-5 md:px-10 py-20 md:py-28 ${className}`}
      style={{ background: tone === "dark" ? C.ink : tone === "tint" ? C.paperDim : C.paper }}
    >
      <div className="mx-auto" style={{ maxWidth: 1180 }}>{children}</div>
    </section>
  );
}

/** Drop-in image frame - same contract as ClearHarvest's PhotoSlot: give it a
 *  `src` and it renders full-bleed with an optional caption bar. Every use in
 *  this file already has a real `src` from the PDF. */
function PhotoSlot({ ratio, src, alt, className = "", caption }) {
  return (
    <figure className={className}>
      <div
        className="relative overflow-hidden rounded-lg"
        style={ratio
          ? { aspectRatio: ratio, background: C.paperDim, border: `1px solid ${C.line}` }
          : { background: C.paperDim, border: `1px solid ${C.line}`, lineHeight: 0 }}
      >
        <img
          src={src}
          alt={alt}
          style={ratio
            ? { width: "100%", height: "100%", objectFit: "cover" }
            : { width: "100%", height: "auto", display: "block" }}
        />
      </div>
      {caption && (
        <figcaption className="wh-data mt-2" style={{ fontSize: 11, color: C.mute, lineHeight: 1.6, fontStyle: "italic" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ----------------------------------------------------------------------------
   3 · SIGNATURE - grain moisture gauge
   Decorative scroll-position chrome (mirrors ClearHarvest's AWD tube gauge),
   not a data claim - no figure in the PDF is attached to it.
---------------------------------------------------------------------------- */
function MoistureGauge() {
  const fill = useRef(null);
  const label = useRef(null);

  const scope = useGsapContext((self, el) => {
    const TOP = 10, H = 168, BOTTOM = TOP + H;
    gsap.matchMedia().add(
      { ok: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)" },
      () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: 30 },
          {
            autoAlpha: 1, x: 0, duration: 0.9, ease: GSAP_EASE,
            scrollTrigger: { trigger: document.body, start: "top+=520 top", toggleActions: "play none none reverse" },
          }
        );
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (st) => {
            const cycle = (Math.sin(st.progress * Math.PI * 6 - Math.PI / 2) + 1) / 2;
            const level = 0.18 + cycle * 0.62;
            const h = H * level;
            gsap.set(fill.current, { attr: { y: BOTTOM - h, height: h } });
            if (label.current) label.current.textContent = `${(10 + cycle * 4).toFixed(1)}%`;
          },
        });
      }
    );
  }, []);

  return (
    <div
      ref={scope}
      className="fixed z-40 hidden lg:flex flex-col items-center gap-2"
      style={{ right: 26, top: "50%", transform: "translateY(-50%)", opacity: 0 }}
      aria-hidden="true"
    >
      <div className="wh-data" style={{ fontSize: 9, letterSpacing: ".14em", color: C.mute }}>GRAIN MOISTURE</div>
      <svg width="46" height="190" viewBox="0 0 46 190">
        <defs>
          <clipPath id="whTubeClip"><rect x="12" y="10" width="22" height="168" rx="11" /></clipPath>
        </defs>
        <rect x="12" y="10" width="22" height="168" rx="11" fill="#fff" stroke={C.line} />
        <g clipPath="url(#whTubeClip)">
          <rect ref={fill} x="12" y="120" width="22" height="58" fill={C.husk} opacity="0.85" />
        </g>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx="23" cy={30 + i * 19} r="1.6" fill={C.field} opacity="0.35" />
        ))}
        <line x1="6" y1="132" x2="40" y2="132" stroke={C.leaf} strokeWidth="1" strokeDasharray="3 3" />
      </svg>
      <div ref={label} className="wh-data text-center" style={{ fontSize: 10, color: C.field, fontWeight: 600 }}>
        12.0%
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   4 · TOP BAR
   Nav items now mirror the PDF's own table of contents.
---------------------------------------------------------------------------- */
const NAV = [
  ["summary", "Overview"], ["programme", "Programme"], ["verification", "Verification"],
  ["performance", "GHG Performance"], ["sourcing", "Sourcing"], ["impact", "Impact"],
  ["engagement", "Engagement"], ["glance", "At a Glance"], ["confidentiality", "Confidentiality"],
];

function TopBar() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("summary");
  const bar = useRef(null);

  const scope = useGsapContext(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1, ease: "none", transformOrigin: "left center",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
      }
    );
    ScrollTrigger.create({
      trigger: document.body, start: "top+=90 top",
      onEnter: () => setSolid(true), onLeaveBack: () => setSolid(false),
    });
    NAV.forEach(([id]) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el, start: "top 45%", end: "bottom 45%",
        onToggle: (st) => st.isActive && setActive(id),
      });
    });
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <motion.header
      ref={scope}
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
      style={{
        background: solid ? "rgba(32,24,11,.92)" : "transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
        transition: "background .4s ease, backdrop-filter .4s ease",
      }}
    >
      <div className="flex items-center gap-4 px-5 md:px-10" style={{ height: 58 }}>
        <Magnetic strength={0.2}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
            <LogoSlot name="Grow Indigo" src={wheatPartnerLogo} light height={26} />
          </button>
        </Magnetic>

        <LayoutGroup id="wh-nav">
          <nav className="wh-scroll flex-1 hidden md:flex gap-1 overflow-x-auto">
            {NAV.map(([id, labelText]) => (
              <button
                key={id}
                onClick={() => go(id)}
                className="relative wh-data px-3 py-1.5 rounded"
                style={{ fontSize: 10.5, letterSpacing: ".08em", color: active === id ? "#fff" : "rgba(255,255,255,.55)", whiteSpace: "nowrap", transition: "color .3s ease" }}
              >
                {active === id && (
                  <motion.span
                    layoutId="wh-nav-pill"
                    className="absolute inset-0 rounded"
                    style={{ background: "rgba(255,255,255,.12)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{labelText.toUpperCase()}</span>
              </button>
            ))}
          </nav>
        </LayoutGroup>

        <div className="ml-auto md:ml-0">
          <LogoSlot name="ClearHarvest" src={wheatProgrammeLogo} align="right" light height={26} />
        </div>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,.12)" }}>
        <div ref={bar} style={{ height: 2, background: C.husk, transformOrigin: "left center" }} />
      </div>
    </motion.header>
  );
}

/* ----------------------------------------------------------------------------
   5 · HERO
   Title, subtitle and meta are the report's actual cover page. Background is
   the report's own cover photograph rather than an illustrated field.
---------------------------------------------------------------------------- */
const HERO_LINES = [["Decarbonizing"], ["Nestlé's", "Wheat", "Value"], ["Chain"]];
const HERO_META = [
  ["Reporting period", "Rabi Season 2025"],
  ["Implementation partner", "Grow Indigo"],
  ["Geography", "Ludhiana, Punjab"],
  ["Sowing method", "Happy Seeder"],
];

function Hero() {
  const scope = useGsapContext((self, el) => {
    const q = gsap.utils.selector(el);
    gsap.set(q(".hero-word"), { yPercent: 115 });
    gsap.set([q(".hero-eyebrow"), q(".hero-lede"), q(".hero-meta > *"), q(".hero-cue")], { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: GSAP_EASE } });
    tl.fromTo(q(".hero-photo"), { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }, 0)
      .to(q(".hero-eyebrow"), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
      .to(q(".hero-word"), { yPercent: 0, duration: 1.1, stagger: 0.09, ease: "expo.out" }, 0.5)
      .to(q(".hero-lede"), { autoAlpha: 1, y: 0, duration: 0.9 }, 1.05)
      .to(q(".hero-meta > *"), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 1.2)
      .to(q(".hero-cue"), { autoAlpha: 1, y: 0, duration: 0.6 }, 1.6);

    gsap.matchMedia().add({ ok: "(prefers-reduced-motion: no-preference)" }, () => {
      gsap.to(q(".hero-content"), {
        yPercent: -14, autoAlpha: 0, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
      });
      gsap.to(q(".hero-photo"), {
        yPercent: 12, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
      });
    });
  }, []);

  return (
    <div ref={scope} className="relative flex flex-col justify-end" style={{ minHeight: "100vh", background: C.ink }}>
      <div className="hero-photo absolute inset-0 w-full h-full wh-scrub" aria-hidden="true">
        <img src={heroFarmerPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(32,24,11,.55) 0%, rgba(32,24,11,.55) 45%, rgba(32,24,11,.92) 100%)" }} />
      </div>

      <div className="hero-content relative px-5 md:px-10 pb-16 md:pb-24 pt-32 mx-auto w-full wh-scrub" style={{ maxWidth: 1180 }}>
        <div className="hero-eyebrow">
          <div style={{ maxWidth: 560 }}>
            <LogoLockup light height={38} />
          </div>
          <div className="mt-8">
            <Eyebrow color={C.husk}>Emission Quantification Report for Rabi Wheat 2025</Eyebrow>
          </div>
        </div>

        <h1 className="wh-display mt-6" style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(2.2rem, 6.4vw, 5.2rem)", maxWidth: "20ch" }}>
          {HERO_LINES.map((line, li) => (
            <span key={li} className="wh-mask">
              {line.map((w, wi) => (
                <span
                  key={wi}
                  className="hero-word"
                  style={{ display: "inline-block", marginRight: wi < line.length - 1 ? "0.28em" : 0 }}
                >
                  {w}
                  {li === HERO_LINES.length - 1 && wi === line.length - 1 ? <span style={{ color: C.husk }}>.</span> : null}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p className="hero-lede mt-7 text-lg md:text-xl" style={{ color: "rgba(255,255,255,.78)", maxWidth: "56ch", lineHeight: 1.6 }}>
          The programme enrolled low-carbon wheat farmers across Ludhiana district, Punjab, grouped by their
          delivering processor.
        </p>

        <div className="hero-meta mt-10 flex flex-wrap gap-x-10 gap-y-5">
          {HERO_META.map(([k, v]) => (
            <div key={k}>
              <div className="wh-data" style={{ fontSize: 9.5, letterSpacing: ".16em", color: "rgba(255,255,255,.45)" }}>
                {k.toUpperCase()}
              </div>
              <div style={{ color: "#fff", fontWeight: 500, fontSize: 15, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-cue relative pb-8 flex justify-center" aria-hidden="true">
        <motion.svg
          width="20" height="26" viewBox="0 0 20 26"
          animate={{ y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M10 2v20M3 15l7 7 7-7" stroke="rgba(255,255,255,.6)" strokeWidth="1.4" fill="none" />
        </motion.svg>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   6 · SECTION 1 - PROGRAMME OVERVIEW
   Key highlights table, the overview infographic, the enrolled-fields map and
   the identity-preservation aerial photo - all as they appear in the PDF.
---------------------------------------------------------------------------- */
const KEY_HIGHLIGHTS = [
  ["Location", "Ludhiana, Punjab"],
  ["Processors", "Gillco Agro, Golden Wheat & Allied Mills, Kohinoor Agro Foods, Ludhiana Flour Mills"],
  ["Farmers", "273"],
  ["Area", "5905 (in acres)"],
  ["Quantity", "7260.9 MT"],
  ["Sowing Method", "Happy Seeder"],
];

function HighlightsTable() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
      {KEY_HIGHLIGHTS.map(([k, v], i) => (
        <div key={k} className="grid sm:grid-cols-3" style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
          <div className="px-5 py-4 sm:col-span-1" style={{ background: C.field, color: "#fff", fontWeight: 600, fontSize: 14 }}>
            {k}
          </div>
          <div className="px-5 py-4 sm:col-span-2" style={{ background: i % 2 ? C.paperDim : "#fff", fontSize: 14.5, color: C.ink }}>
            {v}
          </div>
        </div>
      ))}
    </div>
  );
}

function OverviewSection() {
  return (
    <Section id="summary" tone="tint">
      <SectionHead
        index="01"
        title="Programme Overview"
        lede="The programme enrolled low-carbon wheat farmers across Ludhiana district, Punjab, grouped by their delivering processor. The table below summarises the key programme parameters."
      />

      <Reveal>
        <PhotoSlot src={overviewInfographic} alt="Decarbonizing Nestlé's Wheat Value Chain - Rabi Season 2025" caption="Decarbonizing Nestlé's Wheat Value Chain - Rabi Season 2025" />
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <Eyebrow>Key highlights</Eyebrow>
        <div className="mt-4"><HighlightsTable /></div>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-2 mt-14">
        <Reveal>
          <PhotoSlot src={enrolledFieldsMap} alt="Enrolled fields grouped by processor - Ludhiana District" caption="Enrolled fields grouped by processor - Ludhiana District" />
        </Reveal>
        <Reveal delay={0.1}>
          <PhotoSlot ratio="4 / 3" src={identityPreservationAerial} alt="Identity-Preservation of Low-Carbon Wheat Grown at Enrolled Farms in Ludhiana" caption="Identity-Preservation of Low-Carbon Wheat Grown at Enrolled Farms in Ludhiana" />
        </Reveal>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   7 · PINNED STATEMENT
   The tagline is quoted directly from the overview infographic.
---------------------------------------------------------------------------- */
const BIG_PICTURE = "From High Emissions to Measurable Impact – A Low-Carbon Wheat Future.";

function PinnedStatement() {
  const scope = useGsapContext((self, el) => {
    const words = el.querySelectorAll(".pin-word");
    gsap.matchMedia().add(
      {
        desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        compact: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        if (ctx.conditions.desktop) {
          gsap
            .timeline({
              scrollTrigger: { trigger: el, start: "top top", end: "+=90%", pin: true, scrub: 0.5, anticipatePin: 1 },
            })
            .fromTo(words, { opacity: 0.14, filter: "blur(1px)" },
              { opacity: 1, filter: "blur(0px)", stagger: 0.08, ease: "none" });
        } else {
          gsap.fromTo(words, { opacity: 0.2 },
            { opacity: 1, stagger: 0.03, duration: 0.5, scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        }
      }
    );
  }, []);

  return (
    <div ref={scope} className="flex items-center justify-center px-5" style={{ minHeight: "60vh", background: C.field }}>
      <div className="mx-auto text-center" style={{ maxWidth: 900 }}>
        <Eyebrow color={C.husk}>The big picture</Eyebrow>
        <p className="wh-display mt-6" style={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.5rem,3.4vw,2.6rem)", lineHeight: 1.28 }}>
          {BIG_PICTURE.split(" ").map((w, i) => (
            <span key={i} className="pin-word" style={{ display: "inline-block", marginRight: "0.28em" }}>{w}</span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   8 · SECTION 2 - DIGITALLY-DRIVEN REGENERATIVE WHEAT PROGRAMME
   Tech-enabled delivery blurb, the crop calendar, the app-screenshot sequence
   and the Low Carbon Wheat Journey infographic.
---------------------------------------------------------------------------- */
const APP_SCREENS = [
  [appOtp, "Field Khata App - farmer OTP verification"],
  [appFieldTag, "Field Tag - geofenced plot boundary capture"],
  [appSampleSurvey, "Sample Survey - organic amendment & fuel-use data capture"],
  [appAadhaarBank, "Aadhaar & bank details verification"],
  [appAarhtiya, "Aarhtiya - farmer QR / unique code lookup"],
];

function ProgrammeSection() {
  const grid = useBatchReveal(".app-shot", { stagger: 0.08 });
  return (
    <Section id="programme">
      <SectionHead
        index="02"
        title="Digitally-Driven Regenerative Wheat Programme"
        lede="Low-carbon wheat, grown using regenerative practices like reduced tillage and optimised fertiliser use, was seamlessly traced and delivered to Nestlé's processors through our tech-enabled infrastructure."
      />

      <Reveal>
        <div className="p-7 rounded-lg" style={{ background: C.paperDim, border: `1px solid ${C.line}` }}>
          <Eyebrow>Tech-Enabled Regenerative Delivery</Eyebrow>
          <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.75, color: C.ink }}>
            Low-carbon wheat, grown using regenerative practices like <strong>reduced tillage</strong> and{" "}
            <strong>optimised fertiliser use</strong>, was seamlessly traced and delivered to Nestlé's processors
            through our tech-enabled infrastructure.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <PhotoSlot src={cropCalendar} alt="Reduced-tillage crop calendar - intervention timeline across the Rabi season" caption="Reduced-tillage crop calendar - intervention timeline across the Rabi season" />
      </Reveal>

      <Reveal delay={0.14} className="mt-14">
        <p style={{ fontSize: 15, lineHeight: 1.75, color: C.mute, maxWidth: "72ch" }}>
          Our digital tools enabled <strong style={{ color: C.ink }}>field-level data capture</strong>,{" "}
          <strong style={{ color: C.ink }}>monitoring</strong>, and{" "}
          <strong style={{ color: C.ink }}>end-to-end transparency</strong> - from geofenced plots and verified
          farmer IDs to supply chain transactions.
        </p>
      </Reveal>
      <div ref={grid} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mt-6">
        {APP_SCREENS.map(([src, label], i) => (
          <div key={i} className="app-shot">
            <PhotoSlot ratio="9 / 16" src={src} alt={label} />
          </div>
        ))}
      </div>
      <Reveal delay={0.06} className="mt-3">
        <div className="wh-data text-center" style={{ fontSize: 11, color: C.mute, fontStyle: "italic" }}>
          Farmer onboarding, field-level data collection &amp; supply chain audit trail
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <PhotoSlot src={lowCarbonJourney} alt="Low Carbon Wheat Journey - Responsible farming. Verified practices. Measurable impact." caption="Low Carbon Wheat Journey - Responsible farming. Verified practices. Measurable impact." />
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   9 · SECTION 3 - INDEPENDENT VERIFICATION - ONE PETERSON
   The 3-step carbon accounting & audit pipeline, exactly as tabled in the PDF.
---------------------------------------------------------------------------- */
const PIPELINE = ["Data Collection", "3rd-Party Audit", "GHG Calculation"];
const PIPELINE_COLORS = [C.field, C.inkSoft, C.husk];

const VERIFICATION_TABLE = [
  ["Data Collection", "Field-level agronomy data was digitally recorded by enrolled farmers via the Grow Indigo ClearHarvest application at each key intervention event.", "273 wheat farmers participated across Ludhiana district."],
  ["Independent Audit", "One Peterson conducted on-site field visits to a statistically representative sample of enrolled farms, verifying recorded data against observed practices.", "17 randomly selected farms were independently audited and verified."],
  ["GHG Impact Calculation", "Emission reductions were quantified using the Cool Farm Tool, applying GHG Protocol Scope 3 and IPCC Tier 1 guidelines.", "Results validated and formatted for Nestlé sustainability reporting."],
];

function PipelineSteps() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3">
      {PIPELINE.map((label, i) => (
        <React.Fragment key={label}>
          <motion.div
            className="flex-1 flex items-center justify-center px-6 py-5 rounded"
            style={{ background: PIPELINE_COLORS[i], color: "#fff", fontWeight: 700, fontSize: 15 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
          >
            {label}
          </motion.div>
          {i < PIPELINE.length - 1 && (
            <div className="hidden sm:flex items-center justify-center" style={{ color: C.mute, fontSize: 20 }}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function VerificationSection() {
  return (
    <Section id="verification" tone="tint">
      <SectionHead index="03" title="Independent Verification - One Peterson" lede="Carbon accounting & audit pipeline." />
      <Reveal><PipelineSteps /></Reveal>

      <Reveal delay={0.12} className="mt-10">
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          <div className="hidden md:grid grid-cols-3" style={{ background: C.field }}>
            {["Step", "What We Did", "Key Facts"].map((h) => (
              <div key={h} className="px-5 py-3" style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{h}</div>
            ))}
          </div>
          {VERIFICATION_TABLE.map(([step, did, facts], i) => (
            <div key={step} className="grid md:grid-cols-3" style={{ borderTop: i ? `1px solid ${C.line}` : "none", background: i % 2 ? C.paperDim : "#fff" }}>
              <div className="px-5 py-4" style={{ fontWeight: 600, fontSize: 14.5, color: C.ink }}>{step}</div>
              <div className="px-5 py-4" style={{ fontSize: 13.5, lineHeight: 1.65, color: C.mute }}>{did}</div>
              <div className="px-5 py-4" style={{ fontSize: 13.5, lineHeight: 1.65, color: C.field, fontWeight: 600 }}>{facts}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <PhotoSlot ratio="16 / 9" src={baggedWheatPhoto} alt="Low-Carbon Wheat Separately Packed in White Identifiable Bags" caption="Low-Carbon Wheat Separately Packed in White Identifiable Bags - Regen wheat is packed separately in distinct, easily identifiable white bags." />
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   10 · SECTION 4 - VERIFIED GHG PERFORMANCE
   The PDF's own emission-reductions chart and impact table were never filled
   in (every cell read "Xxxx"/"Xxx") - since that data doesn't exist anywhere,
   those two blocks are omitted rather than shown empty. Yield performance and
   the SDGs impacted are both real, filled-in figures from the PDF and are
   kept in full.
---------------------------------------------------------------------------- */
const SDGS = [
  [2, "Zero Hunger", "#DDA63A"],
  [8, "Decent Work and Economic Growth", "#A21942"],
  [12, "Responsible Consumption and Production", "#BF8B2E"],
  [13, "Climate Action", "#3F7E44"],
  [15, "Life on Land", "#56C02B"],
];

function PerformanceSection() {
  return (
    <Section id="performance">
      <SectionHead index="04" title="Verified GHG Performance" lede="Emission reductions & impact." />

      <Reveal className="mt-10">
        <div className="p-7 rounded-lg" style={{ background: C.paperDim, border: `1px solid ${C.line}` }}>
          <Eyebrow>Yield Performance</Eyebrow>
          <p className="mt-3" style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>
            This year: 2.0 MT/acre &nbsp;|&nbsp; Last year: 2.2 MT/acre (– ~9% YoY)
          </p>
          <p className="mt-3 italic" style={{ fontSize: 13.5, lineHeight: 1.7, color: C.mute }}>
            Likely contributing factors: unseasonal/off-season rainfall and cloudy spells during the grain-filling
            stage, terminal heat stress in late-sown plots, and localised pest-disease pressure - seasonal
            variables common across Punjab wheat this Rabi cycle, rather than a programme-practice effect.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Eyebrow>SDGs Impacted</Eyebrow>
        <div className="flex flex-wrap gap-3 mt-4">
          {SDGS.map(([n, label, color]) => (
            <div key={n} className="flex flex-col justify-between p-3 rounded" style={{ background: color, color: "#fff", width: 130, height: 130 }}>
              <div className="wh-display" style={{ fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   11 · SECTION 5 - RESPONSIBLE SOURCING
   Six cards, verbatim from the PDF - including its own "xx" placeholders.
---------------------------------------------------------------------------- */
const SOURCING_CARDS = [
  ["Farmer Welfare & Livelihoods", C.husk, "Sustainability incentive payments disbursed directly to 273 enrolled farmers, improving incomes and incentivising continued regenerative practice adoption."],
  ["Soil Health & Biodiversity", C.leaf, "Elimination of crop residue burning and zero-tillage methods preserved soil organic matter, reduced particulate air pollution, and supported long-term land productivity."],
  ["Traceability & Transparency", C.waterDeep, "Geofenced plots, white identifiable bags and segregated processor storage ensure complete identity preservation from farm gate to Nestlé supply chain."],
  ["Third-Party Assurance", C.clay, "One Peterson independently audited 17 sampled farms. GHG Protocol & IPCC Tier 1 guidelines applied for audit-grade credibility and Nestlé reporting alignment."],
];

function SourcingSection() {
  const grid = useBatchReveal(".sourcing-card", { stagger: 0.08 });
  return (
    <Section id="sourcing" tone="dark">
      <SectionHead
        index="05"
        tone="dark"
        title="Responsible Sourcing"
        lede="This programme directly advances Nestlé's Responsible Sourcing commitments by embedding verified sustainability metrics - from field-level data collection to third-party audit - across the entire wheat supply chain."
      />
      <div ref={grid} className="grid gap-4 sm:grid-cols-2">
        {SOURCING_CARDS.map(([title, color, body]) => (
          <div key={title} className="sourcing-card p-6 rounded-lg" style={{ borderTop: `3px solid ${color}`, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderTopWidth: 3, borderTopColor: color }}>
            <h4 className="wh-display text-lg" style={{ color: "#fff", fontWeight: 700 }}>{title}</h4>
            <p className="mt-3" style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,.72)" }}>{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   12 · SECTION 6 - IMPACT ON SOIL, WATER & FARMER COMPETENCIES
---------------------------------------------------------------------------- */
const COMPETENCY_COLUMNS = [
  [
    "Soil Health", C.field, "Practice adopted: Zero-tillage · No residue burning",
    [
      "Zero-tillage (Happy Seeder) and elimination of residue burning preserved soil organic matter and cut particulate air pollution.",
      "CRM-based dosing - Oorjit Granules (6 kg/acre) & Grow Phos (20 kg/acre) - lowered synthetic input load on soil.",
      "IPM adoption (all four principles) protected beneficial soil biodiversity from chemical overuse.",
    ],
  ],
  [
    "Water Stewardship", C.water, null,
    [
      "Optimised irrigation practices conserved water in a region subject to seasonal water stress.",
      "Need-based, CRM-guided fertiliser application reduced nutrient runoff risk to local water bodies.",
      "Sowing-stage water management (AWD) supports the programme's broader water-efficiency goal.",
    ],
  ],
  [
    "Farmer Competencies", C.husk, "Farmers upskilled: 273 enrolled farmers",
    [
      "Digital literacy: geofencing, e-KYC and field data capture via the Grow Indigo ClearHarvest app.",
      "Agronomic skill-building: Happy Seeder operation and zero-till sowing technique.",
      "New nutrient & pest management competency: CRM dosing and all four IPM principles.",
      "Direct incentive payments from Grow Indigo reinforced sustained practice adoption.",
    ],
  ],
];

function CompetencySection() {
  const grid = useBatchReveal(".competency-card", { stagger: 0.1 });
  return (
    <Section id="impact" tone="tint">
      <SectionHead
        index="06"
        title="Impact on Soil, Water & Farmer Competencies"
        lede="This programme's regenerative practices reach beyond emissions - improving soil and water outcomes while building lasting farmer capability. Each theme below is verified and reported in detail elsewhere in this document."
      />
      <div ref={grid} className="grid gap-5 lg:grid-cols-3">
        {COMPETENCY_COLUMNS.map(([title, color, headline, bullets]) => (
          <div key={title} className="competency-card rounded-lg overflow-hidden" style={{ background: "#fff", border: `1px solid ${C.line}`, borderTop: `3px solid ${color}` }}>
            <div className="p-6">
              <h4 className="wh-display text-xl" style={{ color, fontWeight: 700 }}>{title}</h4>
              {headline && (
                <div className="mt-3 p-3 rounded" style={{ background: C.paperDim, fontSize: 13, fontWeight: 600, color: C.ink }}>{headline}</div>
              )}
              <ul className="mt-5 space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5" style={{ fontSize: 13.5, lineHeight: 1.6, color: C.mute }}>
                    <span style={{ color }}>▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   13 · SECTION 7 - FIELD ENGAGEMENT - VILLAGE-LEVEL SESSIONS
---------------------------------------------------------------------------- */
function EngagementSection() {
  return (
    <Section id="engagement">
      <SectionHead index="07" title="Field Engagement - Village-Level Sessions" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <PhotoSlot ratio="4 / 3" src={stakeholderMeetingPhoto} alt="Meeting with Local Stakeholders - Village-Level Carbon Farming Sessions" caption="Meeting with Local Stakeholders - Village-Level Carbon Farming Sessions" />
        </Reveal>
        <Reveal delay={0.1}>
          <PhotoSlot ratio="4 / 3" src={villageMeetingPhoto} alt="Village-Level Meeting with Farmers" caption="Village-Level Meeting with Farmers" />
        </Reveal>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   14 · SECTION 8 - PROGRAMME AT A GLANCE
---------------------------------------------------------------------------- */
const GLANCE_TILES = [
  ["Location", "Ludhiana, Punjab"],
  ["Farmers", "273 enrolled"],
  ["Area", "5905 acres"],
  ["Volume", "7260.9 MT procured"],
  ["Audit", "One Peterson verified"],
  ["Method", "Cool Farm Tool (CFT)"],
];

function GlanceSection() {
  const grid = useBatchReveal(".glance-tile", { stagger: 0.06 });
  return (
    <Section id="glance" tone="tint">
      <SectionHead index="08" title="Programme at a Glance" />
      <Reveal><PhotoSlot ratio="16 / 9" src={glanceAerialPhoto} alt="Aerial view of low-carbon wheat fields" /></Reveal>
      <div ref={grid} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-10">
        {GLANCE_TILES.map(([label, value]) => (
          <div key={label} className="glance-tile p-6 rounded-lg text-center" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
            <div className="wh-display" style={{ fontWeight: 800, fontSize: "1.3rem", color: C.field }}>{value}</div>
            <div className="wh-data mt-2" style={{ fontSize: 10.5, color: C.mute, letterSpacing: ".1em" }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   15 · LOGO LOCKUP
---------------------------------------------------------------------------- */
function LogoSlot({ name, src, align = "left", light = false, height = 34 }) {
  const fg = light ? "rgba(255,255,255,.55)" : C.mute;
  const edge = light ? "rgba(255,255,255,.22)" : C.line;
  return (
    <div style={{ display: "flex", justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      {src ? (
        <img src={src} alt={`${name} logo`} style={{ height, width: "auto", display: "block" }} />
      ) : (
        <div
          className="flex items-center justify-center rounded"
          style={{ height, width: height * 3.6, border: `1px dashed ${edge}`, background: light ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.02)" }}
          aria-label={`${name} logo placeholder`}
        >
          <span className="wh-data" style={{ fontSize: 8.5, letterSpacing: ".12em", color: fg, textAlign: "center", lineHeight: 1.35 }}>
            {name.toUpperCase()}
            <br />LOGO
          </span>
        </div>
      )}
    </div>
  );
}

function LogoLockup({ light = false, height = 34, rule = true }) {
  return (
    <div className="flex items-center gap-5 w-full">
      <LogoSlot name="Grow Indigo" src={wheatPartnerLogo} align="left" light={light} height={height} />
      {rule && <span style={{ flex: 1, height: 1, background: light ? "rgba(255,255,255,.18)" : C.line }} />}
      <LogoSlot name="ClearHarvest" src={wheatProgrammeLogo} align="right" light={light} height={height} />
    </div>
  );
}

/* ----------------------------------------------------------------------------
   16 · SECTION 9 - CONFIDENTIALITY + CLOSING
---------------------------------------------------------------------------- */
function Closing() {
  return (
    <footer style={{ background: C.ink }}>
      <Section id="confidentiality" tone="dark" className="!py-16 md:!py-20">
        <SectionHead index="09" tone="dark" title="Confidentiality" />
        <Reveal>
          <p style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.75, maxWidth: "80ch" }}>
            This document and the data contained within it are strictly confidential and intended for company use
            only. It has been prepared by Grow Indigo for Nestlé in connection with the Low-Carbon Wheat Programme
            (Rabi 2025) and may not be reproduced, distributed, or disclosed to any third party, in whole or in
            part, without the prior written consent of Grow Indigo and Nestlé.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-6">
          <div className="p-6 rounded-lg text-center" style={{ background: C.field }}>
            <div className="wh-data" style={{ color: C.husk, fontWeight: 700, letterSpacing: ".14em" }}>★ STRICTLY CONFIDENTIAL ★</div>
            <div className="mt-2 italic" style={{ color: "rgba(255,255,255,.85)" }}>Strictly confidential – for company use only.</div>
          </div>
        </Reveal>
      </Section>

      <div className="mx-auto px-5 md:px-10 py-14" style={{ maxWidth: 1180, borderTop: "1px solid rgba(255,255,255,.15)" }}>
        <LogoLockup light height={40} />
        <div className="wh-data mt-8 text-center" style={{ fontSize: 10.5, color: "rgba(255,255,255,.4)", letterSpacing: ".1em" }}>
          DECARBONIZING NESTLÉ'S WHEAT VALUE CHAIN · LUDHIANA, PUNJAB · RABI SEASON 2025
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------------------
   17 · ROOT
---------------------------------------------------------------------------- */
export default function WheatHarvestReport() {
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="wh-root">
      <GlobalStyle />
      <div className="wh-grain" aria-hidden="true" />
      <TopBar />
      <MoistureGauge />

      <main>
        <Hero />
        <OverviewSection />
        <PinnedStatement />
        <ProgrammeSection />
        <VerificationSection />
        <PerformanceSection />
        <SourcingSection />
        <CompetencySection />
        <EngagementSection />
        <GlanceSection />
      </main>

      <Closing />
    </div>
  );
}

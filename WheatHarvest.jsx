/* ============================================================================
   WheatHarvest - Low-Carbon Wheat Programme
   Rabi Season 2025 · Grow Indigo / ClearHarvest
   ----------------------------------------------------------------------------
   Content source: "LC Wheat Programme.docx" - restructured section-for-section
   to match that document's own table of contents (14 sections). Nothing in
   this file states a fact, figure or claim that isn't drawn directly from
   that document. Photographs and figures are the document's own field
   evidence, extracted from it directly; a small number of scanned farmer-diary
   / procurement-receipt images have had personally identifying fields
   (names, phone numbers, addresses, bank details) redacted before use.

   Design tokens, motion system and shared chrome are unchanged - only content
   and section structure were replaced, per the document restructure.
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
   PHOTO / MEDIA IMPORTS - LOW-CARBON WHEAT PROGRAMME DOCX ONLY
   Every image below was extracted directly from "LC Wheat Programme.docx" and
   lives in src/assets/wheat/docx/ and src/assets/wheat/brand/. Nothing here is
   a placeholder image.
---------------------------------------------------------------------------- */
import wheatPartnerLogo from "./src/assets/wheat/brand/gilogo1.png";
import wheatProgrammeLogo from "./src/assets/wheat/brand/chnlogo-removebg.png";

import heroCoverPhoto from "./src/assets/wheat/docx/hero-cover.jpeg";
import enrolledFieldsMap from "./src/assets/wheat/docx/enrolled-fields-map.jpg";
import identityPreservationAerial from "./src/assets/wheat/docx/identity-preservation-aerial.png";
import governanceOrgChart from "./src/assets/wheat/docx/governance-org-chart.png";
import monitoringApp1 from "./src/assets/wheat/docx/monitoring-app-1.jpeg";
import monitoringApp2 from "./src/assets/wheat/docx/monitoring-app-2.jpeg";
import monitoringApp3 from "./src/assets/wheat/docx/monitoring-app-3.jpeg";
import monitoringApp4 from "./src/assets/wheat/docx/monitoring-app-4.jpeg";
import monitoringApp5 from "./src/assets/wheat/docx/monitoring-app-5.png";
import sixStepChain from "./src/assets/wheat/docx/six-step-chain.png";
import traceabilityFlow from "./src/assets/wheat/docx/traceability-flow.jpeg";
import journeyKickoff from "./src/assets/wheat/docx/journey-01-kickoff.jpeg";
import journeyVlm1 from "./src/assets/wheat/docx/journey-02-vlm1-khasikalan.jpg";
import journeyVlm2 from "./src/assets/wheat/docx/journey-03-vlm2-kotkapura.jpeg";
import journeyVlm3 from "./src/assets/wheat/docx/journey-04-vlm3-bisafarm.jpeg";
import journeyVlm4 from "./src/assets/wheat/docx/journey-05-vlm4-aulakh.jpeg";
import journeyVlm5 from "./src/assets/wheat/docx/journey-06-vlm5-nurpurbet.jpeg";
import journeyVlm6 from "./src/assets/wheat/docx/journey-07-vlm6-dhanansu.jpeg";
import journeyLowCarbonWheat from "./src/assets/wheat/docx/journey-08-lowcarbon-wheat.jpeg";
import journeyThirdPartyAudit from "./src/assets/wheat/docx/journey-09-thirdparty-audit.jpeg";
import docVlmKhasiKalan from "./src/assets/wheat/docx/doc-vlm-khasikalan.jpg";
import docStakeholderMeeting from "./src/assets/wheat/docx/doc-stakeholder-meeting.jpeg";
import docZtDemoBisa from "./src/assets/wheat/docx/doc-zt-demo-bisa.jpeg";
import docTeamNurpur from "./src/assets/wheat/docx/doc-team-nurpur.jpeg";
import farmerDiarySocioeconomic from "./src/assets/wheat/docx/farmer-diary-socioeconomic.png";
import farmerDiaryFertilizer from "./src/assets/wheat/docx/farmer-diary-fertilizer.png";
import farmerDiaryHarvesting from "./src/assets/wheat/docx/farmer-diary-harvesting.png";
import annexureVlm from "./src/assets/wheat/docx/annexure-01-vlm.jpeg";
import annexureZtField from "./src/assets/wheat/docx/annexure-02-zt-field.jpeg";
import annexureWhatsapp from "./src/assets/wheat/docx/annexure-04-whatsapp.jpeg";
import annexureHarvest from "./src/assets/wheat/docx/annexure-05-harvest.jpeg";
import annexureGrains from "./src/assets/wheat/docx/annexure-06-grains.jpeg";
import annexureReceipt from "./src/assets/wheat/docx/annexure-07-receipt.jpeg";
import annexureAudit from "./src/assets/wheat/docx/annexure-08-audit.jpeg";
import aboutGrowIndigoGraphic from "./src/assets/wheat/docx/about-grow-indigo.png";

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------------------
   1 · DESIGN TOKENS (unchanged system, wheat-toned palette)
---------------------------------------------------------------------------- */
const C = {
  ink: "#3B2F22",
  inkSoft: "#5A4632",
  field: "#B5541F",
  leaf: "#7C8C4B",
  water: "#33547A",
  waterDeep: "#1F3A54",
  husk: "#D98C3E",
  clay: "#8B5A2B",
  paper: "#FBF3E7",
  paperDim: "#F0E2CC",
  line: "#E0CFA9",
  mute: "#7A6A54",
};

const FONT_DISPLAY = "'Archivo', 'Helvetica Neue', Arial, sans-serif";
const FONT_BODY = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const FONT_DATA = "'Inter', 'Helvetica Neue', Arial, sans-serif";

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
   2 · MOTION SYSTEM (unchanged)
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
        style={{ color: fg, fontWeight: 800, maxWidth: "30ch" }}
        delay={0.1}
      />
      {lede && (
        <Reveal delay={0.18}>
          <p className="mt-5 text-base md:text-lg" style={{ color: body, maxWidth: "72ch", lineHeight: 1.65 }}>{lede}</p>
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

/** Drop-in image frame - give it a `src` and it renders full-bleed with an
 *  optional caption bar. Every use in this file already has a real `src`
 *  extracted from the docx. */
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
   3 · SIGNATURE - grain moisture gauge (decorative scroll-position chrome,
   not a data claim - no figure in the document is attached to it)
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
   4 · TOP BAR - nav mirrors the document's own table of contents
---------------------------------------------------------------------------- */
const NAV = [
  ["season", "Season"], ["fields", "Fields"], ["themes", "Themes"], ["governance", "Governance"],
  ["journey", "Journey"], ["voices", "Voices"], ["documented", "Documented"], ["practice", "Practice"],
  ["audited", "Audited"], ["timeline", "Timeline"], ["farmerimpact", "Farmer Impact"],
  ["sourcing", "Sourcing"], ["evidence", "Evidence"], ["about", "About"],
];

function TopBar() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("season");
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
   Title, lede and meta are the document's own cover page.
---------------------------------------------------------------------------- */
const HERO_LINES = [["Low-Carbon"], ["Wheat", "Programme"]];
const HERO_META = [
  ["Reporting period", "Rabi Season 2025"],
  ["Implementation partner", "Grow Indigo"],
  ["Geography", "Ludiana, Punjab"],
  ["Quantification", "Cool farm tool.v3"],
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
        <img
          src={heroCoverPhoto}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(32,24,11,.5) 0%, rgba(32,24,11,.58) 45%, rgba(32,24,11,.94) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(32,24,11,.85) 0%, rgba(32,24,11,.35) 42%, rgba(32,24,11,0) 68%)" }} />
      </div>

      <div className="hero-content relative px-5 md:px-10 pb-16 md:pb-24 pt-32 mx-auto w-full wh-scrub" style={{ maxWidth: 1180 }}>
        <div className="hero-eyebrow">
          <div style={{ maxWidth: 560 }}>
            <LogoLockup light height={38} />
          </div>
        </div>

        <h1 className="wh-display mt-8" style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(2.2rem, 6.4vw, 5.2rem)", maxWidth: "20ch" }}>
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

        <p className="hero-lede mt-7 text-lg md:text-xl" style={{ color: "rgba(255,255,255,.78)", maxWidth: "60ch", lineHeight: 1.6 }}>
          Lower-carbon wheat built around Zero Tillage, optimised fertiliser usage, residue management and
          digitally traceable field-to-processor evidence trail.
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
   6 · SHARED STAT ROW - reused for the two identical "season headline"
   result trios (Section 01 and Section 09).
---------------------------------------------------------------------------- */
function StatRow({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(([value, label, sub]) => (
        <div key={label} className="p-6 rounded-lg text-center" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
          <div className="wh-display" style={{ fontWeight: 800, fontSize: "2rem", color: C.field }}>{value}</div>
          <div className="mt-2" style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{label}</div>
          {sub && <div className="wh-data mt-1" style={{ fontSize: 11.5, color: C.mute }}>{sub}</div>}
        </div>
      ))}
    </div>
  );
}

const HEADLINE_RESULTS = [
  ["~34%", "Less nitrogen", "187.14 to 123.35 kg N/ha"],
  ["~46%", "Water saved", "1,410.03 to 760.78 m3/ha"],
  ["~101%", "Total Net GHG Benefit", "incl. soil-carbon removals"],
];

/* ----------------------------------------------------------------------------
   7 · SECTION 01 - WHAT THE SEASON DELIVERED
---------------------------------------------------------------------------- */
function SeasonSection() {
  return (
    <Section id="season" tone="tint">
      <SectionHead
        index="01"
        title="What the Season Delivered"
        lede="The Low-Carbon Wheat Programme promoted Zero/Reduced Tillage (ZT/RT) as the central practice for wheat sown after the preceding crop. The programme recorded farmer registration, field-level agronomic data including optimised fertilizer uses, crop residue management (CRM) and irrigation water use followed by an independent audit."
      />

      <Reveal>
        <StatRow stats={[
          ["273", "Farmers registered", null],
          ["5905", "Acres registered", null],
          ["7261", "Procurement quantity (MT)", null],
        ]} />
      </Reveal>

      <Reveal delay={0.1} className="mt-6">
        <StatRow stats={HEADLINE_RESULTS} />
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <Eyebrow>Why This Programme Exists?</Eyebrow>
        <div className="mt-4 space-y-5" style={{ fontSize: 15, lineHeight: 1.75, color: C.mute, maxWidth: "78ch" }}>
          <p>
            Wheat sown after paddy in Punjab is usually established through repeated tillage, with the previous
            crop's residue often burnt to clear fields fast. Tillage adds diesel use and soil disturbance at every
            pass; burning adds air pollution and strips out organic matter. Against that backdrop the programme
            built its establishment method around Zero/Reduced tillage, optimised nitrogen use and Crop residue
            management (CRM).
          </p>
          <p>
            Participating farmers adopted a revised wheat establishment approach centred on Zero/Reduced tillage.
            It enabled direct sowing through retained crop residue, replacing conventional ploughing and seedbed
            preparation with a single-pass operation. Farmer training, nutrient management, field monitoring and
            digital traceability were aligned around this practice to support consistent implementation and
            provide an auditable record of programme adoption.
          </p>
          <p>
            The project reduced GHG emissions by an average of 15.34% per MT. By integrating Soil Organic Carbon
            (SOC) sequestration, the project generated an average 100.88% total net greenhouse gas benefit over
            the baseline.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.12} className="mt-12">
        <div className="p-7 rounded-lg" style={{ background: C.ink }}>
          <Eyebrow color={C.husk}>The claim, in one line?</Eyebrow>
          <p className="wh-display mt-4" style={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.2rem,2.4vw,1.6rem)", lineHeight: 1.4 }}>
            A farmer-led model for lower-emission wheat, centred on sustainable practices and supported by
            transparent field records, independent assurance and traceable procurement.
          </p>
          <div className="wh-data mt-5" style={{ fontSize: 13, color: "rgba(255,255,255,.65)", letterSpacing: ".02em" }}>
            273 farmers enrolled · 5,905 acres covered · 17 farmers audited · 7,261 MT of wheat procured
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   8 · SECTION 02 - EVERY FIELD ON THE MAP
---------------------------------------------------------------------------- */
function FieldsSection() {
  return (
    <Section id="fields">
      <SectionHead
        index="02"
        title="Every Field on the Map"
        lede="The programme covered registered wheat farms in Punjab. Farmer identities, field boundaries and agronomic information were digitally recorded to support field-level monitoring and traceability. Field-level records were organised across four processors: Gillco Agro, Golden Wheat & Allied Mills, Kohinoor Agro Foods and Ludhiana Flour Mills. The final map shows the confirmed programme fields and distinguishes fields where practice-level data are available."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <PhotoSlot ratio="4 / 3" src={enrolledFieldsMap} alt="Enrolled fields grouped by processor, Ludhiana District" caption="Enrolled fields grouped by processor, Ludhiana District" />
        </Reveal>
        <Reveal delay={0.1}>
          <PhotoSlot ratio="4 / 3" src={identityPreservationAerial} alt="Identity-Preservation of Low-Emission Wheat Grown at Enrolled Farms in Ludhiana" caption="Identity-Preservation of Low-Emission Wheat Grown at Enrolled Farms in Ludhiana" />
        </Reveal>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   9 · SECTION 03 - THE THREE PROGRAMME THEMES
---------------------------------------------------------------------------- */
const THEME_1_BULLETS = [
  "Fewer conventional land-preparation operations compared with repeated tillage.",
  "Reduced soil disturbance during crop establishment.",
  "Residue retained within the production system instead of being openly burnt.",
  "Practical ZT/RT demonstrations conducted during farmer meetings and field exposure sessions.",
  "Field-level adoption recorded and verified through programme monitoring.",
  "Low-emission wheat segregated in distinct white PP bags during procurement to support identification and traceability.",
];

const THEME_2_BULLETS = [
  "No open-field residue burning was reinforced as a core programme practice.",
  "Farmers were sensitised on the environmental and agronomic importance of responsible crop-residue management.",
  "Residue retention, incorporation and baling were promoted as appropriate alternatives to burning.",
  "Zero/reduced Tillage machinery enabled wheat sowing through retained paddy residue, reducing the need for field clearing before sowing.",
  "Kisan Advisors reinforced no-burning practices through regular field visits, farmer meetings and practical demonstrations.",
  "Field boundaries and agronomic records were digitally captured, while remote-sensing checks supported verification of no-burning on mapped programme fields.",
  "Crop-residue management records formed part of the programme's wider monitoring, traceability and GHG-assessment framework.",
];

const THEME_3_BULLETS = [
  "Field visits by Kisan Advisors from sowing to harvest",
  "Six village-level meetings (VLMs) with live demonstrations",
  "Vernacular learning videos on Grow Indigo's YouTube channel",
  "A combined field, group and digital handholding ecosystem",
];

function ThemeBlock({ color, title, paragraphs, bullets }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "#fff", border: `1px solid ${C.line}`, borderTop: `3px solid ${color}` }}>
      <div className="p-7">
        <h4 className="wh-display text-xl" style={{ color, fontWeight: 700 }}>{title}</h4>
        <div className="mt-4 space-y-4" style={{ fontSize: 14.5, lineHeight: 1.72, color: C.mute }}>
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <ul className="mt-5 space-y-2.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5" style={{ fontSize: 13.5, lineHeight: 1.6, color: C.ink }}>
              <span style={{ color }}>▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ThemesSection() {
  const grid = useBatchReveal(".theme-card", { stagger: 0.1 });
  return (
    <Section id="themes" tone="tint">
      <SectionHead index="03" title="The Three Programme Themes" />
      <div ref={grid} className="space-y-6">
        <div className="theme-card">
          <ThemeBlock
            color={C.field}
            title="Theme 1 · Soil"
            paragraphs={[
              "Sustainable practices like Zero/Reduced tillage were the main establishment practice promoted under the wheat programme. It enabled wheat to be sown through retained paddy residue without the conventional sequence of repeated land preparation. The practice connected wheat establishment with responsible residue management and provided farmers with an alternative to open-field burning.",
              "Wheat established directly through retained paddy residue using the Zero-tillage machinery",
            ]}
            bullets={THEME_1_BULLETS}
          />
        </div>
        <div className="theme-card">
          <ThemeBlock
            color={C.leaf}
            title="Theme 2 · Crop Residue management"
            paragraphs={[
              "The Low-emission wheat Programme promoted no open-field burning of crop residue as a key principle of responsible residue management. Farmers were encouraged to manage paddy residue through appropriate alternatives such as retention, incorporation or baling, depending on field conditions and the wheat-establishment method.",
              "Sustainable practices like zero/reduced tillage, including sowing, provided farmers with a practical pathway to establish wheat directly through retained paddy residue without first burning the field. This helped connect residue management with lower soil disturbance, fewer preparatory field operations and the programme's wider low-emission objectives. The programme describes residue retention as a practical alternative to open-field burning.",
            ]}
            bullets={THEME_2_BULLETS}
          />
        </div>
        <div className="theme-card">
          <ThemeBlock
            color={C.husk}
            title="Theme 3 · Program Competencies: A High-touch, Phygital Extension Model"
            paragraphs={[
              "Kisan Advisors (KAs) conducted regular field visits throughout the wheat season, from field establishment to harvest. These visits enabled one-on-one farmer support, field-level troubleshooting and verification of zero/reduced tillage practices, fertiliser application, crop protection and residue management. Farmers received practical recommendations based on field conditions and were supported in maintaining farmer diaries to record agronomic activities, input use and cultivation expenses. Field engagement also reinforced the importance of avoiding residue burning and adopting appropriate methods for residue retention, incorporation or baling.",
              "Six Village-Level and Stakeholder Meetings were conducted during the programme period to support collective learning and farmer engagement. The sessions covered sustainable practices like zero/reduced tillage, crop residue management, balanced fertiliser application, integrated pest management and avoidance of harmful chemical categories. Practical demonstrations of zero/reduced tillage machinery, Leaf Colour Chart use and farmer-diary maintenance helped farmers understand the recommended practices under field conditions. These meetings also provided a platform for farmer interaction, peer learning and clarification of programme requirements.",
              "To extend knowledge beyond the field, Grow Indigo also used its digital learning platform, on YouTube (@growindigoindia), featuring simple, vernacular videos on regenerative agriculture, water-saving methods, soil health, and climate-smart practices. This provided continuous learning support that farmers could access anytime.",
              "Together, these field interactions, group sessions, and digital resources created a strong handholding ecosystem. The combined approach improved farmer awareness, encouraged consistent adoption of regenerative practices, and strengthened overall implementation quality across the project.",
            ]}
            bullets={THEME_3_BULLETS}
          />
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   10 · SECTION 04 - PROGRAMME GOVERNANCE AND IMPLEMENTATION
---------------------------------------------------------------------------- */
const GOVERNANCE_TABLE = [
  ["Project Management Unit", [
    "Strategic supervision and governance",
    "Alignment with Nestlé's sustainability and reporting requirements",
    "Oversight of procurement and reporting",
  ]],
  ["RBM (Regional Business Manager) / Agronomist", [
    "Led on-ground implementation with the TBM and Kisan Advisors",
    "Technical guidance on Zero/Reduced tillage machinery",
    "Farmer training on establishment method and record-keeping",
    "Quality assurance of field data and practice verification",
  ]],
  ["TBM (Territory Business Manager)", [
    "Supervised Kisan Advisors daily",
    "Coordination during procurement with processors",
    "Adherence to implementation timelines and technical protocols",
  ]],
  ["Kisan Advisors", [
    "Single point of contact for farmers",
    "Farmer engagement and mobilisation across project villages",
    "Field geofencing in the ClearHarvest application",
    "Field visits and Zero/Reduced tillage machinery demonstration",
  ]],
  ["Scientists", [
    "Quality checks on field mapping and monitoring of field activities",
    "GHG emission quantification and nitrogen-reduction assessment",
  ]],
  ["Engineering Team", [
    "Upgradation and maintenance of the ClearHarvest application",
    "Digital traceability and audit-trail generation, farm to processor",
  ]],
];

function GovernanceTable() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
      <div className="hidden md:grid grid-cols-3" style={{ background: C.field }}>
        <div className="px-5 py-3 col-span-1" style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Role</div>
        <div className="px-5 py-3 col-span-2" style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Responsibilities</div>
      </div>
      {GOVERNANCE_TABLE.map(([role, resp], i) => (
        <div key={role} className="grid md:grid-cols-3" style={{ borderTop: i ? `1px solid ${C.line}` : "none", background: i % 2 ? C.paperDim : "#fff" }}>
          <div className="px-5 py-4 md:col-span-1" style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{role}</div>
          <div className="px-5 py-4 md:col-span-2">
            <ul className="space-y-1.5">
              {resp.map((r, ri) => (
                <li key={ri} style={{ fontSize: 13.5, lineHeight: 1.6, color: C.mute }}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function GovernanceSection() {
  const grid = useBatchReveal(".monitor-shot", { stagger: 0.08 });
  return (
    <Section id="governance">
      <SectionHead
        index="04"
        title="Programme Governance and Implementation"
        lede="Delivery ran through a layered implementation architecture. Strategic oversight sat with Grow Indigo's Clear Harvest Business team, keeping the programme aligned to Nestlé's sustainability objectives and reporting requirements."
      />

      <Reveal>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: C.mute, maxWidth: "78ch" }}>
          Field execution was led by the Regional Business Manager / Agronomist, who oversaw technical
          implementation and agronomic fidelity across the project area, supported by the Territory Business
          Manager on day-to-day oversight, farmer coordination and operational planning. At ground level, Kisan
          Advisors worked directly with farmers to drive adoption, monitor fields and protect the integrity of
          data collection.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-8">
        <PhotoSlot src={governanceOrgChart} alt="ClearHarvest team structure" />
      </Reveal>

      <Reveal delay={0.12} className="mt-8">
        <GovernanceTable />
      </Reveal>

      <div className="mt-16">
        <Eyebrow>Monitoring, Reporting and Verification</Eyebrow>

        <div className="mt-8">
          <h4 className="wh-display text-lg" style={{ color: C.field, fontWeight: 700 }}>Monitoring and Measurement</h4>
          <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.72, color: C.mute, maxWidth: "78ch" }}>
            Grow Indigo implemented a structured, phygital monitoring system that combined regular field-level
            observations with digital data capture to ensure accuracy, traceability and verification. Throughout
            the season, Kisan Advisors conducted periodic field visits to monitor crop growth, verify Zero
            tillage establishment practices, verify nutrient applications and update farmer diaries. Farmer
            information, field boundary geofencing and agronomy information (fertiliser, pesticide use,
            irrigation method) was recorded using the FieldKhatta application, ODK and farmer diaries. All mapped
            field boundaries were also quality-checked and verified using Remote Sensing to confirm spatial
            accuracy, consistency and no burning on the mapped fields. The agronomist and science team reviewed
            these records, performing quality checks on data accuracy, completeness and geolocation consistency
            to ensure reliable inputs for GHG accounting.
          </p>
          <div ref={grid} className="grid gap-4 grid-cols-2 sm:grid-cols-5 mt-6">
            {[monitoringApp1, monitoringApp2, monitoringApp3, monitoringApp4, monitoringApp5].map((src, i) => (
              <div key={i} className="monitor-shot">
                <PhotoSlot ratio="9 / 16" src={src} alt="Farmer onboarding, field-level data collection & supply chain audit trail" />
              </div>
            ))}
          </div>
          <div className="wh-data text-center mt-3" style={{ fontSize: 11, color: C.mute, fontStyle: "italic" }}>
            Farmer onboarding, field-level data collection &amp; supply chain audit trail
          </div>
          <Reveal delay={0.1} className="mt-8">
            <PhotoSlot src={sixStepChain} alt="Farmer onboarding through to GHG quantification: the six-step wheat implementation chain." caption="Farmer onboarding through to GHG quantification: the six-step wheat implementation chain." />
          </Reveal>
        </div>

        <div className="mt-14">
          <h4 className="wh-display text-lg" style={{ color: C.field, fontWeight: 700 }}>Traceability</h4>
          <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.72, color: C.mute, maxWidth: "78ch" }}>
            Post harvest and during procurement, S3 Sutra enabled traceability of low-emission paddy from farm to
            miller. It captured the complete audit trail, documenting farmer validation, produce quantities, and
            movement of low-emission paddy. This integrated approach created a robust monitoring and verification
            system that delivered high-quality data, ensured credible traceability, and supported accurate GHG
            quantification aligned with Nestlé's reporting requirements.
          </p>
          <Reveal delay={0.1} className="mt-6">
            <PhotoSlot ratio="4 / 3" src={traceabilityFlow} alt="Farm-to-miller traceability flow, Node-to-node view" caption="Farm-to-miller traceability flow, Node-to-node view" />
          </Reveal>
        </div>

        <div className="mt-14">
          <h4 className="wh-display text-lg" style={{ color: C.field, fontWeight: 700 }}>Verification</h4>
          <div className="mt-3 space-y-4" style={{ fontSize: 14.5, lineHeight: 1.72, color: C.mute, maxWidth: "78ch" }}>
            <p>
              The program delivered measurable reductions in greenhouse gas emissions, water consumption, and
              fertilizer use through farmers' adoption of regenerative agricultural practices, including
              zero/reduced tillage and crop residue management.
            </p>
            <p>
              The reported outcomes were evaluated against the approved monitoring methodology through a review
              of monitoring records, farmer-level data, supporting documentation, and field-level evidence. The
              verification process assessed the completeness, consistency, accuracy, and traceability of the
              reported data and cross-checked the results against the established baseline. The project and its
              reported outcomes were independently verified by the third-party auditor, One Peterson.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   11 · SECTION 05 - PROGRAMME JOURNEY
---------------------------------------------------------------------------- */
const JOURNEY_STEPS = [
  {
    n: "01", title: "Programme Kick-off", img: journeyKickoff,
    body: "The programme began with alignment on scope, geography and implementation requirements. Field identification and deployment of the programme team followed, establishing the operational base for farmer engagement and seasonal monitoring.",
  },
  {
    n: "02", title: "First VLM", place: "Khasi Kalan, Ludhiana, 4 December 2025", img: journeyVlm1,
    body: "The first VLM introduced farmers to the ClearHarvest wheat programme and its low-carbon objectives. Zero Tillage and Reduced Tillage were explained alongside crop residue management. The session also covered safe farming practices, record keeping and responsible labour practices. Around 50 farmers participated and interacted with the field team.",
  },
  {
    n: "03", title: "Second VLM", place: "Kotkapura, Faridkot, 5 December 2025", img: journeyVlm2,
    body: "The second VLM focused on Zero Tillage, Reduced Tillage and crop residue management for lower-emission wheat production. Farmers were also briefed on programme participation and the previous season's low-emission wheat procurement. Responsible pesticide use, safe disposal of chemical containers and fair labour practices were discussed. Around 47 farmers attended and participated in the closing Q&A.",
  },
  {
    n: "04", title: "Third VLM", place: "BISA Farm, Ludhiana, 15 January 2026", img: journeyVlm3,
    body: "The third VLM was conducted as a farmer meeting and field exposure visit focused on practical capacity building for more than 60 farmers. Training covered Zero/Reduced Tillage, crop residue management, balanced fertiliser use and farmer record-keeping. The session included a live demonstration of Zero Tillage machinery. Farmer diaries and Leaf Colour Chart use were also demonstrated.",
  },
  {
    n: "05", title: "Fourth VLM", place: "Aulakh, Faridkot, 24 February 2026", img: journeyVlm4,
    body: "The Fourth VLM focused on integrated pest management and safer wheat production practices. Farmers were specifically sensitised on avoiding red- and yellow-category chemicals. Balanced fertiliser use and efficient water use were also discussed. The session saw active farmer participation and discussion.",
  },
  {
    n: "06", title: "Fifth VLM", place: "Nurpur Bet, Ludhiana, 25 February 2026", img: journeyVlm5,
    body: "The Fifth VLM focused on safe pest management and responsible input use in wheat. Farmers were advised to avoid red-category chemicals because of their impact on soil and human health. Balanced fertiliser application and resource-use efficiency were reinforced. The meeting also created awareness on the wider ClearHarvest sustainability programme.",
  },
  {
    n: "07", title: "Sixth VLM", place: "Dhanansu, Ludhiana, 26 February 2026", img: journeyVlm6,
    body: "The sixth VLM was conducted as a stakeholder meeting under the ClearHarvest Wheat Programme, bringing farmers and programme representatives together to reinforce key implementation priorities. The discussion focused on responsible pest management, avoidance of harmful chemicals, balanced fertiliser usage and efficient resource management in wheat cultivation. The session also strengthened awareness of the Carbon Credit initiative and the programme's broader low-carbon agriculture objectives. The meeting concluded with active stakeholder participation and discussion on practical adoption at the field level.",
  },
  {
    n: "08", title: "Low-Carbon Wheat", img: journeyLowCarbonWheat,
    body: "Following farmer engagement, field teams continued to record establishment practices, fertiliser use and crop-stage information through the season from the farm to aarthiya to mills. During procurement, 7,261 metric tonnes of programme wheat was procured, segregated and packed separately in clearly identifiable white PP bags. This controlled handling maintained the identity of the wheat throughout procurement and processing. The process strengthened traceability and preserved the link between participating farms and the final programme volume.",
  },
  {
    n: "09", title: "Third-Party Audit", img: journeyThirdPartyAudit, body: null,
  },
  {
    n: "10", title: "Quantification and Reporting",
    body: "Following data collection and independent review, the programme's GHG impact was calculated using the Cool Farm Tool. The assessment applied the GHG Protocol Scope 3 framework and IPCC Tier 1 guidance. Results were reviewed and prepared for Nestlé's sustainability reporting.",
  },
];

function JourneySection() {
  const grid = useBatchReveal(".journey-step", { stagger: 0.06 });
  return (
    <Section id="journey" tone="tint">
      <SectionHead
        index="05"
        title="Programme Journey"
        lede="From programme confirmation to the final audit, each stage generates a verifiable record. Together these records form the evidence base for the programme's monitoring and quantification."
      />
      <div ref={grid} className="space-y-10">
        {JOURNEY_STEPS.map((step) => (
          <div key={step.n} className="journey-step grid gap-6 md:grid-cols-5 items-start">
            <div className="md:col-span-3">
              <div className="flex items-baseline gap-3">
                <span className="wh-data" style={{ color: C.husk, fontWeight: 700, fontSize: 13 }}>{step.n} ·</span>
                <h4 className="wh-display text-xl" style={{ color: C.ink, fontWeight: 700 }}>{step.title}</h4>
              </div>
              {step.place && (
                <div className="wh-data mt-1.5" style={{ fontSize: 12.5, color: C.field, fontWeight: 600 }}>{step.place}</div>
              )}
              {step.body && (
                <p className="mt-3" style={{ fontSize: 14, lineHeight: 1.72, color: C.mute }}>{step.body}</p>
              )}
            </div>
            {step.img && (
              <div className="md:col-span-2">
                <PhotoSlot ratio="4 / 3" src={step.img} alt={step.title} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   12 · SECTION 06 - FARMER VOICES
---------------------------------------------------------------------------- */
function VoicesSection() {
  return (
    <Section id="voices">
      <SectionHead index="06" title="Farmer Voices" />
      <Reveal>
        <p className="italic" style={{ fontSize: 15, color: C.mute }}>Recorded on-field during the season.</p>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   13 · SECTION 07 - WHAT THE FIELD TEAM DOCUMENTED
---------------------------------------------------------------------------- */
function DocumentedSection() {
  const grid1 = useBatchReveal(".vlm-shot", { stagger: 0.08 });
  return (
    <Section id="documented" tone="tint">
      <SectionHead
        index="07"
        title="What the Field Team Documented"
        lede="Photographic and paper evidence is collected throughout the season. These sit alongside the digital records in FieldKhatta app and S3 Sutra."
      />

      <div>
        <h4 className="wh-display text-lg" style={{ color: C.field, fontWeight: 700 }}>Village-level meetings</h4>
        <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.72, color: C.mute, maxWidth: "78ch" }}>
          Six VLMs across the project period. Demonstrations on zero tillage machinery, Farmer diaries and Leaf
          Colour Chart use and residue management, with the team members present at every session to answer
          product questions directly.
        </p>
        <div ref={grid1} className="grid gap-5 sm:grid-cols-2 mt-6">
          <div className="vlm-shot"><PhotoSlot ratio="4 / 3" src={docVlmKhasiKalan} alt="VLM session with farmers at Khasi Kalan, Ludhiana, Punjab" caption="VLM session with farmers at Khasi Kalan, Ludhiana ,Punjab" /></div>
          <div className="vlm-shot"><PhotoSlot ratio="4 / 3" src={docStakeholderMeeting} alt="Meeting with Local Stakeholders: Village-Level carbon farming sessions" caption="Meeting with Local Stakeholders: Village-Level carbon farming sessions" /></div>
          <div className="vlm-shot"><PhotoSlot ratio="4 / 3" src={docZtDemoBisa} alt="Live demonstration of Zero Tillage machinery, Borlaug Institute for South Asia (BISA) Farm, Ludhiana" caption="Live demonstration of Zero Tillage machinery, Borlaug Institute for South Asia (BISA) Farm, Ludhiana" /></div>
          <div className="vlm-shot"><PhotoSlot ratio="4 / 3" src={docTeamNurpur} alt="Field team presenting to farmers, Nurpur, Punjab" caption="Field team presenting to farmers, Nurpur, Punjab" /></div>
        </div>
      </div>

      <div className="mt-14">
        <h4 className="wh-display text-lg" style={{ color: C.field, fontWeight: 700 }}>Farmer diaries</h4>
        <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.72, color: C.mute, maxWidth: "78ch" }}>
          Kisan Advisors supported farmers in maintaining agronomic and economic records. Farmer diaries captured
          field operations, input use and other information required for programme monitoring and quantification.
        </p>
        <Reveal delay={0.08} className="mt-6">
          <PhotoSlot ratio="3 / 4" className="max-w-xs" src={heroCoverPhoto} alt="The ClearHarvest handbook provided practical guidance on recommended practices under the Low-Carbon Wheat Programme." caption="The ClearHarvest handbook provided practical guidance on recommended practices under the Low-Carbon Wheat Programme." />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 mt-6">
          <PhotoSlot src={farmerDiarySocioeconomic} alt="Socio-economic profile page" caption="Socio-economic profile page" />
          <PhotoSlot src={farmerDiaryFertilizer} alt="Fertilizer usage information" caption="Fertilizer usage information" />
        </div>
        <div className="mt-6">
          <PhotoSlot src={farmerDiaryHarvesting} alt="Harvesting Details" caption="Harvesting Details" />
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   14 · SECTION 08 - ONE PRACTICE, MULTIPLE RETURNS
   ("Zero Tillage: One Establishment Change, Multiple Returns")
---------------------------------------------------------------------------- */
const RETURNS_GRID = [
  ["01", "More efficient wheat establishment", "Zero tillage machinery enabled direct sowing through retained residue, reducing conventional preparatory operations."],
  ["02", "Responsible residue and soil management", "Residue retention provided an alternative to open-field burning, while avoiding repeated ploughing reduced soil disturbance."],
  ["03", "More efficient nitrogen application", "Recorded nitrogen use declined from 187.14 to 123.35 kg N/ha, a calculated reduction of 34.09% across the assessed area."],
  ["04", "Lower modelled emission intensity", "The assessment recorded an average modelled emission reduction of 15.34% per MT."],
  ["05", "Stronger farmer capability and field support", "Six village-level and technical sessions, supported by field advisory, reinforced practice adoption, crop management and record-keeping."],
  ["06", "Traceable and independently assured sourcing", "Digital field records, segregated procurement, audit of 17 farmers and Cool Farm Tool quantification supported credible reporting."],
];

const PRACTICE_BIG_PICTURE = "Zero/Reduced Tillage is one establishment change with multiple connected benefits: fewer preparatory operations, retained crop residue, reduced soil disturbance, an alternative to open-field burning and lower tillage-related fuel use and emissions. Supported by optimised nitrogen application, farmer guidance and digital traceability, it provides a practical foundation for lower-carbon wheat production.";

function PracticeSection() {
  const grid = useBatchReveal(".returns-card", { stagger: 0.08 });
  return (
    <Section id="practice">
      <SectionHead
        index="08"
        title="Zero Tillage: One Establishment Change, Multiple Returns"
        lede="Zero/reduced Tillage changed how wheat was established after the preceding crop. Using the zero-tillage machinery, wheat could be sown through retained residue without the conventional sequence of repeated land preparation. The practice reduced soil disturbance supported non-burning residue management and lowered the requirement for preparatory tractor operations."
      />
      <div ref={grid} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RETURNS_GRID.map(([n, title, body]) => (
          <div key={n} className="returns-card p-6 rounded-lg" style={{ background: C.paperDim, border: `1px solid ${C.line}` }}>
            <div className="wh-display" style={{ color: C.husk, fontWeight: 800, fontSize: "1.6rem" }}>{n}</div>
            <h4 className="wh-display mt-2" style={{ fontSize: 15.5, fontWeight: 700, color: C.ink }}>{title}</h4>
            <p className="mt-2" style={{ fontSize: 13, lineHeight: 1.6, color: C.mute }}>{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   15 · PINNED STATEMENT - "The big picture" (Section 08's own callout, given
   the dramatic full-bleed pinned treatment the design system provides)
---------------------------------------------------------------------------- */
function PinnedStatement({ text }) {
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
        <p className="wh-display mt-6" style={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.3rem,2.8vw,2.2rem)", lineHeight: 1.32 }}>
          {text.split(" ").map((w, i) => (
            <span key={i} className="pin-word" style={{ display: "inline-block", marginRight: "0.28em" }}>{w}</span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   16 · SECTION 09 - SAMPLED. QUANTIFIED. AUDITED.
---------------------------------------------------------------------------- */
const PIPELINE = ["Data Collection", "Independent Audit", "GHG Impact Calculation"];
const PIPELINE_COLORS = [C.field, C.inkSoft, C.husk];

const AUDIT_TABLE = [
  ["Data Collection", "Field-level agronomy data was digitally recorded by enrolled farmers via the Grow Indigo ClearHarvest application at each key intervention event.", "273 wheat farmers participated across Ludhiana district."],
  ["Independent Audit", "One Peterson conducted on-site field visits to a statistically representative sample of enrolled farms, verifying recorded data against observed practices.", "17 randomly selected farmers were independently audited and verified."],
  ["GHG Impact Calculation", "Emission reductions were quantified using the Cool Farm Tool, applying GHG Protocol Scope 3 and IPCC Tier 1 guidelines.", "Results validated and formatted for Nestlé sustainability reporting."],
];

function PipelineSteps() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3">
      {PIPELINE.map((label, i) => (
        <React.Fragment key={label}>
          <motion.div
            className="flex-1 flex items-center justify-center px-6 py-5 rounded text-center"
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

/** Three-bar (Baseline / Reduction / Project) comparison chart - same role
 *  encoding as the docx's own emissions/nitrogen/water charts, redrawn
 *  natively in the report's own type and colour system so it isn't a
 *  screenshot in a different font. Every value is direct-labelled, so the
 *  muted "Baseline" bar reads fine even at low chroma. */
const BAR_ROLE_COLOR = { Baseline: C.mute, Reduction: C.husk, Project: C.field };

function MetricBarChart({ eyebrow, headline, unit, bars }) {
  const max = Math.max(...bars.map((b) => b.value));
  const barH = 130;
  return (
    <div className="p-6 rounded-lg" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="wh-display mt-2" style={{ fontWeight: 800, fontSize: "1.4rem", color: C.field }}>{headline}</div>
      <div className="wh-data mt-0.5" style={{ fontSize: 11, color: C.mute }}>{unit}</div>
      <div className="flex items-end justify-between gap-4 mt-6" style={{ height: barH }}>
        {bars.map(({ label, value }) => {
          const h = Math.max(6, (value / max) * barH);
          const color = BAR_ROLE_COLOR[label] || C.field;
          return (
            <div key={label} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="wh-data" style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>
                {value.toLocaleString("en-IN")}
              </div>
              <motion.div
                className="w-full mt-1.5"
                style={{ background: color, borderRadius: "4px 4px 0 0", maxWidth: 46, marginLeft: "auto", marginRight: "auto" }}
                initial={{ height: 0 }}
                whileInView={{ height: h }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-stretch justify-between gap-4 mt-2" style={{ borderTop: `1px solid ${C.line}` }}>
        {bars.map(({ label }) => (
          <div key={label} className="flex-1 text-center pt-2" style={{ fontSize: 11, color: C.mute, fontWeight: 600 }}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

const METRIC_CHARTS = [
  {
    eyebrow: "GHG emissions intensity",
    headline: "~15% lower",
    unit: "kg CO₂e per MT of wheat",
    bars: [
      { label: "Baseline", value: 425.14 },
      { label: "Reduction", value: 65.19 },
      { label: "Project", value: 359.95 },
    ],
    caption: "Modelled GHG emissions intensity decreased from 425.14 to 359.95 kg CO₂e per MT of wheat, representing a reduction of 65.19 kg CO₂e per MT, or approximately 15%, against the baseline.",
  },
  {
    eyebrow: "Nitrogen application",
    headline: "~34% lower",
    unit: "kg N per ha",
    bars: [
      { label: "Baseline", value: 187.14 },
      { label: "Reduction", value: 63.79 },
      { label: "Project", value: 123.35 },
    ],
    caption: "Average nitrogen application decreased from the Nestlé baseline of 187.14 kg N/ha to 123.35 kg N/ha under the programme, a reduction of 63.79 kg N/ha, or approximately 34%.",
  },
  {
    eyebrow: "Irrigation water use",
    headline: "~46% lower",
    unit: "m³ per ha",
    bars: [
      { label: "Baseline", value: 1410.03 },
      { label: "Reduction", value: 649.25 },
      { label: "Project", value: 760.78 },
    ],
    caption: "Modelled irrigation water use decreased from the Grow Indigo baseline of 1,410.03 m³/ha to 760.78 m³/ha under the programme, a reduction of 649.25 m³/ha, or approximately 46%.",
  },
];

function MetricChartsGrid() {
  const grid = useBatchReveal(".metric-chart-card", { stagger: 0.1 });
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        {Object.entries(BAR_ROLE_COLOR).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
            <span className="wh-data" style={{ fontSize: 11, color: C.mute }}>{label}</span>
          </div>
        ))}
      </div>
      <div ref={grid} className="grid gap-5 sm:grid-cols-3">
        {METRIC_CHARTS.map((m) => (
          <div key={m.eyebrow} className="metric-chart-card">
            <MetricBarChart eyebrow={m.eyebrow} headline={m.headline} unit={m.unit} bars={m.bars} />
            <p className="mt-3" style={{ fontSize: 12.5, lineHeight: 1.6, color: C.mute }}>{m.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditedSection() {
  return (
    <Section id="audited" tone="tint">
      <SectionHead index="09" title="Sampled. Quantified. Audited." lede="Carbon Accounting and Audit Pipeline: digital field-data collection, independent third-party audit, and GHG calculation." />
      <Reveal><PipelineSteps /></Reveal>

      <Reveal delay={0.12} className="mt-10">
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          <div className="hidden md:grid grid-cols-3" style={{ background: C.field }}>
            {["Step", "What We Did", "Key Facts"].map((h) => (
              <div key={h} className="px-5 py-3" style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{h}</div>
            ))}
          </div>
          {AUDIT_TABLE.map(([step, did, facts], i) => (
            <div key={step} className="grid md:grid-cols-3" style={{ borderTop: i ? `1px solid ${C.line}` : "none", background: i % 2 ? C.paperDim : "#fff" }}>
              <div className="px-5 py-4" style={{ fontWeight: 600, fontSize: 14.5, color: C.ink }}>{step}</div>
              <div className="px-5 py-4" style={{ fontSize: 13.5, lineHeight: 1.65, color: C.mute }}>{did}</div>
              <div className="px-5 py-4" style={{ fontSize: 13.5, lineHeight: 1.65, color: C.field, fontWeight: 600 }}>{facts}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <Eyebrow>Season headline results</Eyebrow>
        <div className="mt-4"><StatRow stats={HEADLINE_RESULTS} /></div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Eyebrow>Modelled results, baseline vs programme</Eyebrow>
        <div className="mt-4"><MetricChartsGrid /></div>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   17 · SECTION 10 - ACTIVITY TIMELINE
---------------------------------------------------------------------------- */
const CROP_STAGES = [
  ["Oct", "Pre-sowing"],
  ["Nov", "Sowing & emergence"],
  ["Dec", "Establishment"],
  ["Jan", "Tillering"],
  ["Feb", "Stem elongation"],
  ["Mar", "Grain development"],
  ["Apr", "Maturity & harvest"],
];

const INTERVENTIONS = [
  ["Mobilisation", "Programme kick-off, farmer onboarding and field identification"],
  ["Zero Tillage establishment", "Happy Seeder sowing through retained paddy residue with optimised basal fertiliser application. Practice and sowing information recorded."],
  ["Crop nutrition and monitoring", "Need-based urea application, crop-stage advisory and farmer-diary maintenance"],
  ["Verification", "Field records and practice validation"],
  ["Harvest", "Segregated packing, procurement and traceability records"],
];

function CropStageStrip() {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${CROP_STAGES.length}, 1fr)` }}>
      {CROP_STAGES.map(([month, stage], i) => (
        <div key={month} className="text-center px-2 py-4" style={{ borderLeft: i ? `1px solid ${C.line}` : "none", background: i % 2 ? C.paperDim : "#fff" }}>
          <div className="wh-data" style={{ fontSize: 11, fontWeight: 700, color: C.field, letterSpacing: ".08em" }}>{month.toUpperCase()}</div>
          <div className="mt-1.5" style={{ fontSize: 12, lineHeight: 1.35, color: C.ink, fontWeight: 500 }}>{stage}</div>
        </div>
      ))}
    </div>
  );
}

function TimelineSection() {
  return (
    <Section id="timeline">
      <SectionHead
        index="10"
        title="Activity Timeline"
        lede="The wheat programme followed the crop production cycle from pre-sowing through sowing and establishment to maturity and harvest, with agronomic operations, regenerative interventions and nutrient applications aligned to each key growth stage."
      />

      <Reveal>
        <Eyebrow>Crop stage</Eyebrow>
        <div className="mt-4 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          <CropStageStrip />
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Eyebrow>Programme interventions: field activity and evidence capture</Eyebrow>
        <div className="mt-4 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          {INTERVENTIONS.map(([title, body], i) => (
            <div key={title} className="grid sm:grid-cols-3" style={{ borderTop: i ? `1px solid ${C.line}` : "none", background: i % 2 ? C.paperDim : "#fff" }}>
              <div className="px-5 py-4 sm:col-span-1" style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{title}</div>
              <div className="px-5 py-4 sm:col-span-2" style={{ fontSize: 13.5, lineHeight: 1.6, color: C.mute }}>{body}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 space-y-5" style={{ fontSize: 14.5, lineHeight: 1.75, color: C.mute, maxWidth: "78ch" }}>
        <p>
          Sowing took place during the first half of November. Around 15 days after sowing (DAS), farmers applied
          a basal dose of Di-Ammonium Phosphate (DAP) fertilizer alongside early pre-emergent herbicides (Axial,
          Leader, or Sensor). Top-dressing of urea applications followed at approximately 25 DAS and 45 DAS. Once
          the crop reached maturity, harvesting, procurement, and supply chain traceability documentation were
          completed, followed by greenhouse gas (GHG) quantification.
        </p>
        <p>
          For participating farms, which average ~23 acres in size, the adopted practices resulted in emissions
          of 359.95 kg CO₂e/MT of wheat produced. This reflects a 15% reduction compared to Nestle's baseline
          emissions, in addition to achieving carbon removals of 364 kg CO₂e/MT.
        </p>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   18 · SECTION 11 - WHAT IT MEANT FOR THE FARMER
---------------------------------------------------------------------------- */
const SHORT_TERM = [
  ["Fewer establishment operations", "Zero Tillage, sown through the Happy Seeder, replaced the conventional sequence of repeated land preparation with a single pass through retained residue, cutting the number of field operations needed at establishment"],
  ["An alternative to burning", "Sowing directly through retained residue gave farmers a practical alternative to open-field burning of the preceding crop's residue."],
  ["Guided fertiliser application", "Field records and agronomic guidance supported a calculated reduction from a 187.14 kg N/ha baseline to 123.35 kg N/ha, a programme result, and not an outcome of biological inputs."],
  ["Closer field-team contact", "Village-level meetings and field visits gave farmers guidance on establishment method, fertiliser use and record-keeping through the season."],
];

const LONG_TERM = [
  ["Growing familiarity with Zero Tillage machinery", "Repeated use of the Happy Seeder can build farmer confidence in machinery-based establishment and reduce dependence on conventional tillage over successive seasons."],
  ["Continued non-burning residue management", "Sustained Zero Tillage adoption can support continued avoidance of open-field residue burning beyond the season measured here."],
  ["Stronger field-level record keeping", "Continued maintenance of field and input records can strengthen farmer participation in verified, traceable sourcing programmes."],
  ["Stronger market access", "Traceable, low-carbon wheat opens premium procurement linkages with sustainability-focused buyers like Nestlé."],
  ["Reduced production risk", "Regenerative practices strengthen resilience to water stress, erratic rainfall and pest pressure, helping farmers manage climate and market risk."],
];

function CheckList({ items, color }) {
  return (
    <div className="space-y-5">
      {items.map(([title, body]) => (
        <div key={title} className="flex gap-3">
          <span className="wh-display flex-none" style={{ color, fontWeight: 800, fontSize: 17 }}>✓</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>{title}</div>
            <p className="mt-1" style={{ fontSize: 13.5, lineHeight: 1.62, color: C.mute }}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FarmerImpactSection() {
  return (
    <Section id="farmerimpact" tone="tint">
      <SectionHead
        index="11"
        title="What It Meant for the Farmer"
        lede="The project strengthened farm economics through immediate cost savings and longer-term productivity gains from regenerative practice."
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="p-7 rounded-lg h-full" style={{ background: "#fff", border: `1px solid ${C.line}`, borderTop: `3px solid ${C.field}` }}>
            <h4 className="wh-display text-lg" style={{ color: C.field, fontWeight: 700 }}>Short-term impact</h4>
            <p className="mt-2 mb-6" style={{ fontSize: 13.5, lineHeight: 1.62, color: C.mute }}>
              In the season of implementation, Zero Tillage gave farmers a more direct route to wheat
              establishment after the preceding crop, reinforced by guided fertiliser use and closer field-team
              contact.
            </p>
            <CheckList items={SHORT_TERM} color={C.field} />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="p-7 rounded-lg h-full" style={{ background: "#fff", border: `1px solid ${C.line}`, borderTop: `3px solid ${C.leaf}` }}>
            <h4 className="wh-display text-lg" style={{ color: C.leaf, fontWeight: 700 }}>Long-term impact</h4>
            <p className="mt-2 mb-6" style={{ fontSize: 13.5, lineHeight: 1.62, color: C.mute }}>
              These are expected longer-term benefits of continued Zero/Reduced tillage adoption and should not
              be described as measured programme outcomes unless follow-up evidence is available.
            </p>
            <CheckList items={LONG_TERM} color={C.leaf} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   19 · SECTION 12 - MAPPED TO NESTLÉ'S RESPONSIBLE SOURCING STANDARD
---------------------------------------------------------------------------- */
const SOURCING_PILLARS = [
  ["Pillar 01", "Climate Action & Net Zero", "Zero Tillage machinery reduces conventional preparatory operations; optimised nitrogen use (~34% below baseline) lowers application-linked emissions. Together with SOC removals, a calculated Total Net GHG Benefit of ~101% of baseline: a field-recorded Scope 3 contribution.", C.husk],
  ["Pillar 02", "Water Stewardship & Livelihoods", "Optimised irrigation delivers ~46% water savings against Grow Indigo's baseline; farmer training and pest-management guidance support informed, resource-efficient decisions.", C.water],
  ["Pillar 03", "Land, Forests & Biodiversity", "Zero Tillage machinery provides an alternative to open-field residue burning; soil sampling supports future soil-health assessment.", C.leaf],
  ["Pillar 04", "Traceability & Human Rights", "ClearHarvest onboarding, geofencing and farmer diaries build a recorded, audit-ready trail; One Peterson provides independent review.", C.clay],
];

function SourcingSection() {
  const grid = useBatchReveal(".pillar-card", { stagger: 0.08 });
  return (
    <Section id="sourcing" tone="dark">
      <SectionHead
        index="12"
        tone="dark"
        title="Mapped to Nestlé's Responsible Sourcing Standard"
        lede="The standard sets out how the supply chain is expected to operate - environmental performance, human-rights protection, traceability and farmer livelihoods. Every intervention deployed in Ludhiana maps onto a pillar, and every metric here supports Nestlé's Responsible Sourcing."
      />
      <div ref={grid} className="grid gap-4 sm:grid-cols-2">
        {SOURCING_PILLARS.map(([pillar, name, body, color]) => (
          <div key={pillar} className="pillar-card p-6 rounded-lg" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderTop: `3px solid ${color}` }}>
            <div className="wh-data" style={{ color, fontWeight: 700, fontSize: 12, letterSpacing: ".1em" }}>{pillar.toUpperCase()}</div>
            <h4 className="wh-display mt-1.5 text-lg" style={{ color: "#fff", fontWeight: 700 }}>{name}</h4>
            <p className="mt-3" style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,.72)" }}>{body}</p>
          </div>
        ))}
      </div>
      <Reveal delay={0.15} className="mt-10">
        <div className="p-6 rounded-lg" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)" }}>
          <Eyebrow color={C.husk}>Insight</Eyebrow>
          <p className="mt-3" style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,.82)" }}>
            Zero/Reduced Tillage was the programme's principal establishment intervention, enabling wheat to be
            sown through retained paddy residue with fewer preparatory operations, while optimised fertiliser use
            provided an additional route for reducing production-related emissions. Geo-tagged field boundaries,
            farmer diaries, digital agronomy records, scientific quality checks, Cool Farm Tool quantification
            and independent verification by One Peterson created a traceable basis for reporting outcomes.
            Together with farmer engagement and segregated procurement, these measures establish a documented
            approach for linking regenerative wheat practices with Nestlé's responsible-sourcing requirements.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   20 · SECTION 13 - FIELD EVIDENCE
---------------------------------------------------------------------------- */
const ANNEXURES = [
  ["Annexure 1", "Village-level meetings with farmers", annexureVlm, "Farmers attending a VLM with the field team - six VLMs were held across the project period."],
  ["Annexure 2", "Zero/Reduced Tillage field", annexureZtField, "Uniform crop rows and retained surface residue indicate field-level adoption of Zero/Reduced Tillage practices."],
  ["Annexure 3", "Farmer diary", farmerDiarySocioeconomic, "Socio-economic profile plus a dated crop name, season, year and villages names are mentioned."],
  ["Annexure 4", "Weekly WhatsApp messages sent to farmers", annexureWhatsapp, "Weekly WhatsApp messages shared vernacular videos and visual infographics on Zero/Reduced Tillage, crop residue management and balanced fertiliser use. The advisories also reinforced integrated pest management, responsible chemical use, farmer-diary maintenance and safe labour practices"],
  ["Annexure 5", "Harvest in Action", annexureHarvest, "Geotagged documentation of mechanised wheat harvesting at a programme field prior to programme procurement and traceability activities in Sherpur Kalan, Punjab."],
  ["Annexure 6", "Grains ready to be transported", annexureGrains, "Harvested low-carbon programme wheat being weighed and packed in separate, clearly identifiable white bags at Kot kapura, Punjab."],
  ["Annexure 7", "Procurement Receipt", annexureReceipt, "Procurement receipt issued by the Market Committee, Mullanpur Dakha, documenting the purchase of 16.95 MT of wheat at Nurpur Bet Grain Market. (Seller's personal details redacted.)"],
  ["Annexure 8", "Independent third-party audit", annexureAudit, "Third Party auditor in field with the Grow Indigo team and participating farmers."],
];

function EvidenceSection() {
  const grid = useBatchReveal(".annexure-card", { stagger: 0.07 });
  return (
    <Section id="evidence">
      <SectionHead
        index="13"
        title="Field Evidence"
        lede="The annexures below document field-level evidence, monitoring data and operational records collected throughout the project period - each one geo-tagged and dated at the point of capture."
      />
      <div ref={grid} className="grid gap-6 sm:grid-cols-2">
        {ANNEXURES.map(([tag, title, src, caption]) => (
          <div key={tag} className="annexure-card">
            <Eyebrow>{tag}</Eyebrow>
            <h4 className="wh-display mt-1 text-lg" style={{ color: C.ink, fontWeight: 700 }}>{title}</h4>
            <div className="mt-3">
              <PhotoSlot ratio="4 / 3" src={src} alt={title} caption={caption} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   21 · SECTION 14 - ABOUT GROW INDIGO
---------------------------------------------------------------------------- */
const VERTICALS = [
  ["01", "NATURE-BASED CROP INPUTS", "Biologicals", "We empower farmers with innovative biological products that enhance soil health, promote plant growth, and unlock the full potential of their land.", C.leaf],
  ["02", "CARBON FARMING", "Carbon - Regen Ag", "We're building India's leading vertically integrated carbon program. This program delivers high-quality, certified carbon units, safeguarding businesses from greenwashing claims and driving positive climate action.", C.field],
  ["03", "SCOPE 3 INSETTING", "ClearHarvest", "With our combined expertise of biologicals and carbon accounting, we help food, beverage, and apparel companies reduce farm-side emissions to achieve their net-zero goals.", C.husk],
  ["04", "CARBON-NEGATIVE SOIL AMENDMENT", "Biochar", "We convert crop residue into high-quality biochar, restoring soil health and unlocking a permanent, verifiable route to carbon removal - while ending the need for open-field burning.", C.clay],
];

function AboutSection() {
  const grid = useBatchReveal(".vertical-card", { stagger: 0.08 });
  return (
    <Section id="about" tone="tint">
      <SectionHead
        index="14"
        title="About Grow Indigo"
        lede="Grow Indigo is a pioneering agri-tech company, with a focus on advancing sustainable agriculture to improve farmer profitability, environmental sustainability, and consumer health. Our mission is to accelerate agricultural transformation for a healthier planet, driven by four core pillars."
      />

      <Reveal>
        <PhotoSlot ratio="1 / 1" className="max-w-sm mx-auto" src={aboutGrowIndigoGraphic} alt="Grow Indigo - We Accelerate Ag Transformation For a Healthy Planet" />
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <Eyebrow>Our four core verticals</Eyebrow>
        <div ref={grid} className="grid gap-4 sm:grid-cols-2 mt-4">
          {VERTICALS.map(([n, label, name, body, color]) => (
            <div key={n} className="vertical-card p-6 rounded-lg" style={{ background: "#fff", border: `1px solid ${C.line}`, borderTop: `3px solid ${color}` }}>
              <div className="wh-data" style={{ color, fontWeight: 700, fontSize: 11.5, letterSpacing: ".1em" }}>{n} {label}</div>
              <h4 className="wh-display mt-1.5 text-lg" style={{ color: C.ink, fontWeight: 700 }}>{name}</h4>
              <p className="mt-2" style={{ fontSize: 13.5, lineHeight: 1.62, color: C.mute }}>{body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <div className="p-7 rounded-lg text-center" style={{ background: C.ink }}>
          <Eyebrow color={C.husk}>Get in touch</Eyebrow>
          <div className="wh-display mt-3" style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>ClearHarvest - Grow Indigo</div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-2" style={{ color: "rgba(255,255,255,.78)", fontSize: 14 }}>
            <div><span style={{ color: "rgba(255,255,255,.5)" }}>Name: </span>Mr. Amit Kumar</div>
            <div><span style={{ color: "rgba(255,255,255,.5)" }}>Phone: </span>+91 8329049612</div>
            <div><span style={{ color: "rgba(255,255,255,.5)" }}>Email: </span>clearharvest@growindigo.co.in</div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
   22 · LOGO LOCKUP
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
   23 · CLOSING
---------------------------------------------------------------------------- */
function Closing() {
  return (
    <footer style={{ background: C.ink }}>
      <div className="mx-auto px-5 md:px-10 py-14" style={{ maxWidth: 1180 }}>
        <LogoLockup light height={40} />
        <div className="wh-data mt-8 text-center" style={{ fontSize: 10.5, color: "rgba(255,255,255,.4)", letterSpacing: ".1em" }}>
          LOW-CARBON WHEAT PROGRAMME · LUDHIANA, PUNJAB · RABI SEASON 2025
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------------------
   24 · ROOT
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
        <SeasonSection />
        <FieldsSection />
        <ThemesSection />
        <GovernanceSection />
        <JourneySection />
        <VoicesSection />
        <DocumentedSection />
        <PracticeSection />
        <PinnedStatement text={PRACTICE_BIG_PICTURE} />
        <AuditedSection />
        <TimelineSection />
        <FarmerImpactSection />
        <SourcingSection />
        <EvidenceSection />
        <AboutSection />
      </main>

      <Closing />
    </div>
  );
}

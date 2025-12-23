"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import Link from "next/link";
import ParticleBackground from "../src/components/ParticleBackground";
import PricingCard from "../src/components/PricingCard";
import CategoryCard from "../src/components/CategoryCard";
import HeroTerminal from "../src/components/HeroTerminal";
import QuoteForm from "../src/components/QuoteForm";

// TypedText animated headline component
const phrases = [
  "Designing Digital Systems Built to Last",
  "Architecture Before Code. Clarity Before Scale",
  "Turning Ideas into Reliable Systems",
  "From Strategy to Production-Ready Platforms",
  "Building Scalable Technology with Purpose",
];

const TypedText = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (!isDeleting) {
        setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        setTypingSpeed(100);
      } else {
        setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        setTypingSpeed(50);
      }

      // If finished typing and not deleting, pause then start deleting
      if (!isDeleting && currentText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1000);
      }
      // If finished deleting, move to next phrase
      else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, typingSpeed);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, typingSpeed, currentPhraseIndex]);

  return (
    <span>
      {currentText}
      <span className="typed-cursor">_</span>
    </span>
  );
};

// Categories data
const categories = [
  {
    title: "Digital Product Design",
    description:
      "UI/UX, prototyping, and user-centered design for web and mobile products that delight and engage.",
    icon: "🎨",
    iconLabel: "design",
    avatarBgColor: "#FF9900",
  },
  {
    title: "System Architecture",
    description:
      "Robust, scalable, and maintainable architecture for cloud, SaaS, and enterprise platforms.",
    icon: "🏗️",
    iconLabel: "architecture",
    avatarBgColor: "#1A1A2E",
  },
  {
    title: "Software Engineering",
    description:
      "End-to-end development, testing, and deployment of reliable digital solutions.",
    icon: "💻",
    iconLabel: "engineering",
    avatarBgColor: "#FFD580",
    avatarTextColor: "#1A1A2E",
  },
  {
    title: "DevOps & Automation",
    description:
      "CI/CD, cloud infrastructure, and workflow automation for faster, safer releases.",
    icon: "⚙️",
    iconLabel: "devops",
    avatarBgColor: "#FF9900",
  },
  {
    title: "Data & Analytics",
    description:
      "Data engineering, dashboards, and insights to drive smarter business decisions.",
    icon: "📊",
    iconLabel: "data",
    avatarBgColor: "#1A1A2E",
  },
  {
    title: "Product Strategy",
    description:
      "Vision, roadmapping, and go-to-market planning for digital products that succeed.",
    icon: "🧭",
    iconLabel: "strategy",
    avatarBgColor: "#FFD580",
    avatarTextColor: "#1A1A2E",
  },
];

// Pricing tiers data
const pricingTiers = [
  {
    tierNumber: 1,
    title: "System Blueprint",
    price: "From $300 – $800",
    description: "For founders who need clarity before building",
    features: [
      "Business & product requirements review",
      "High-level system architecture",
      "Tech stack recommendation",
      "Database & data-flow design",
      "Security & scalability considerations",
      "MVP feature breakdown",
      "Architecture diagram (PDF)",
    ],
    color: "#22c55e",
    colorDark: "#16a34a",
    deliverables: "System blueprint document, diagrams, roadmap",
    bestFor: "early-stage founders, planning phase",
    outcome: "You know exactly what to build and how",
  },
  {
    tierNumber: 2,
    title: "MVP Build",
    price: "From $1,500 – $4,000",
    description: "From idea to working product",
    features: [
      "System architecture (Tier 1 concepts applied)",
      "UX/UI implementation",
      "Full-stack development (web or mobile)",
      "Backend APIs & database",
      "Authentication & basic security",
      "Payment / third-party integration (basic)",
      "Deployment to production server",
    ],
    color: "#2563eb",
    colorDark: "#1d4ed8",
    deliverables: "Live MVP, admin access, backend, code repo",
    bestFor: "startups, platforms, fintech MVPs",
    outcome: "A real, usable product in production",
  },
  {
    tierNumber: 3,
    title: "Production System",
    price: "From $4,000 – $10,000+",
    description: "Built for scale, security & reliability",
    features: [
      "Advanced system architecture",
      "Optimized database design",
      "Full UX/UI refinement",
      "Performance & security hardening",
      "CI/CD setup",
      "Backups, monitoring & logging",
      "Production-grade deployment",
      "Documentation & handover",
    ],
    color: "#a21caf",
    colorDark: "#86198f",
    deliverables: "Scalable system, infra docs, pipelines",
    bestFor: "fintech, marketplaces, serious startups",
    outcome: "A system designed to last",
  },
  {
    tierNumber: 4,
    title: "Architecture & Technical Consulting",
    price: "$50 – $100 / hour<br />or<br />Monthly retainer from $500",
    description: "Strategic guidance without full build",
    features: [
      "Architecture reviews",
      "System audits",
      "Security & performance advice",
      "Technical decision support",
      "Scaling & refactor planning",
    ],
    color: "#f59e42",
    colorDark: "#d97706",
    bestFor: "teams with developers, founders needing guidance",
    outcome: "Better decisions, fewer mistakes",
  },
  {
    tierNumber: 5,
    title: "Technical Co-Founder / Long-Term Partner",
    price: "Custom (cash + equity)",
    description: "For selected startups only",
    features: [
      "Long-term system ownership",
      "Architecture leadership",
      "Full-stack development oversight",
      "Infrastructure & deployment strategy",
      "Product & growth alignment",
    ],
    color: "#ef4444",
    colorDark: "#dc2626",
    bestFor: "high-potential startups",
    outcome: "A real technical partner, not a contractor",
  },
];

// Main Home component
export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [viewParticles, setViewParticles] = useState(false);
  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #050816 0%, #1A1A2E 50%, #0F1419 100%)",
          color: "white",
          margin: 0,
          p: { xs: "40px 0 24px 0", sm: "64px 0" },
          pt: { xs: "64px", sm: "128px" },
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,153,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,213,128,0.08) 0%, transparent 50%)",
            pointerEvents: "none",
            zIndex: 1,
          },
        }}
      >
        {/* Interactive particle background component */}
        <ParticleBackground fullView={viewParticles} />

        {/* Hero content - shown when particles are not in full view */}
        {!viewParticles && (
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
            <Grid
              container
              spacing={{ xs: 4, md: 6 }}
              alignItems="center"
              sx={{
                minHeight: { xs: "auto", md: "80vh" },
                py: { xs: 4, md: 6 },
              }}
            >
              {/* Left column: Headline + Value Proposition + CTAs */}
              <Grid item xs={12} md={6}>
                {/* LASTTE Brand Badge */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    mb: 3,
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    background: "rgba(255,213,128,0.1)",
                    border: "1px solid rgba(255,213,128,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFD580",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    LASTTE
                  </Typography>
                </Box>

                {/* Main headline */}
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  component="h1"
                  sx={{
                    fontWeight: 500,
                    mb: { xs: 2, md: 3 },
                    lineHeight: { xs: 1.2, md: 1.1 },
                    letterSpacing: { xs: "-0.01em", md: "-0.02em" },
                    color: "#fff",
                    fontSize: {
                      xs: "1.75rem",
                      sm: "2rem",
                      md: "3rem",
                      lg: "3.5rem",
                    },
                    minHeight: {
                      xs: "6.3rem",
                      sm: "7.2rem",
                      md: "9.9rem",
                      lg: "11.55rem",
                    },
                    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <TypedText />
                </Typography>

                {/* Value proposition subtitle */}
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{
                    mb: { xs: 4, md: 5 },
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 400,
                    maxWidth: 600,
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Helping you design, build, and scale digital products and
                  platforms with clarity, reliability, and purpose.
                </Typography>

                {/* Call-to-action buttons container */}
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1.5, sm: 2 },
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {/* Primary CTA: Learn More button */}
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderRadius: 99,
                      fontWeight: 700,
                      px: { xs: 3, md: 5 },
                      py: { xs: 1.25, md: 1.75 },
                      fontSize: { xs: "0.95rem", md: "1.1rem" },
                      background:
                        "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                      color: "#1A1A2E",
                      boxShadow: "0 4px 20px rgba(255,153,0,0.3)",
                      textTransform: "none",
                      letterSpacing: "0.05em",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                        boxShadow: "0 6px 30px rgba(255,153,0,0.4)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    component={Link}
                    href="/about"
                  >
                    Learn More
                  </Button>

                  {/* Secondary CTA: Get in Touch button */}
                  <Button
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderRadius: 99,
                      fontWeight: 700,
                      px: { xs: 3, md: 5 },
                      py: { xs: 1.25, md: 1.75 },
                      fontSize: { xs: "0.95rem", md: "1.1rem" },
                      borderColor: "#FFD580",
                      borderWidth: 2,
                      color: "#FFD580",
                      background: "rgba(255,213,128,0.05)",
                      backdropFilter: "blur(8px)",
                      textTransform: "none",
                      letterSpacing: "0.05em",
                      "&:hover": {
                        borderColor: "#FF9900",
                        color: "#FF9900",
                        background: "rgba(255,153,0,0.1)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 20px rgba(255,153,0,0.2)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    component={Link}
                    href="/contact"
                  >
                    Get in Touch
                  </Button>

                  {/* Tertiary CTA: View Particles button (desktop only) */}
                  {!isMobile && (
                    <Button
                      variant="text"
                      size="large"
                      sx={{
                        borderRadius: 99,
                        fontWeight: 600,
                        px: 3,
                        py: 1.75,
                        fontSize: "1rem",
                        color: "rgba(255,255,255,0.7)",
                        textTransform: "none",
                        letterSpacing: "0.05em",
                        "&:hover": {
                          color: "#FFD580",
                          background: "rgba(255,213,128,0.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => setViewParticles(true)}
                    >
                      View Particles
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Right column: Terminal */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <HeroTerminal isMobile={isMobile} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        )}

        {/* Back button - shown when particles are in full view mode */}
        {viewParticles && !isMobile && (
          <Button
            variant="contained"
            size="medium"
            sx={{
              position: "absolute",
              top: 32,
              right: 32,
              zIndex: 10,
              borderRadius: 99,
              fontWeight: 700,
              px: 3,
              py: 1.5,
              fontSize: "1rem",
              background: "rgba(255,153,0,0.9)",
              backdropFilter: "blur(12px)",
              color: "#1A1A2E",
              boxShadow: "0 4px 20px rgba(255,153,0,0.3)",
              border: "1px solid rgba(255,213,128,0.3)",
              textTransform: "none",
              letterSpacing: "0.05em",
              "&:hover": {
                background: "rgba(255,213,128,0.95)",
                boxShadow: "0 6px 30px rgba(255,153,0,0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onClick={() => setViewParticles(false)}
          >
            Back
          </Button>
        )}
      </Box>

      {/* ================= CATEGORIES SECTION ================= */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 6,
            color: "#1A1A2E",
            letterSpacing: "-0.01em",
          }}
        >
          Explore Our Core Capabilities
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CategoryCard
                title={category.title}
                description={category.description}
                icon={category.icon}
                iconLabel={category.iconLabel}
                avatarBgColor={category.avatarBgColor}
                avatarTextColor={category.avatarTextColor}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= SERVICE & PRICING TIERS SECTION ================= */}
      <Box
        sx={{
          background: "linear-gradient(to bottom, #fff 0%, #fafafa 100%)",
          py: { xs: 6, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#1A1A2E",
              letterSpacing: "-0.01em",
            }}
          >
            LASTTE — Service & Pricing Tiers
          </Typography>

          <Typography
            align="center"
            sx={{ color: "text.secondary", mb: 6, fontSize: "1.1rem" }}
          >
            Pricing is indicative. Final cost depends on scope, complexity, and
            timeline.
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "80px",
                background:
                  "linear-gradient(to right, rgba(250,250,250,1), rgba(250,250,250,0))",
                zIndex: 2,
                pointerEvents: "none",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "80px",
                background:
                  "linear-gradient(to left, rgba(250,250,250,1), rgba(250,250,250,0))",
                zIndex: 2,
                pointerEvents: "none",
              },
            }}
          >
            <Box
              sx={{
                overflowX: "auto",
                overflowY: "hidden",
                width: "100%",
                pb: 3,
                px: { xs: 2, md: 0 },
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "linear-gradient(90deg, #FF9900, #FFD580)",
                  borderRadius: "10px",
                  "&:hover": {
                    background: "linear-gradient(90deg, #FF9900, #FF9900)",
                  },
                },
                scrollbarWidth: "thin",
                scrollbarColor: "#FF9900 rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 3, md: 4 },
                  pb: 2,
                  px: { xs: 1, md: 2 },
                  minWidth: "max-content",
                }}
              >
                {pricingTiers.map((tier) => (
                  <PricingCard
                    key={tier.tierNumber}
                    tierNumber={tier.tierNumber}
                    title={tier.title}
                    price={tier.price}
                    description={tier.description}
                    features={tier.features}
                    color={tier.color}
                    colorDark={tier.colorDark}
                    deliverables={tier.deliverables}
                    bestFor={tier.bestFor}
                    outcome={tier.outcome}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ================= REQUEST A QUOTE FORM SECTION ================= */}
      <QuoteForm />
    </Box>
  );
}


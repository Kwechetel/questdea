"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  baseOpacity: number;
  twinkle: number;
  twinkleSpeed: number;
  fact?: string;
  category?: string;
}

interface ParticleBackgroundProps {
  fullView?: boolean;
}

interface Fact {
  fact: string;
  category: string;
}

type CategoryType = "Brain Power" | "Learning" | "Wellness" | "Productivity";

const facts: Fact[] = [
  {
    fact: "The human brain can process images in as little as 13 milliseconds.",
    category: "Brain Power",
  },
  {
    fact: "Learning a new language can increase brain size and improve memory.",
    category: "Learning",
  },
  {
    fact: "Reading for just 6 minutes can reduce stress by 68%.",
    category: "Wellness",
  },
  {
    fact: "The average person has 70,000 thoughts per day.",
    category: "Brain Power",
  },
  {
    fact: "Writing by hand improves memory retention by 42%.",
    category: "Learning",
  },
  {
    fact: "Classical music can improve focus and productivity by 12%.",
    category: "Productivity",
  },
  {
    fact: "Taking regular breaks can increase learning efficiency by 30%.",
    category: "Productivity",
  },
  {
    fact: "Sleep is crucial for memory consolidation and learning.",
    category: "Wellness",
  },
  {
    fact: "Exercise boosts brain function and learning capacity.",
    category: "Wellness",
  },
  {
    fact: "Multitasking reduces productivity by 40%.",
    category: "Productivity",
  },
  {
    fact: "The brain creates new neural pathways when learning new skills.",
    category: "Brain Power",
  },
  {
    fact: "Visual learning is processed 60,000 times faster than text.",
    category: "Learning",
  },
  {
    fact: "Meditation can increase focus and attention span by 20%.",
    category: "Productivity",
  },
  {
    fact: "The brain can store up to 2.5 petabytes of information.",
    category: "Brain Power",
  },
  {
    fact: "Learning in short bursts is 20% more effective than long sessions.",
    category: "Learning",
  },
  {
    fact: "The brain's prefrontal cortex isn't fully developed until age 25.",
    category: "Brain Power",
  },
  {
    fact: "Laughing increases blood flow to the brain by 22%.",
    category: "Brain Power",
  },
  {
    fact: "The brain uses 20% of the body's oxygen and energy.",
    category: "Brain Power",
  },
  {
    fact: "Teaching others can improve your own learning by 90%.",
    category: "Learning",
  },
  {
    fact: "Spaced repetition can improve long-term memory retention by 200%.",
    category: "Learning",
  },
  {
    fact: "Learning with multiple senses can increase retention by 75%.",
    category: "Learning",
  },
  {
    fact: "20 minutes of nature exposure can lower stress hormone levels by 21%.",
    category: "Wellness",
  },
  {
    fact: "Deep breathing can reduce anxiety by 50% in just 5 minutes.",
    category: "Wellness",
  },
  {
    fact: "Regular exercise can increase brain volume by 2% in one year.",
    category: "Wellness",
  },
  {
    fact: "The most productive people work for 52 minutes then break for 17.",
    category: "Productivity",
  },
  {
    fact: "Writing down your goals increases achievement likelihood by 42%.",
    category: "Productivity",
  },
  {
    fact: "A clean workspace can increase productivity by 20%.",
    category: "Productivity",
  },
  {
    fact: "Natural light in workspaces can improve productivity by 15%.",
    category: "Productivity",
  },
  {
    fact: "The brain generates enough electricity to power a small light bulb.",
    category: "Brain Power",
  },
  {
    fact: "Your brain can process information at 120 meters per second.",
    category: "Brain Power",
  },
  {
    fact: "The brain's memory capacity is equivalent to 2.5 million gigabytes.",
    category: "Brain Power",
  },
  {
    fact: "Brain cells can live for your entire lifetime.",
    category: "Brain Power",
  },
  {
    fact: "Learning a musical instrument can increase IQ by 7 points.",
    category: "Learning",
  },
  {
    fact: "Taking notes by hand improves comprehension by 40%.",
    category: "Learning",
  },
  {
    fact: "Learning in different environments can improve retention by 30%.",
    category: "Learning",
  },
  {
    fact: "Teaching a concept to someone else improves your understanding by 90%.",
    category: "Learning",
  },
  {
    fact: "Meditation for 10 minutes daily can reduce anxiety by 39%.",
    category: "Wellness",
  },
  {
    fact: "Drinking water can improve brain function by 14%.",
    category: "Wellness",
  },
  {
    fact: "Regular exercise can increase creativity by 60%.",
    category: "Wellness",
  },
  {
    fact: "Sleeping 7-8 hours can improve memory recall by 25%.",
    category: "Wellness",
  },
  {
    fact: "The most productive time of day is between 9-11 AM.",
    category: "Productivity",
  },
  {
    fact: "Taking a 20-minute nap can improve alertness by 100%.",
    category: "Productivity",
  },
  {
    fact: "Working in 90-minute blocks can increase focus by 50%.",
    category: "Productivity",
  },
  {
    fact: "Decluttering your workspace can save 4.3 hours per week.",
    category: "Productivity",
  },
  {
    fact: "Listening to nature sounds can improve focus by 15%.",
    category: "Productivity",
  },
  {
    fact: "Standing desks can increase productivity by 10%.",
    category: "Productivity",
  },
  {
    fact: "The brain's processing speed peaks at age 24.",
    category: "Brain Power",
  },
  {
    fact: "Your brain can recognize a face in just 100 milliseconds.",
    category: "Brain Power",
  },
  {
    fact: "The brain's neurons can form 1,000 new connections per second.",
    category: "Brain Power",
  },
  {
    fact: "Brain waves during deep sleep can help clean toxic proteins.",
    category: "Brain Power",
  },
  {
    fact: "The brain's hippocampus grows 700 new neurons daily.",
    category: "Brain Power",
  },
  {
    fact: "Your brain can process 400 billion bits of information per second.",
    category: "Brain Power",
  },
  {
    fact: "The brain's gray matter increases with meditation practice.",
    category: "Brain Power",
  },
  {
    fact: "Brain activity during sleep helps consolidate memories.",
    category: "Brain Power",
  },
  {
    fact: "The brain's plasticity allows it to rewire itself after injury.",
    category: "Brain Power",
  },
  {
    fact: "Your brain can recognize patterns in just 13 milliseconds.",
    category: "Brain Power",
  },
  {
    fact: "The brain's default mode network activates during daydreaming.",
    category: "Brain Power",
  },
  {
    fact: "Brain waves synchronize during deep conversation.",
    category: "Brain Power",
  },
  {
    fact: "The brain's reward system releases dopamine during learning.",
    category: "Brain Power",
  },
  {
    fact: "Your brain can process emotions before conscious awareness.",
    category: "Brain Power",
  },
  {
    fact: "Learning in 25-minute intervals improves retention by 40%.",
    category: "Learning",
  },
  {
    fact: "Teaching others improves your own understanding by 90%.",
    category: "Learning",
  },
  {
    fact: "Visual aids can increase learning retention by 400%.",
    category: "Learning",
  },
  {
    fact: "Learning with music can improve memory by 20%.",
    category: "Learning",
  },
  {
    fact: "Active recall practice improves long-term memory by 150%.",
    category: "Learning",
  },
  {
    fact: "Learning in different locations can boost retention by 30%.",
    category: "Learning",
  },
  {
    fact: "Teaching concepts to others improves your mastery by 80%.",
    category: "Learning",
  },
  {
    fact: "Learning through stories increases recall by 22 times.",
    category: "Learning",
  },
  {
    fact: "Practice testing improves learning outcomes by 50%.",
    category: "Learning",
  },
  {
    fact: "Learning with analogies increases understanding by 40%.",
    category: "Learning",
  },
  {
    fact: "Interleaved practice improves skill acquisition by 25%.",
    category: "Learning",
  },
  {
    fact: "Learning with multiple modalities boosts retention by 75%.",
    category: "Learning",
  },
  {
    fact: "Self-explanation while learning improves comprehension by 30%.",
    category: "Learning",
  },
  {
    fact: "Learning with real-world applications increases engagement by 60%.",
    category: "Learning",
  },
  {
    fact: "30 minutes of daily exercise can reduce depression by 30%.",
    category: "Wellness",
  },
  {
    fact: "Meditation can increase gray matter density by 8%.",
    category: "Wellness",
  },
  {
    fact: "Deep breathing can lower blood pressure by 10 points.",
    category: "Wellness",
  },
  {
    fact: "Regular yoga practice can reduce stress by 35%.",
    category: "Wellness",
  },
  {
    fact: "A 20-minute walk can boost creativity by 60%.",
    category: "Wellness",
  },
  {
    fact: "Mindfulness practice can reduce anxiety by 38%.",
    category: "Wellness",
  },
  {
    fact: "Regular stretching can improve flexibility by 20%.",
    category: "Wellness",
  },
  {
    fact: "Daily gratitude practice can increase happiness by 25%.",
    category: "Wellness",
  },
  {
    fact: "Proper hydration can improve cognitive function by 15%.",
    category: "Wellness",
  },
  {
    fact: "Regular sleep schedule can improve mood by 40%.",
    category: "Wellness",
  },
  {
    fact: "Social connections can increase lifespan by 50%.",
    category: "Wellness",
  },
  {
    fact: "Laughter can boost immune function by 40%.",
    category: "Wellness",
  },
  {
    fact: "Regular nature exposure can reduce stress by 28%.",
    category: "Wellness",
  },
  {
    fact: "Mindful eating can reduce overeating by 30%.",
    category: "Wellness",
  },
  {
    fact: "The 2-minute rule can increase task completion by 80%.",
    category: "Productivity",
  },
  {
    fact: "Time blocking can improve focus by 40%.",
    category: "Productivity",
  },
  {
    fact: "The Pomodoro technique can boost productivity by 25%.",
    category: "Productivity",
  },
  {
    fact: "Digital minimalism can save 2 hours daily.",
    category: "Productivity",
  },
  {
    fact: "Batch processing similar tasks can save 30% time.",
    category: "Productivity",
  },
  {
    fact: "Morning routines can increase daily productivity by 40%.",
    category: "Productivity",
  },
  {
    fact: "The 80/20 rule can optimize 80% of results with 20% effort.",
    category: "Productivity",
  },
  {
    fact: "Single-tasking can improve accuracy by 50%.",
    category: "Productivity",
  },
  {
    fact: "Weekly planning can reduce stress by 30%.",
    category: "Productivity",
  },
  {
    fact: "Digital detox can improve focus by 35%.",
    category: "Productivity",
  },
  {
    fact: "The 5-second rule can increase action-taking by 60%.",
    category: "Productivity",
  },
  {
    fact: "Regular breaks can maintain 90% productivity throughout the day.",
    category: "Productivity",
  },
  {
    fact: "Task batching can reduce context switching by 40%.",
    category: "Productivity",
  },
  {
    fact: "The Eisenhower Matrix can prioritize 80% of important tasks.",
    category: "Productivity",
  },
];

const categoryColors: Record<CategoryType, string> = {
  "Brain Power": "#FF6B6B", // Vibrant red
  Learning: "#4ECDC4", // Turquoise
  Wellness: "#45B7D1", // Sky blue
  Productivity: "#96CEB4", // Mint green
};

const FactDialog: React.FC<{
  fact: Fact | null;
  onClose: () => void;
}> = ({ fact, onClose }) => {
  if (!fact) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: `2px solid ${categoryColors[fact.category as CategoryType]}`,
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            color: "#ffffff",
            fontSize: "24px",
            marginBottom: "1rem",
            textAlign: "center",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          Did You Know?
        </h2>
        <p
          style={{
            color: "#ffffff",
            fontSize: "18px",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
            textAlign: "center",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          {fact.fact}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              backgroundColor: categoryColors[fact.category as CategoryType],
              color: "#ffffff",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: "bold",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            {fact.category}
          </span>
        </div>
      </div>
    </div>
  );
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  fullView = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  const isHovering = useRef(false);
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(
    null
  );
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Reset particles when fullView changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset all particles to default settings
    particles.current.forEach((particle) => {
      particle.radius = particle.baseRadius;
      particle.opacity = fullView ? 0.7 : 0.5;
      particle.dx = (Math.random() - 0.5) * (fullView ? 0.2 : 1.5);
      particle.dy = (Math.random() - 0.5) * (fullView ? 0.2 : 1.5);
    });

    // Reset states
    setSelectedParticle(null);
    setSelectedFact(null);
    setAnimationProgress(0);
    isHovering.current = false;
  }, [fullView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const particleCount = fullView ? 200 : 100;
      particles.current = [];

      for (let i = 0; i < particleCount; i++) {
        const fact = facts[Math.floor(Math.random() * facts.length)];
        // Night sky stars: smaller and more varied sizes (like real stars)
        const baseRadius = fullView
          ? Math.random() * 2 + 1.5 // 1.5-3.5px for full view
          : Math.random() * 1.5 + 1; // 1-2.5px for normal view
        const baseOpacity = fullView ? 0.8 : 0.7; // Brighter for night sky effect
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * (fullView ? 0.4 : 1.5),
          dy: (Math.random() - 0.5) * (fullView ? 0.4 : 1.5),
          radius: baseRadius,
          baseRadius: baseRadius,
          opacity: baseOpacity,
          baseOpacity: baseOpacity,
          twinkle: Math.random() * Math.PI * 2, // Random starting phase for twinkle
          twinkleSpeed: 0.02 + Math.random() * 0.03, // Varying twinkle speeds
          fact: fact.fact,
          category: fact.category,
        });
      }
    };

    const drawParticle = (
      ctx: CanvasRenderingContext2D,
      particle: Particle
    ) => {
      // Save context state
      ctx.save();

      // Determine star color - white/amber for night sky effect
      let starColor: string;
      let glowColor: string;

      if (fullView && particle.category) {
        // In full view, use category colors but with star-like glow
        starColor = categoryColors[particle.category as CategoryType];
        glowColor = starColor;
      } else {
        // Night sky stars: white to amber gradient
        starColor = `rgba(255, 255, 255, ${particle.opacity})`;
        glowColor = `rgba(255, 213, 128, ${particle.opacity * 0.8})`;
      }

      // Draw outer glow (larger, more transparent)
      const glowRadius = particle.radius * 3;
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        glowRadius
      );

      if (fullView && particle.category && starColor) {
        // Ensure starColor is a hex color and convert opacity to hex
        const hexColor = starColor.startsWith("#")
          ? starColor
          : `#${starColor}`;
        const opacityHex60 = Math.floor(particle.opacity * 0.6 * 255)
          .toString(16)
          .padStart(2, "0");
        const opacityHex30 = Math.floor(particle.opacity * 0.3 * 255)
          .toString(16)
          .padStart(2, "0");

        gradient.addColorStop(0, `${hexColor}${opacityHex60}`);
        gradient.addColorStop(0.3, `${hexColor}${opacityHex30}`);
        gradient.addColorStop(1, `${hexColor}00`);
      } else {
        gradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${particle.opacity * 0.4})`
        );
        gradient.addColorStop(
          0.3,
          `rgba(255, 213, 128, ${particle.opacity * 0.2})`
        );
        gradient.addColorStop(1, "rgba(255, 213, 128, 0)");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw middle glow (medium size)
      const middleGlowRadius = particle.radius * 1.8;
      const middleGradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        middleGlowRadius
      );

      if (fullView && particle.category && starColor) {
        // Ensure starColor is a hex color and convert opacity to hex
        const hexColor = starColor.startsWith("#")
          ? starColor
          : `#${starColor}`;
        const opacityHex80 = Math.floor(particle.opacity * 0.8 * 255)
          .toString(16)
          .padStart(2, "0");
        const opacityHex40 = Math.floor(particle.opacity * 0.4 * 255)
          .toString(16)
          .padStart(2, "0");

        middleGradient.addColorStop(0, `${hexColor}${opacityHex80}`);
        middleGradient.addColorStop(0.5, `${hexColor}${opacityHex40}`);
        middleGradient.addColorStop(1, `${hexColor}00`);
      } else {
        middleGradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${particle.opacity * 0.6})`
        );
        middleGradient.addColorStop(
          0.5,
          `rgba(255, 213, 128, ${particle.opacity * 0.3})`
        );
        middleGradient.addColorStop(1, "rgba(255, 213, 128, 0)");
      }

      ctx.fillStyle = middleGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, middleGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw the bright star core (small, bright point)
      const coreGradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius
      );

      if (fullView && particle.category && starColor) {
        // Ensure starColor is a hex color and convert opacity to hex
        const hexColor = starColor.startsWith("#")
          ? starColor
          : `#${starColor}`;
        const opacityHex = Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0");
        const opacityHex70 = Math.floor(particle.opacity * 0.7 * 255)
          .toString(16)
          .padStart(2, "0");

        coreGradient.addColorStop(0, `${hexColor}${opacityHex}`);
        coreGradient.addColorStop(0.7, `${hexColor}${opacityHex70}`);
        coreGradient.addColorStop(1, `${hexColor}00`);
      } else {
        coreGradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${particle.opacity})`
        );
        coreGradient.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${particle.opacity * 0.8})`
        );
        coreGradient.addColorStop(1, `rgba(255, 213, 128, 0)`);
      }

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();

      // Restore context state
      ctx.restore();

      if (particle === selectedParticle) {
        const targetRadius = fullView ? 200 : 150;
        const currentRadius =
          particle.baseRadius +
          (targetRadius - particle.baseRadius) * animationProgress;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = particle.category
          ? `${categoryColors[particle.category as CategoryType]}${Math.floor(
              particle.opacity * 255
            )
              .toString(16)
              .padStart(2, "0")}`
          : `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };

    const connectParticles = (p1: Particle, p2: Particle) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = fullView ? 200 : 150;

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.3;
        ctx.beginPath();

        // Use category colors for connections in fullView mode
        if (fullView && p1.category && p2.category) {
          const color1 = categoryColors[p1.category as CategoryType];
          const color2 = categoryColors[p2.category as CategoryType];
          // Create gradient between the two colors
          const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(
            0,
            `${color1}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`
          );
          gradient.addColorStop(
            1,
            `${color2}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`
          );
          ctx.strokeStyle = gradient;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        }

        ctx.lineWidth = 1;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, i) => {
        // Update twinkle effect - more pronounced for night sky stars
        particle.twinkle += particle.twinkleSpeed;
        const twinkleFactor = (Math.sin(particle.twinkle) + 1) / 2; // 0 to 1
        const twinkleVariation = 0.3; // How much the opacity varies (30% for more visible twinkling)

        // Mouse interaction
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Handle particle appearance
        if (distance < 300 && !fullView) {
          const angle = Math.atan2(dy, dx);
          const force = (300 - distance) / 300;

          if (isHovering.current) {
            particle.radius = particle.baseRadius * (1 - force * 0.5);
            const baseOpacity = 0.5 + force * 0.5;
            particle.opacity =
              baseOpacity + (twinkleFactor - 0.5) * twinkleVariation;
            const repulsionForce = force * 6;
            particle.x -= Math.cos(angle) * repulsionForce;
            particle.y -= Math.sin(angle) * repulsionForce;
          } else {
            particle.radius = particle.baseRadius;
            const baseOpacity = particle.baseOpacity;
            particle.opacity =
              baseOpacity + (twinkleFactor - 0.5) * twinkleVariation;
            const repulsionForce = force * 4;
            particle.x -= Math.cos(angle) * repulsionForce;
            particle.y -= Math.sin(angle) * repulsionForce;
          }
        } else {
          // Add hover effect for full view mode
          if (fullView && distance < 50) {
            const hoverForce = (50 - distance) / 50;
            particle.radius = particle.baseRadius * (1 + hoverForce * 1.5);
            const baseOpacity = 0.7 + hoverForce * 0.3;
            particle.opacity =
              baseOpacity + (twinkleFactor - 0.5) * twinkleVariation;
          } else {
            particle.radius = particle.baseRadius;
            const baseOpacity = particle.baseOpacity;
            particle.opacity =
              baseOpacity + (twinkleFactor - 0.5) * twinkleVariation;
          }
        }

        // Handle particle movement
        if (fullView) {
          // Update velocity with random variation
          const randomX = (Math.random() - 0.5) * 0.06;
          const randomY = (Math.random() - 0.5) * 0.06;

          // Update velocity with momentum
          particle.dx = particle.dx * 0.99 + randomX;
          particle.dy = particle.dy * 0.99 + randomY;

          // Keep velocity within bounds
          const maxSpeed = 1.5;
          const speed = Math.sqrt(
            particle.dx * particle.dx + particle.dy * particle.dy
          );
          if (speed > maxSpeed) {
            const ratio = maxSpeed / speed;
            particle.dx *= ratio;
            particle.dy *= ratio;
          }

          // Apply movement
          particle.x += particle.dx;
          particle.y += particle.dy;
        } else {
          const movementSpeed = 1.2;
          particle.x += particle.dx * movementSpeed;
          particle.y += particle.dy * movementSpeed;
        }

        // Bounce off edges
        if (particle.x < 0) {
          particle.x = 0;
          particle.dx = Math.abs(particle.dx);
        } else if (particle.x > canvas.width) {
          particle.x = canvas.width;
          particle.dx = -Math.abs(particle.dx);
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.dy = Math.abs(particle.dy);
        } else if (particle.y > canvas.height) {
          particle.y = canvas.height;
          particle.dy = -Math.abs(particle.dy);
        }

        drawParticle(ctx, particle);

        // Connect with nearby particles
        for (let j = i + 1; j < particles.current.length; j++) {
          connectParticles(particle, particles.current[j]);
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
    };

    const handleClick = (event: MouseEvent) => {
      if (!fullView) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find clicked particle
      const clickedParticle = particles.current.find((particle) => {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < particle.radius * 2;
      });

      if (clickedParticle && clickedParticle.fact && clickedParticle.category) {
        setSelectedParticle(clickedParticle);
        setSelectedFact({
          fact: clickedParticle.fact,
          category: clickedParticle.category,
        });
        // Animate particle enlargement
        const startTime = Date.now();
        const duration = 500;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          setAnimationProgress(progress);

          clickedParticle.radius =
            clickedParticle.baseRadius * (1 + progress * 3);
          clickedParticle.opacity = 0.7 + progress * 0.3;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      } else {
        setSelectedParticle(null);
        setSelectedFact(null);
        // Reset all particles
        particles.current.forEach((p) => {
          p.radius = p.baseRadius;
          p.opacity = fullView ? 0.7 : 0.5;
        });
      }
    };

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    // Event listeners
    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [fullView, selectedParticle, animationProgress]);

  const handleCloseDialog = () => {
    setSelectedFact(null);
    setSelectedParticle(null);
    // Reset all particles
    particles.current.forEach((p) => {
      p.radius = p.baseRadius;
      p.opacity = fullView ? 0.7 : 0.5;
    });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
          cursor: fullView ? "pointer" : "none",
        }}
      />
      {selectedFact && (
        <FactDialog fact={selectedFact} onClose={handleCloseDialog} />
      )}
    </>
  );
};

export default ParticleBackground;

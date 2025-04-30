import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
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
        const baseRadius = fullView
          ? Math.random() * 7 + 5
          : Math.random() * 4 + 3;
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * (fullView ? 0.4 : 1.5),
          dy: (Math.random() - 0.5) * (fullView ? 0.4 : 1.5),
          radius: baseRadius,
          baseRadius: baseRadius,
          opacity: fullView ? 0.7 : 0.6,
          fact: fact.fact,
          category: fact.category,
        });
      }
    };

    const drawParticle = (
      ctx: CanvasRenderingContext2D,
      particle: Particle
    ) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      // Use category colors in fullView mode, white otherwise
      if (fullView && particle.category) {
        const color = categoryColors[particle.category as CategoryType];
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      }

      ctx.fill();

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

        if (particle.fact) {
          // Add "Did you know?" text
          ctx.font = "bold 24px Arial";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText("Did you know?", particle.x, particle.y - 100);

          // Draw fact text with background
          ctx.font = "20px Arial";
          const lines = particle.fact.split("\n");
          const lineHeight = 32;
          const padding = 20;
          const startY = particle.y - 50;

          // Calculate text dimensions
          const maxWidth = Math.max(
            ...lines.map((line) => ctx.measureText(line).width)
          );
          const totalHeight = lines.length * lineHeight;

          // Draw semi-transparent background
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(
            particle.x - maxWidth / 2 - padding,
            startY - lineHeight / 2,
            maxWidth + padding * 2,
            totalHeight + padding * 2
          );

          // Draw fact text
          ctx.fillStyle = "#ffffff";
          lines.forEach((line, index) => {
            ctx.fillText(line, particle.x, startY + index * lineHeight);
          });

          // Draw category
          if (particle.category) {
            ctx.font = "bold 18px Arial";
            ctx.fillStyle = categoryColors[particle.category as CategoryType];
            ctx.fillText(
              particle.category,
              particle.x,
              startY + lines.length * lineHeight + 15
            );
          }
        }
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
        // Mouse interaction
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300 && !fullView) {
          const angle = Math.atan2(dy, dx);
          const force = (300 - distance) / 300;

          if (isHovering.current) {
            particle.radius = particle.baseRadius * (1 - force * 0.5);
            particle.opacity = 0.5 + force * 0.5;
            const repulsionForce = force * 6;
            particle.x -= Math.cos(angle) * repulsionForce;
            particle.y -= Math.sin(angle) * repulsionForce;
            const movementSpeed = 0.5;
            particle.x += particle.dx * movementSpeed;
            particle.y += particle.dy * movementSpeed;
          } else {
            particle.radius = particle.baseRadius;
            particle.opacity = 0.6;
            const repulsionForce = force * 4;
            particle.x -= Math.cos(angle) * repulsionForce;
            particle.y -= Math.sin(angle) * repulsionForce;
            const movementSpeed = 1;
            particle.x += particle.dx * movementSpeed;
            particle.y += particle.dy * movementSpeed;
          }
        } else {
          particle.radius = particle.baseRadius;
          particle.opacity = fullView ? 0.7 : 0.6;

          if (fullView) {
            // Smoother movement in fullView mode
            const movementSpeed = 1.0; // Slightly reduced from 1.2 for smoother motion
            // Add smoother random variation
            particle.dx += (Math.random() - 0.5) * 0.04; // Reduced from 0.08 for less flickering
            particle.dy += (Math.random() - 0.5) * 0.04; // Reduced from 0.08 for less flickering
            // Keep velocity within smoother bounds
            particle.dx = Math.max(Math.min(particle.dx, 1.0), -1.0); // Reduced from 1.2 for smoother motion
            particle.dy = Math.max(Math.min(particle.dy, 1.0), -1.0); // Reduced from 1.2 for smoother motion
            // Apply movement with smoother transitions
            particle.x += particle.dx * movementSpeed;
            particle.y += particle.dy * movementSpeed;
          } else {
            const movementSpeed = 1.2;
            particle.x += particle.dx * movementSpeed;
            particle.y += particle.dy * movementSpeed;
          }
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

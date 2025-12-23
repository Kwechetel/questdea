import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const existingInsights = [
  {
    title: "Building Scalable Microservices Architecture",
    slug: "building-scalable-microservices-architecture",
    description:
      "A deep dive into designing microservices that scale from startup to enterprise. Learn the patterns, pitfalls, and best practices we've discovered building production systems.",
    category: "Architecture",
    readTime: "12 min",
    author: "LASTTE Team",
    tags: ["Microservices", "Scalability", "System Design"],
    featured: true,
    published: true,
  },
  {
    title: "From MVP to Production: A Real-World Case Study",
    slug: "from-mvp-to-production-real-world-case-study",
    description:
      "How we helped a fintech startup scale from 0 to 100K users in 6 months. The technical decisions, trade-offs, and lessons learned along the way.",
    category: "Case Study",
    readTime: "15 min",
    author: "LASTTE Team",
    tags: ["Fintech", "Scaling", "Production"],
    featured: true,
    published: true,
  },
  {
    title: "Database Design Patterns for High-Traffic Applications",
    slug: "database-design-patterns-high-traffic-applications",
    description:
      "Exploring database architectures that handle millions of requests. When to use SQL vs NoSQL, sharding strategies, and caching layers.",
    category: "Engineering",
    readTime: "10 min",
    author: "LASTTE Team",
    tags: ["Database", "Performance", "Architecture"],
    featured: false,
    published: true,
  },
  {
    title: "Security First: Building Trust in Digital Products",
    slug: "security-first-building-trust-digital-products",
    description:
      "Security isn't an afterthought—it's a foundation. How we implement security at every layer, from authentication to data encryption.",
    category: "Security",
    readTime: "8 min",
    author: "LASTTE Team",
    tags: ["Security", "Best Practices", "Compliance"],
    featured: false,
    published: true,
  },
  {
    title: "Product Strategy: Aligning Technology with Business Goals",
    slug: "product-strategy-aligning-technology-business-goals",
    description:
      "Technology decisions should serve business objectives. A framework for making technical choices that drive real value.",
    category: "Strategy",
    readTime: "11 min",
    author: "LASTTE Team",
    tags: ["Strategy", "Product", "Business"],
    featured: false,
    published: true,
  },
  {
    title: "CI/CD Pipelines: From Concept to Deployment",
    slug: "ci-cd-pipelines-concept-to-deployment",
    description:
      "Building robust deployment pipelines that catch issues early and deploy with confidence. Tools, practices, and automation strategies.",
    category: "DevOps",
    readTime: "9 min",
    author: "LASTTE Team",
    tags: ["DevOps", "CI/CD", "Automation"],
    featured: false,
    published: true,
  },
];

async function main() {
  console.log("🌱 Seeding insights...");

  for (const insight of existingInsights) {
    try {
      // Check if insight already exists
      const existing = await prisma.insight.findUnique({
        where: { slug: insight.slug },
      });

      if (existing) {
        console.log(`⏭️  Insight "${insight.title}" already exists, skipping...`);
        continue;
      }

      await prisma.insight.create({
        data: insight,
      });

      console.log(`✅ Created insight: "${insight.title}"`);
    } catch (error) {
      console.error(`❌ Error creating insight "${insight.title}":`, error);
    }
  }

  console.log("✨ Insights seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import shopImage from "../assets/shop.png";
import { Link as RouterLink } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";

// ============================================================================
// Data
// ============================================================================

/**
 * Categories data for the Explore Categories section
 * Each category has a title, icon, and description
 */
const categories = [
  {
    title: "Personal Growth",
    icon: (
      <TrendingUpIcon
        fontSize="large"
        sx={{ color: "#FF9900", transform: "scale(1.2)" }}
      />
    ),
    description:
      "Discover strategies for self-improvement and personal development.",
    stats: "Join 5,000+ learners",
    topics: ["Goal Setting", "Habit Formation", "Time Management"],
    gradient: "from-orange-400 to-yellow-300",
  },
  {
    title: "Digital Skills",
    icon: (
      <LightbulbIcon
        fontSize="large"
        sx={{ color: "#FF9900", transform: "scale(1.2)" }}
      />
    ),
    description: "Learn essential digital skills for the modern world.",
    stats: "20+ courses available",
    topics: ["Web Development", "Digital Marketing", "Data Analytics"],
    gradient: "from-yellow-400 to-orange-300",
  },
  {
    title: "Leadership",
    icon: (
      <SchoolIcon
        fontSize="large"
        sx={{ color: "#FF9900", transform: "scale(1.2)" }}
      />
    ),
    description: "Develop leadership qualities and management skills.",
    stats: "Success stories: 1,000+",
    topics: ["Team Management", "Strategic Thinking", "Communication"],
    gradient: "from-orange-300 to-yellow-400",
  },
];

/**
 * Featured articles data for the Featured Content section
 * Each article has an id, title, image, and description
 */
const featuredArticles = [
  {
    id: 1,
    title: "The Power of Habit Formation",
    image: "/habit-formation.png",
    description:
      "Learn how to build and maintain positive habits that transform your life.",
    readTime: "8 min read",
    author: "Dr. Sarah Johnson",
    tags: ["Psychology", "Self-Development", "Productivity"],
  },
  {
    id: 4,
    title: "AI and the Future of Work",
    image: "/ai-future-work.png",
    description:
      "How artificial intelligence is reshaping the workplace and creating new opportunities.",
    readTime: "10 min read",
    author: "Tech Insights Team",
    tags: ["Technology", "Career", "Innovation"],
  },
  {
    id: 2,
    title: "Digital Marketing Essentials",
    image: "/digital-marketing.png",
    description:
      "Master the fundamentals of digital marketing in the modern age.",
    readTime: "12 min read",
    author: "Marketing Experts",
    tags: ["Marketing", "Digital", "Business"],
  },
];

const successStories = [
  {
    name: "Sarah Chen",
    role: "Digital Marketing Specialist",
    story:
      "Transformed my career through QuestDea's digital marketing courses. Increased my company's ROI by 150%.",
    image: "https://source.unsplash.com/random/100x100?portrait1",
    rating: 5,
    achievement: "Digital Marketing Certification",
  },
  {
    name: "James Wilson",
    role: "Tech Entrepreneur",
    story:
      "The leadership program gave me the confidence to start my own tech company. Now leading a team of 20.",
    image: "https://source.unsplash.com/random/100x100?portrait2",
    rating: 5,
    achievement: "Leadership Excellence Award",
  },
  {
    name: "Maria Rodriguez",
    role: "Personal Development Coach",
    story:
      "QuestDea's resources helped me build my coaching practice from scratch. Now impacting hundreds of lives.",
    image: "https://source.unsplash.com/random/100x100?portrait3",
    rating: 5,
    achievement: "Top Contributor 2023",
  },
];

const learningPaths = [
  {
    title: "Digital Marketing Mastery",
    duration: "12 weeks",
    level: "Beginner to Advanced",
    modules: 8,
    skills: ["SEO", "Social Media", "Content Marketing", "Analytics"],
    icon: <TimelineIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    gradient: "from-blue-400 to-purple-500",
  },
  {
    title: "Leadership Excellence",
    duration: "10 weeks",
    level: "Intermediate",
    modules: 6,
    skills: [
      "Team Management",
      "Strategic Planning",
      "Communication",
      "Decision Making",
    ],
    icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    gradient: "from-green-400 to-blue-500",
  },
  {
    title: "Personal Growth Journey",
    duration: "8 weeks",
    level: "All Levels",
    modules: 5,
    skills: ["Goal Setting", "Time Management", "Mindfulness", "Productivity"],
    icon: <WorkspacePremiumIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    gradient: "from-purple-400 to-pink-500",
  },
];

const streamCategories = [
  {
    title: "Coaching & Mentorship",
    icon: <SchoolIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "Expert guidance and personal development tips from top coaches",
    videos: 200,
    gradient: "from-blue-500 to-purple-500",
  },
  {
    title: "Educational Content",
    icon: <OndemandVideoIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "Learn new skills and expand your knowledge through bite-sized videos",
    videos: 350,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Entertainment",
    icon: <SportsEsportsIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description: "Fun and engaging content to brighten your day",
    videos: 150,
    gradient: "from-pink-500 to-red-500",
  },
  {
    title: "Fitness & Wellness",
    icon: <FitnessCenterIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description: "Quick workouts and wellness tips for a healthier lifestyle",
    videos: 180,
    gradient: "from-green-500 to-blue-500",
  },
];

const knowledgeResources = [
  {
    title: "Comprehensive Courses",
    icon: <MenuBookIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "In-depth learning paths covering various topics from basics to advanced concepts.",
    count: "25+ Courses",
    topics: ["Web Development", "Digital Marketing", "Personal Growth"],
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    title: "Expert Articles",
    icon: <ArticleIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "Well-researched articles and guides written by industry experts.",
    count: "100+ Articles",
    topics: ["Technology", "Business", "Self Development"],
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    title: "Video Tutorials",
    icon: <VideoLibraryIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description: "Step-by-step video guides and practical demonstrations.",
    count: "200+ Videos",
    topics: ["Coding", "Design", "Leadership"],
    gradient: "from-purple-400 to-pink-500",
  },
  {
    title: "Podcasts & Talks",
    icon: <PodcastsIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description: "Insightful discussions and interviews with industry leaders.",
    count: "50+ Episodes",
    topics: ["Innovation", "Career Growth", "Industry Trends"],
    gradient: "from-pink-400 to-red-500",
  },
];

const phrases = [
  "Fueling the Journey of Minds, One Idea at a Time",
  "Empowering Growth Through Digital Innovation",
  "Transforming Knowledge into Success Stories",
  "Building Tomorrow's Leaders Today",
  "Inspiring Excellence in Every Journey",
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

        if (currentText === currentPhrase) {
          setTypingSpeed(2000); // Pause at the end
          setIsDeleting(true);
        }
      } else {
        setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex(
            (prevIndex) => (prevIndex + 1) % phrases.length
          );
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, typingSpeed]);

  return (
    <Typography
      variant="h2"
      className="font-poppins font-bold mb-4"
      sx={{
        fontSize: {
          xs: "1.75rem",
          sm: "2.25rem",
          md: "3rem",
        },
        minHeight: { xs: "80px", sm: "100px", md: "120px" },
        display: "block",
        position: "relative",
        zIndex: 15,
        padding: "0 4px",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.4,
        color: "#FF9900",
        "& .typing-container": {
          display: "inline",
          position: "relative",
          background: "linear-gradient(45deg, #FF9900 30%, #FFD700 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        "& .cursor": {
          display: "inline-block",
          width: "2px",
          height: "1em",
          transform: "translateY(2px)",
          backgroundColor: "#FF9900",
          marginLeft: "2px",
          animation: "blink 1s step-start infinite",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          position: "relative",
          top: "0.1em",
        },
        "@keyframes blink": {
          "50%": {
            opacity: 0,
          },
        },
      }}
    >
      <span className="typing-container">{currentText}</span>
      <span className="cursor" />
    </Typography>
  );
};

// ============================================================================
// Component
// ============================================================================

/**
 * Home Page Component
 *
 * Structure:
 * 1. Hero Section - Main banner with headline and call-to-action
 * 2. Categories Section - Three main categories with icons
 * 3. Featured Content Section - Grid of featured articles
 * 4. Shop With Us Section - A vibrant card with a catchy headline, short description, and a 'Shop Now' button
 */
const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [isFullView, setIsFullView] = useState(false);

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* ====================================================================
          1. HERO SECTION
          ==================================================================== */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
          color: "white",
          margin: 0,
          padding: "64px 0",
          paddingTop: isMobile ? "64px" : "128px",
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ParticleBackground fullView={isFullView} />
        {!isFullView && (
          <Container
            maxWidth="lg"
            sx={{
              position: "relative",
              zIndex: 5,
              px: { xs: 3, sm: 4, md: 6 },
            }}
          >
            <Grid container spacing={4} alignItems="center">
              {/* Left side: Text content */}
              <Grid item xs={12} md={6}>
                <Box
                  className="animate-fade-in"
                  sx={{
                    position: "relative",
                    zIndex: 10,
                    height: { xs: "auto", sm: "250px", md: "300px" },
                    minHeight: { xs: "300px", sm: "250px", md: "300px" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "none",
                    backdropFilter: "none",
                    borderRadius: "16px",
                    p: { xs: 2, sm: 3 },
                    border: "none",
                    transition: "all 0.3s ease",
                    gap: { xs: 2, sm: 3 },
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minHeight: { xs: "200px", sm: "auto" },
                    }}
                  >
                    <TypedText />
                  </Box>
                  <Typography
                    variant={isMobile ? "body1" : "h5"}
                    className="mb-8"
                    sx={{
                      fontSize: isMobile
                        ? "0.9rem"
                        : isTablet
                        ? "1.25rem"
                        : "1.5rem",
                      color: "rgba(255, 255, 255, 0.95)",
                      position: "relative",
                      zIndex: 2,
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                      maxWidth: "90%",
                      lineHeight: 1.4,
                      mt: { xs: 2, sm: 0 },
                    }}
                  >
                    Discover ideas that ignite growth, innovation, and a better
                    world.
                  </Typography>
                </Box>
              </Grid>
              {/* Right side: Hero image placeholder - Hidden on mobile */}
              {!isMobile && (
                <Grid item xs={12} md={6}>
                  <Box
                    className="flex flex-col justify-center animate-fade-in-delayed"
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Box
                      className="w-full h-48 md:h-64 bg-white bg-opacity-20 rounded-lg p-4"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: "bold",
                          textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        Interactive Knowledge Particles
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          textAlign: "center",
                          maxWidth: "80%",
                          mb: 2,
                        }}
                      >
                        Each particle represents a unique fact about learning
                        and personal development. Click to discover insights
                        about Brain Power, Learning, Wellness, and Productivity.
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        {[
                          "Brain Power",
                          "Learning",
                          "Wellness",
                          "Productivity",
                        ].map((category) => (
                          <Chip
                            key={category}
                            label={category}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              color: "white",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                            }}
                          />
                        ))}
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => setIsFullView(!isFullView)}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(8px)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          },
                        }}
                      >
                        {isFullView ? "Exit Full View" : "View Particles"}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Container>
        )}
        {isFullView && !isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
            }}
          >
            <Button
              variant="contained"
              onClick={() => setIsFullView(!isFullView)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {isFullView ? "Exit Full View" : "View Particles"}
            </Button>
          </Box>
        )}
      </Box>

      {/* ====================================================================
          2. CATEGORIES SECTION
          ==================================================================== */}
      <Container maxWidth="lg" className="py-10 md:py-16">
        <Typography
          variant={isMobile ? "h4" : "h3"}
          className="text-center font-poppins font-bold mb-8 md:mb-12"
          sx={{
            fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
            background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Explore Categories
        </Typography>
        <Grid container spacing={4} sx={{ px: isMobile ? 1 : 0 }}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={category.title}>
              <Box
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <Card
                  className={`h-full transition-all duration-300 relative overflow-hidden hover:translate-y-[-8px]`}
                  sx={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box
                    className={`absolute inset-0 opacity-5 bg-gradient-to-br ${category.gradient}`}
                  />
                  <CardContent className="text-center p-6 relative">
                    <Box className="mb-4 transform transition-transform duration-300 hover:scale-110">
                      {category.icon}
                    </Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      className="font-poppins font-bold mb-3"
                      sx={{
                        fontSize: isMobile ? "1.1rem" : "1.25rem",
                        color: "#1A1A2E",
                      }}
                    >
                      {category.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-4"
                      sx={{ opacity: 0.85 }}
                    >
                      {category.description}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#FF9900",
                        mb: 2,
                        fontWeight: 600,
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {category.stats}
                    </Typography>
                    <Box className="flex flex-wrap gap-1 justify-center">
                      {category.topics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            color: "#1A1A2E",
                            border: "1px solid rgba(255, 153, 0, 0.2)",
                            "&:hover": {
                              bgcolor: "rgba(255, 153, 0, 0.15)",
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ====================================================================
          3. FEATURED CONTENT SECTION
          ==================================================================== */}
      <Box className="bg-gray-50 py-10 md:py-16">
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h4" : "h3"}
            className="text-center font-poppins font-bold mb-8 md:mb-12"
            sx={{
              fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
              background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Featured Content
          </Typography>
          <Grid container spacing={4} sx={{ px: isMobile ? 1 : 0 }}>
            {featuredArticles.map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Box
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${(idx + 1) * 0.2}s`,
                  }}
                >
                  <Card
                    className="h-full transition-all duration-300 hover:translate-y-[-8px]"
                    sx={{
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={isMobile ? 160 : 200}
                      image={item.image}
                      alt={item.title}
                      sx={{
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        className="font-poppins font-bold mb-2"
                        sx={{
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          color: "#1A1A2E",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="mb-3"
                        sx={{ opacity: 0.85 }}
                      >
                        {item.description}
                      </Typography>
                      <Box className="flex items-center justify-between mb-3">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#FF9900",
                            fontWeight: 600,
                          }}
                        >
                          By {item.author}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {item.readTime}
                        </Typography>
                      </Box>
                      <Box className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255, 153, 0, 0.08)",
                              color: "#1A1A2E",
                              border: "1px solid rgba(255, 153, 0, 0.2)",
                              "&:hover": {
                                bgcolor: "rgba(255, 153, 0, 0.15)",
                                transform: "scale(1.05)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ====================================================================
          4. SHOP WITH US SECTION
          ==================================================================== */}
      <Container maxWidth="lg" className="py-10 md:py-16">
        <Grid container spacing={6} alignItems="center">
          {/* Left side: Content */}
          <Grid item xs={12} md={6}>
            <Box className="animate-fade-in">
              <Typography
                variant={isMobile ? "h4" : "h3"}
                className="font-poppins font-bold mb-4"
                sx={{
                  fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
                  background:
                    "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Shop With Us
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                className="mb-6"
                sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }}
              >
                Discover our curated collection of products designed to enhance
                your learning journey. From digital tools to physical resources,
                find everything you need to succeed.
              </Typography>
              <Button
                variant="contained"
                href="/shop"
                sx={{
                  bgcolor: "#FF9900",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#e68a00",
                  },
                }}
              >
                Visit Shop
              </Button>
            </Box>
          </Grid>
          {/* Right side: Image */}
          <Grid item xs={12} md={6}>
            <Box className="animate-fade-in-delayed">
              <img
                src={shopImage}
                alt="QuestDea Shop"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ====================================================================
          5. QUESTDEA STREAMS SECTION
          ==================================================================== */}
      <Box className="bg-gray-50 py-10 md:py-16">
        <Container maxWidth="lg">
          {/* Header */}
          <Box className="text-center mb-12">
            <Typography
              variant={isMobile ? "h4" : "h3"}
              className="font-poppins font-bold mb-4"
              sx={{
                fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
                background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              QuestDea Streams
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: "800px",
                margin: "0 auto",
                fontSize: isMobile ? "1rem" : "1.1rem",
                color: "text.secondary",
              }}
            >
              Stream and watch engaging content from our community of experts
              and creators
            </Typography>
          </Box>

          {/* Stream Categories Grid */}
          <Grid container spacing={4}>
            {streamCategories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.title}>
                <Card
                  className="h-full transition-all duration-300 hover:translate-y-[-8px]"
                  sx={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    className={`absolute inset-0 opacity-5 bg-gradient-to-br ${category.gradient}`}
                  />
                  <CardContent sx={{ p: 3, position: "relative" }}>
                    <Box className="flex justify-center mb-4 transform transition-transform duration-300 hover:scale-110">
                      {category.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#1A1A2E",
                        mb: 2,
                      }}
                    >
                      {category.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ color: "text.secondary", mb: 2 }}
                    >
                      {category.description}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{
                        color: "#FF9900",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <PlayCircleIcon sx={{ fontSize: 20 }} />
                      {category.videos}+ Videos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Mobile App Download */}
          <Box className="text-center mt-12">
            <Typography
              variant="h6"
              className="mb-4"
              sx={{ color: "text.secondary" }}
            >
              Download our mobile app to watch on the go
            </Typography>
            <Box className="flex justify-center gap-4">
              <Button
                variant="contained"
                startIcon={<AppleIcon />}
                sx={{
                  bgcolor: "#1A1A2E",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#2A2A3E",
                  },
                }}
              >
                App Store
              </Button>
              <Button
                variant="contained"
                startIcon={<AndroidIcon />}
                sx={{
                  bgcolor: "#1A1A2E",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#2A2A3E",
                  },
                }}
              >
                Play Store
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ====================================================================
          6. KNOWLEDGE HUB SECTION
          ==================================================================== */}
      <Box className="bg-questdea-navy text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <Box
          className="absolute inset-0 opacity-5"
          sx={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, white 2%, transparent 0%)",
            backgroundSize: "50px 50px",
          }}
        />

        <Container maxWidth="lg" className="relative">
          {/* Header */}
          <Box className="text-center mb-12">
            <Typography
              variant={isMobile ? "h4" : "h3"}
              className="font-poppins font-bold mb-4"
              sx={{
                fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
                background: "linear-gradient(45deg, #FF9900 30%, #FFD700 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Knowledge Hub
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: "800px",
                margin: "0 auto",
                fontSize: isMobile ? "1rem" : "1.1rem",
              }}
            >
              Explore our comprehensive collection of learning resources
              designed to help you grow
            </Typography>
          </Box>

          {/* Resources Grid */}
          <Grid container spacing={4}>
            {knowledgeResources.map((resource) => (
              <Grid item xs={12} sm={6} md={3} key={resource.title}>
                <Card
                  className="h-full transition-all duration-300 hover:translate-y-[-8px]"
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box className="flex justify-center mb-4">
                      {resource.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "white",
                        mb: 2,
                      }}
                    >
                      {resource.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}
                    >
                      {resource.description}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{
                        color: "#FF9900",
                        mb: 2,
                        fontWeight: 600,
                      }}
                    >
                      {resource.count}
                    </Typography>
                    <Box className="flex flex-wrap gap-1 justify-center">
                      {resource.topics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            color: "white",
                            border: "1px solid rgba(255, 153, 0, 0.2)",
                            "&:hover": {
                              bgcolor: "rgba(255, 153, 0, 0.15)",
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Call to Action */}
          <Box className="text-center mt-12">
            <Button
              variant="contained"
              component={RouterLink}
              to="/knowledge-hub"
              sx={{
                bgcolor: "#FF9900",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#e68a00",
                },
              }}
            >
              Explore All Resources
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Success Stories Section */}
      <Container maxWidth="lg" className="py-10 md:py-16">
        <Typography
          variant={isMobile ? "h4" : "h3"}
          className="text-center font-poppins font-bold mb-8 md:mb-12"
          sx={{
            fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
            background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Success Stories
        </Typography>
        <Grid container spacing={4}>
          {successStories.map((story, index) => (
            <Grid item xs={12} md={4} key={story.name}>
              <Card
                className="h-full transition-all duration-300 hover:translate-y-[-8px]"
                sx={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box className="flex items-center mb-4">
                    <Avatar
                      src={story.image}
                      alt={story.name}
                      sx={{ width: 60, height: 60, marginRight: 2 }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#1A1A2E",
                        }}
                      >
                        {story.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#FF9900", fontWeight: 500 }}
                      >
                        {story.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      fontStyle: "italic",
                      color: "text.secondary",
                      opacity: 0.85,
                    }}
                  >
                    "{story.story}"
                  </Typography>
                  <Box className="flex items-center justify-between">
                    <Box className="flex">
                      {[...Array(story.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          sx={{
                            color: "#FF9900",
                            fontSize: 20,
                          }}
                        />
                      ))}
                    </Box>
                    <Chip
                      label={story.achievement}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 153, 0, 0.08)",
                        color: "#1A1A2E",
                        border: "1px solid rgba(255, 153, 0, 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(255, 153, 0, 0.15)",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Learning Paths Section */}
      <Box className="bg-gray-50 py-10 md:py-16">
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h4" : "h3"}
            className="text-center font-poppins font-bold mb-8 md:mb-12"
            sx={{
              fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
              background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Learning Paths
          </Typography>
          <Grid container spacing={4}>
            {learningPaths.map((path, index) => (
              <Grid item xs={12} md={4} key={path.title}>
                <Card
                  className="h-full transition-all duration-300 hover:translate-y-[-8px]"
                  sx={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    className={`absolute inset-0 opacity-5 bg-gradient-to-br ${path.gradient}`}
                  />
                  <CardContent sx={{ p: 3, position: "relative" }}>
                    <Box className="flex justify-center mb-4">{path.icon}</Box>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: "#1A1A2E",
                        mb: 2,
                      }}
                    >
                      {path.title}
                    </Typography>
                    <Box className="flex justify-between mb-3">
                      <Typography
                        variant="body2"
                        sx={{ color: "#FF9900", fontWeight: 500 }}
                      >
                        {path.duration}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {path.modules} modules
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        textAlign: "center",
                        bgcolor: "rgba(255, 153, 0, 0.08)",
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {path.level}
                    </Typography>
                    <Box className="flex flex-wrap gap-1 justify-center">
                      {path.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            color: "#1A1A2E",
                            border: "1px solid rgba(255, 153, 0, 0.2)",
                            "&:hover": {
                              bgcolor: "rgba(255, 153, 0, 0.15)",
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

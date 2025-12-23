import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GroupsIcon from "@mui/icons-material/Groups";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import BuildIcon from "@mui/icons-material/Build";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const values = [
  {
    title: "Clarity",
    icon: <LightbulbIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "We bring clarity to complex problems, helping you understand your vision and map the path forward with precision.",
  },
  {
    title: "Reliability",
    icon: <GroupsIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "We build systems you can trust—robust architectures, clean code, and scalable foundations that stand the test of time.",
  },
  {
    title: "Purpose",
    icon: <TimelineIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "Every solution we create serves a clear purpose, aligned with your business goals and user needs.",
  },
  {
    title: "Scale",
    icon: <EmojiObjectsIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "We design for growth from day one, ensuring your platform evolves seamlessly as your business expands.",
  },
];

const services = [
  {
    title: "Design",
    icon: <DesignServicesIcon sx={{ fontSize: 48, color: "#FF9900" }} />,
    description:
      "Clarify your product vision, map customer journeys, and craft intuitive interfaces that feel effortless to use.",
    gradient:
      "linear-gradient(135deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 213, 128, 0.05) 100%)",
  },
  {
    title: "Build",
    icon: <BuildIcon sx={{ fontSize: 48, color: "#FF9900" }} />,
    description:
      "Ship reliable digital products with modern architectures, clean code, and scalable foundations from day one.",
    gradient:
      "linear-gradient(135deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 213, 128, 0.05) 100%)",
  },
  {
    title: "Scale",
    icon: <TrendingUpIcon sx={{ fontSize: 48, color: "#FF9900" }} />,
    description:
      "Optimize performance, refine UX, and evolve your platform as your customers and business grow.",
    gradient:
      "linear-gradient(135deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 213, 128, 0.05) 100%)",
  },
];

const teamMembers = [
  {
    name: "Last Kwechete",
    role: "Digital Systems Architect, Full-Stack Engineer, and Startup Builder",
    image: "https://source.unsplash.com/random/200x200?portrait1",
    description:
      "Last designs, builds, and deploys end-to-end digital systems — combining business strategy, system architecture, UX/UI, full-stack development, infrastructure, and deployment to turn ideas into scalable, production-ready products. He works architecture-first, focusing on clarity, long-term reliability, and systems that grow with businesses rather than rushed builds that break over time. Last is the founder of LASTTE, a digital systems studio dedicated to building technology that lasts and helping startups move from concept to real, operating products. In simple terms: Last Kwechete is someone who takes ideas seriously — and turns them into real systems, real products, and real businesses.",
  },
];

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
          color: "#fff",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h3" : "h2"}
            className="font-poppins font-bold mb-6 text-center"
            sx={{
              fontSize: isMobile ? "1.75rem" : isTablet ? "2.25rem" : "3rem",
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            About LASTTE
          </Typography>
          <Typography
            variant="h6"
            className="text-center mb-8"
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              opacity: 0.9,
              fontSize: isMobile ? "1rem" : "1.1rem",
              color: "#FFD580",
              fontWeight: 300,
            }}
          >
            Helping you design, build, and scale digital products and platforms
            with clarity, reliability, and purpose.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 30%, rgba(255, 153, 0, 0.05) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 213, 128, 0.05) 100%)",
                border: "2px solid rgba(255, 153, 0, 0.2)",
                mb: 3,
                boxShadow: "0 8px 32px rgba(255, 153, 0, 0.15)",
              }}
            >
              <RocketLaunchIcon
                sx={{
                  fontSize: { xs: 40, md: 50 },
                  color: "#FF9900",
                }}
              />
            </Box>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              className="font-poppins font-bold"
              sx={{
                fontSize: isMobile ? "1.75rem" : "2.5rem",
                background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                mb: { xs: 2, md: 3 },
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#1A1A2E",
                maxWidth: "700px",
                margin: "0 auto",
                fontSize: { xs: "1rem", md: "1.15rem" },
                fontWeight: 400,
                lineHeight: 1.8,
              }}
            >
              At LASTTE, we're on a mission to help businesses design, build,
              and scale digital products and platforms that make a real impact.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "#ffffff",
                  border: "1px solid rgba(255, 153, 0, 0.2)",
                  borderRadius: "24px",
                  p: { xs: 4, md: 5 },
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "1px solid rgba(255, 153, 0, 0.4)",
                    boxShadow: "0 8px 32px rgba(255, 153, 0, 0.2)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FF9900",
                    fontWeight: 600,
                    mb: 3,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 28, color: "#FF9900" }} />
                  Clarity First
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#1A1A2E",
                    lineHeight: 1.8,
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    fontWeight: 400,
                  }}
                >
                  We believe that great technology starts with
                  clarity—understanding your vision, mapping the journey, and
                  building with purpose. Every decision we make is guided by a
                  clear understanding of your goals and the path to achieve
                  them.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "#ffffff",
                  border: "1px solid rgba(255, 153, 0, 0.2)",
                  borderRadius: "24px",
                  p: { xs: 4, md: 5 },
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "1px solid rgba(255, 153, 0, 0.4)",
                    boxShadow: "0 8px 32px rgba(255, 153, 0, 0.2)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FF9900",
                    fontWeight: 600,
                    mb: 3,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 28, color: "#FF9900" }} />
                  Built to Last
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#1A1A2E",
                    lineHeight: 1.8,
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    fontWeight: 400,
                  }}
                >
                  We combine strategic thinking with technical excellence to
                  create reliable systems, intuitive interfaces, and scalable
                  architectures that grow with your business. From initial
                  concept to production and beyond, we're here to turn your
                  ideas into platforms built to last.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #050816 0%, #1A1A2E 50%, #050816 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 20%, rgba(255, 153, 0, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 213, 128, 0.06) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            className="text-center font-poppins font-bold"
            sx={{
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              color: "#fff",
              fontWeight: 700,
              mb: { xs: 2, md: 3 },
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            Services
          </Typography>
          <Typography
            variant="body1"
            className="text-center"
            sx={{
              color: "rgba(255, 213, 128, 0.8)",
              mb: { xs: 6, md: 8 },
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: isMobile ? "0.95rem" : "1.1rem",
              fontWeight: 300,
            }}
          >
            From concept to production, we guide you through every stage of your
            digital journey
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={service.title}>
                <Card
                  sx={{
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 213, 128, 0.2)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 20px 60px rgba(255, 153, 0, 0.25)",
                      border: "1px solid rgba(255, 213, 128, 0.5)",
                      "& .service-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                      "& .service-number": {
                        opacity: 1,
                        transform: "scale(1)",
                      },
                    },
                  }}
                >
                  {/* Number Badge */}
                  <Box
                    className="service-number"
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "rgba(255, 153, 0, 0.2)",
                      border: "2px solid rgba(255, 213, 128, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.6,
                      transform: "scale(0.9)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#FFD580",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>

                  {/* Gradient Background */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "120px",
                      background: service.gradient,
                      opacity: 0.3,
                      zIndex: 0,
                    }}
                  />

                  <CardContent
                    sx={{
                      p: { xs: 4, md: 5 },
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* Icon Container */}
                    <Box
                      className="service-icon"
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        borderRadius: "20px",
                        background: "rgba(255, 153, 0, 0.15)",
                        border: "2px solid rgba(255, 213, 128, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 4px 20px rgba(255, 153, 0, 0.2)",
                      }}
                    >
                      {service.icon}
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFD580",
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: "1.25rem", md: "1.5rem" },
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.85)",
                        lineHeight: 1.8,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        fontWeight: 300,
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #050816 0%, #1A1A2E 100%)",
          py: { xs: 6, md: 8 },
          color: "#fff",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h4" : "h3"}
            className="text-center font-poppins font-bold"
            sx={{
              fontSize: isMobile ? "1.5rem" : "2rem",
              color: "#fff",
              fontWeight: 700,
              mb: { xs: 4, md: 5 },
            }}
          >
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value) => (
              <Grid item xs={12} sm={6} md={3} key={value.title}>
                <Card
                  className="h-full transition-all duration-300 hover:translate-y-[-8px]"
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 213, 128, 0.1)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(255, 153, 0, 0.3)",
                      border: "1px solid rgba(255, 213, 128, 0.3)",
                    },
                  }}
                >
                  <CardContent className="text-center p-6">
                    <Box className="mb-4">{value.icon}</Box>
                    <Typography
                      variant="h6"
                      className="mb-2"
                      sx={{ color: "#FFD580", fontWeight: 600 }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #050816 0%, #1A1A2E 50%, #050816 100%)",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255, 153, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 213, 128, 0.08) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            className="text-center font-poppins font-bold"
            sx={{
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              color: "#fff",
              fontWeight: 700,
              mb: { xs: 2, md: 3 },
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            Led By
          </Typography>
          <Typography
            variant="body1"
            className="text-center"
            sx={{
              color: "rgba(255, 213, 128, 0.8)",
              mb: { xs: 6, md: 8 },
              maxWidth: "600px",
              margin: "0 auto",
              fontSize: isMobile ? "0.95rem" : "1.1rem",
              fontWeight: 300,
            }}
          >
            The architect behind LASTTE
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member) => (
              <Grid item xs={12} md={10} lg={8} key={member.name}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 213, 128, 0.2)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 48px rgba(255, 153, 0, 0.2)",
                      border: "1px solid rgba(255, 213, 128, 0.4)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "center", md: "flex-start" },
                        gap: { xs: 3, md: 4 },
                      }}
                    >
                      {/* Avatar Section */}
                      <Box
                        sx={{
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: 140, md: 160 },
                            height: { xs: 140, md: 160 },
                            borderRadius: "50%",
                            background:
                              "radial-gradient(circle, rgba(255, 153, 0, 0.3) 0%, transparent 70%)",
                            filter: "blur(20px)",
                            zIndex: 0,
                          }}
                        />
                        <Avatar
                          src={member.image}
                          alt={member.name}
                          sx={{
                            width: { xs: 140, md: 160 },
                            height: { xs: 140, md: 160 },
                            border: "4px solid rgba(255, 213, 128, 0.5)",
                            boxShadow:
                              "0 8px 32px rgba(255, 153, 0, 0.3), inset 0 0 40px rgba(255, 213, 128, 0.1)",
                            position: "relative",
                            zIndex: 1,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                              border: "4px solid rgba(255, 213, 128, 0.8)",
                              boxShadow:
                                "0 12px 48px rgba(255, 153, 0, 0.4), inset 0 0 60px rgba(255, 213, 128, 0.2)",
                            },
                          }}
                        />
                      </Box>

                      {/* Content Section */}
                      <Box
                        sx={{
                          flex: 1,
                          textAlign: { xs: "center", md: "left" },
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#FFD580",
                            fontWeight: 700,
                            mb: 1.5,
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        >
                          {member.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: { xs: "center", md: "flex-start" },
                            mb: 3,
                          }}
                        >
                          {member.role.split(", ").map((role, index) => (
                            <Box
                              key={index}
                              sx={{
                                px: 2,
                                py: 0.75,
                                background: "rgba(255, 153, 0, 0.15)",
                                border: "1px solid rgba(255, 213, 128, 0.3)",
                                borderRadius: "20px",
                                backdropFilter: "blur(10px)",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#FFD580",
                                  fontWeight: 600,
                                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                                }}
                              >
                                {role}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "rgba(255, 255, 255, 0.85)",
                            lineHeight: 1.8,
                            fontSize: { xs: "0.95rem", md: "1.05rem" },
                            fontWeight: 300,
                          }}
                        >
                          {member.description}
                        </Typography>
                      </Box>
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

export default About;

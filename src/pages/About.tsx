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

const values = [
  {
    title: "Innovation",
    icon: <LightbulbIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "We constantly push boundaries to bring you cutting-edge learning experiences and content.",
  },
  {
    title: "Community",
    icon: <GroupsIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "We believe in the power of collective growth and shared knowledge.",
  },
  {
    title: "Growth",
    icon: <TimelineIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "We're committed to helping every individual reach their full potential.",
  },
  {
    title: "Impact",
    icon: <EmojiObjectsIcon sx={{ fontSize: 40, color: "#FF9900" }} />,
    description:
      "We strive to create meaningful change in people's lives through education and inspiration.",
  },
];

const teamMembers = [
  {
    name: "Last Kwechete",
    role: "Founder & CEO | Software Engineer",
    image: "https://source.unsplash.com/random/200x200?portrait1",
    description:
      "Innovative software engineer and visionary leader, passionate about transforming education and personal development through cutting-edge technology solutions.",
  },
  {
    name: "Sarah Chen",
    role: "Head of Content",
    image: "https://source.unsplash.com/random/200x200?portrait2",
    description:
      "Content strategist focused on creating engaging and impactful learning experiences.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Tech Lead",
    image: "https://source.unsplash.com/random/200x200?portrait3",
    description:
      "Technology expert dedicated to building innovative solutions for modern learning.",
  },
];

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      {/* Hero Section */}
      <Box className="bg-gradient-to-r from-questdea-navy to-questdea-orange text-white py-12 md:py-20">
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h3" : "h2"}
            className="font-poppins font-bold mb-6 text-center"
            sx={{
              fontSize: isMobile ? "1.75rem" : isTablet ? "2.25rem" : "3rem",
            }}
          >
            About QuestDea
          </Typography>
          <Typography
            variant="h6"
            className="text-center mb-8"
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              opacity: 0.9,
              fontSize: isMobile ? "1rem" : "1.1rem",
            }}
          >
            Empowering minds through innovative learning experiences and
            inspiring content
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" className="py-12">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              className="font-poppins font-bold mb-4"
              sx={{
                fontSize: isMobile ? "1.5rem" : "2rem",
                background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Mission
            </Typography>
            <Typography variant="body1" className="mb-4" color="text.secondary">
              At QuestDea, we're on a mission to revolutionize personal and
              professional growth through innovative learning experiences. We
              believe that everyone deserves access to high-quality education
              and inspiring content that can transform their lives.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Through our platform, we combine cutting-edge technology with
              expert knowledge to create engaging learning experiences that
              inspire growth, foster creativity, and build lasting skills.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "300px",
                background:
                  "linear-gradient(45deg, rgba(26,26,46,0.1) 0%, rgba(255,153,0,0.1) 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Placeholder for mission image */}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box className="bg-gray-50 py-12">
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h4" : "h3"}
            className="text-center font-poppins font-bold mb-8"
            sx={{
              fontSize: isMobile ? "1.5rem" : "2rem",
              background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
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
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent className="text-center p-6">
                    <Box className="mb-4">{value.icon}</Box>
                    <Typography
                      variant="h6"
                      className="mb-2"
                      sx={{ color: "#1A1A2E" }}
                    >
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
      <Container maxWidth="lg" className="py-12">
        <Typography
          variant={isMobile ? "h4" : "h3"}
          className="text-center font-poppins font-bold mb-8"
          sx={{
            fontSize: isMobile ? "1.5rem" : "2rem",
            background: "linear-gradient(45deg, #1A1A2E 30%, #FF9900 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Card
                className="h-full transition-all duration-300 hover:translate-y-[-8px]"
                sx={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent>
                  <Box className="flex flex-col items-center text-center">
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        border: "4px solid #FF9900",
                      }}
                    />
                    <Typography
                      variant="h6"
                      className="mb-1"
                      sx={{ color: "#1A1A2E" }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      className="mb-3"
                      sx={{ color: "#FF9900" }}
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;

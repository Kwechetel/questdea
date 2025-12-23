import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import shopImage from "../assets/shop.png";

// Sample data for different resource types
const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description:
      "Master the basics of web development with HTML, CSS, and JavaScript.",
    image: shopImage,
    duration: "8 weeks",
    instructor: "David Miller",
    rating: 4.8,
    students: 1200,
    level: "Beginner",
    tags: ["Web Development", "Frontend", "Coding"],
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    description:
      "Learn comprehensive digital marketing strategies and techniques.",
    image: shopImage,
    duration: "6 weeks",
    instructor: "Sarah Chen",
    rating: 4.9,
    students: 850,
    level: "Intermediate",
    tags: ["Marketing", "Digital", "Strategy"],
  },
  {
    id: 3,
    title: "Personal Development & Leadership",
    description:
      "Develop essential leadership skills and personal growth strategies.",
    image: shopImage,
    duration: "4 weeks",
    instructor: "Michael Brooks",
    rating: 4.7,
    students: 950,
    level: "All Levels",
    tags: ["Leadership", "Personal Growth", "Management"],
  },
];

const articles = [
  {
    id: 1,
    title: "The Future of AI in Education",
    description:
      "Exploring how artificial intelligence is transforming the learning landscape.",
    image: shopImage,
    author: "Dr. Emily Watson",
    readTime: "8 min",
    date: "2024-03-15",
    tags: ["AI", "Education", "Technology"],
  },
  {
    id: 2,
    title: "Building Effective Learning Habits",
    description:
      "Practical strategies for developing strong learning habits that stick.",
    image: shopImage,
    author: "James Wilson",
    readTime: "6 min",
    date: "2024-03-14",
    tags: ["Learning", "Productivity", "Self-Development"],
  },
  {
    id: 3,
    title: "The Power of Community Learning",
    description:
      "How collaborative learning environments enhance knowledge retention.",
    image: shopImage,
    author: "Lisa Chen",
    readTime: "10 min",
    date: "2024-03-13",
    tags: ["Community", "Education", "Collaboration"],
  },
];

const videos = [
  {
    id: 1,
    title: "Getting Started with React",
    description:
      "A comprehensive guide to building modern web applications with React.",
    thumbnail: shopImage,
    duration: "15:30",
    instructor: "Alex Johnson",
    views: "25K",
    date: "2024-03-15",
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    id: 2,
    title: "Effective Public Speaking",
    description: "Master the art of public speaking and presentation skills.",
    thumbnail: shopImage,
    duration: "12:45",
    instructor: "Emma Thompson",
    views: "18K",
    date: "2024-03-14",
    tags: ["Communication", "Leadership", "Skills"],
  },
  {
    id: 3,
    title: "Data Science Essentials",
    description: "Introduction to key concepts in data science and analytics.",
    thumbnail: shopImage,
    duration: "20:15",
    instructor: "Dr. Robert Chen",
    views: "22K",
    date: "2024-03-13",
    tags: ["Data Science", "Analytics", "Technology"],
  },
];

const podcasts = [
  {
    id: 1,
    title: "Innovation in Tech Education",
    description: "Discussion about the latest trends in technology education.",
    image: shopImage,
    host: "Tech Talks Team",
    duration: "45:00",
    episode: "EP 125",
    date: "2024-03-15",
    tags: ["Technology", "Education", "Innovation"],
  },
  {
    id: 2,
    title: "Career Growth Strategies",
    description: "Expert insights on advancing your professional career.",
    image: shopImage,
    host: "Career Success Show",
    duration: "35:00",
    episode: "EP 89",
    date: "2024-03-14",
    tags: ["Career", "Professional Growth", "Success"],
  },
  {
    id: 3,
    title: "Mindfulness in Learning",
    description:
      "Exploring the connection between mindfulness and effective learning.",
    image: shopImage,
    host: "Mind & Learn",
    duration: "40:00",
    episode: "EP 156",
    date: "2024-03-13",
    tags: ["Mindfulness", "Learning", "Personal Development"],
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const KnowledgeHub = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box className="bg-gradient-to-r from-lastte-navy to-lastte-orange text-white py-12 md:py-20">
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h3" : "h2"}
            className="font-poppins font-bold mb-6 text-center"
            sx={{
              fontSize: isMobile ? "1.75rem" : isTablet ? "2.25rem" : "3rem",
            }}
          >
            Knowledge Hub
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
            Discover a world of learning resources to fuel your growth journey
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: "600px",
              margin: "0 auto",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "4px",
              backdropFilter: "blur(10px)",
            }}
          >
            <InputBase
              placeholder="Search resources..."
              sx={{
                flex: 1,
                color: "white",
                px: 2,
                py: 1,
                "& input::placeholder": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
            <IconButton sx={{ color: "white" }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <FilterListIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 4,
            "& .MuiTab-root": {
              fontSize: isMobile ? "0.9rem" : "1rem",
              minWidth: isMobile ? "auto" : 160,
            },
          }}
        >
          <Tab icon={<MenuBookIcon />} label="Courses" iconPosition="start" />
          <Tab icon={<ArticleIcon />} label="Articles" iconPosition="start" />
          <Tab
            icon={<VideoLibraryIcon />}
            label="Videos"
            iconPosition="start"
          />
          <Tab icon={<PodcastsIcon />} label="Podcasts" iconPosition="start" />
        </Tabs>

        {/* Courses Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item xs={12} md={4} key={course.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography variant="h6" className="mb-2">
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-3"
                    >
                      {course.description}
                    </Typography>
                    <Box className="flex items-center gap-3 mb-3">
                      <Box className="flex items-center">
                        <AccessTimeIcon
                          sx={{
                            fontSize: "1rem",
                            color: "text.secondary",
                            mr: 0.5,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {course.duration}
                        </Typography>
                      </Box>
                      <Box className="flex items-center">
                        <PersonIcon
                          sx={{
                            fontSize: "1rem",
                            color: "text.secondary",
                            mr: 0.5,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {course.students} students
                        </Typography>
                      </Box>
                      <Box className="flex items-center">
                        <StarIcon
                          sx={{ fontSize: "1rem", color: "#FF9900", mr: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {course.rating}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="flex flex-wrap gap-1 mb-3">
                      {course.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            color: "text.primary",
                          }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "#FF9900",
                        "&:hover": { bgcolor: "#e68a00" },
                      }}
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Articles Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {articles.map((article) => (
              <Grid item xs={12} md={4} key={article.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.image}
                    alt={article.title}
                  />
                  <CardContent>
                    <Typography variant="h6" className="mb-2">
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-3"
                    >
                      {article.description}
                    </Typography>
                    <Box className="flex items-center justify-between mb-3">
                      <Box className="flex items-center">
                        <PersonIcon
                          sx={{
                            fontSize: "1rem",
                            color: "text.secondary",
                            mr: 0.5,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {article.author}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {article.readTime} read
                      </Typography>
                    </Box>
                    <Box className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            color: "text.primary",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Videos Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            {videos.map((video) => (
              <Grid item xs={12} md={4} key={video.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={video.thumbnail}
                      alt={video.title}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {video.duration}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" className="mb-2">
                      {video.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-3"
                    >
                      {video.description}
                    </Typography>
                    <Box className="flex items-center justify-between mb-3">
                      <Box className="flex items-center">
                        <PersonIcon
                          sx={{
                            fontSize: "1rem",
                            color: "text.secondary",
                            mr: 0.5,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {video.instructor}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {video.views} views
                      </Typography>
                    </Box>
                    <Box className="flex flex-wrap gap-1">
                      {video.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            color: "text.primary",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Podcasts Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={4}>
            {podcasts.map((podcast) => (
              <Grid item xs={12} md={4} key={podcast.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardMedia
                    component="img"
                    height="200"
                    image={podcast.image}
                    alt={podcast.title}
                  />
                  <CardContent>
                    <Typography
                      variant="caption"
                      color="primary"
                      className="mb-1 block"
                    >
                      {podcast.episode}
                    </Typography>
                    <Typography variant="h6" className="mb-2">
                      {podcast.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-3"
                    >
                      {podcast.description}
                    </Typography>
                    <Box className="flex items-center justify-between mb-3">
                      <Box className="flex items-center">
                        <PersonIcon
                          sx={{
                            fontSize: "1rem",
                            color: "text.secondary",
                            mr: 0.5,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {podcast.host}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {podcast.duration}
                      </Typography>
                    </Box>
                    <Box className="flex flex-wrap gap-1">
                      {podcast.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.08)",
                            color: "text.primary",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default KnowledgeHub;

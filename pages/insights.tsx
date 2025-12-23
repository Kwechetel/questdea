"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  InputBase,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import CodeIcon from "@mui/icons-material/Code";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArticleIcon from "@mui/icons-material/Article";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Insight {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  readTime: string;
  author: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function InsightsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/insights?published=true");
      if (!res.ok) throw new Error("Failed to fetch insights");
      const data = await res.json();
      setInsights(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load insights");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from insights
  const categoriesMap = insights.reduce((acc, insight) => {
    acc[insight.category] = (acc[insight.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    { name: "All", icon: ArticleIcon, count: insights.length },
    ...Object.entries(categoriesMap).map(([name, count]) => ({
      name,
      icon:
        name === "Architecture"
          ? ArchitectureIcon
          : name === "Engineering"
          ? CodeIcon
          : name === "Strategy"
          ? TrendingUpIcon
          : name === "Case Study"
          ? BusinessIcon
          : ArticleIcon,
      count,
    })),
  ];

  const filteredInsights = insights.filter((insight) => {
    const matchesCategory =
      selectedCategory === "All" || insight.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (insight.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredInsights = filteredInsights.filter((i) => i.featured);
  const regularInsights = filteredInsights.filter((i) => !i.featured);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Architecture: "#2563eb",
      Engineering: "#22c55e",
      Strategy: "#a21caf",
      "Case Study": "#f59e42",
      Security: "#ef4444",
      DevOps: "#06b6d4",
    };
    return colors[category] || "#FF9900";
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #050816 0%, #1A1A2E 50%, #0F1419 100%)",
          color: "white",
          pt: { xs: "80px", sm: "120px" },
          pb: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
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
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant={isMobile ? "h3" : "h2"}
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Insights
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: "700px",
                margin: "0 auto",
                opacity: 0.9,
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Technical insights, case studies, and thought leadership on
              building systems that last
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: "600px",
              margin: "0 auto",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 3,
              padding: "4px 8px",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <InputBase
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                color: "white",
                px: 2,
                py: 1.5,
                fontSize: "1rem",
                "& input::placeholder": {
                  color: "rgba(255, 255, 255, 0.6)",
                },
              }}
            />
            <IconButton sx={{ color: "white" }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-start" },
            mb: 4,
          }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <Button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                startIcon={<Icon />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  backgroundColor: isSelected
                    ? "#FF9900"
                    : "rgba(255, 153, 0, 0.1)",
                  color: isSelected ? "#1A1A2E" : "#1A1A2E",
                  border: isSelected
                    ? "none"
                    : "1px solid rgba(255, 153, 0, 0.2)",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? "#e68a00"
                      : "rgba(255, 153, 0, 0.15)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {category.name} ({category.count})
              </Button>
            );
          })}
        </Box>

        {/* Featured Insights */}
        {featuredInsights.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "#1A1A2E",
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              Featured Insights
            </Typography>
            <Grid container spacing={4}>
              {featuredInsights.map((insight) => (
                <Grid item xs={12} md={6} key={insight.id}>
                  <Card
                    onClick={() => router.push(`/insights/${insight.slug}`)}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        background: `linear-gradient(135deg, ${getCategoryColor(
                          insight.category
                        )} 0%, ${getCategoryColor(insight.category)}dd 100%)`,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                        }}
                      >
                        <Chip
                          label={insight.category}
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                            fontWeight: 600,
                            backdropFilter: "blur(8px)",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: "white",
                          fontWeight: 700,
                          fontSize: { xs: "2rem", md: "3rem" },
                          opacity: 0.1,
                          position: "absolute",
                        }}
                      >
                        {insight.category.charAt(0)}
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          color: "#1A1A2E",
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                          lineHeight: 1.3,
                        }}
                      >
                        {insight.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          mb: 2,
                          lineHeight: 1.6,
                          fontSize: "0.95rem",
                        }}
                      >
                        {insight.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: "1rem", color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {insight.readTime}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(insight.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        {(insight.tags || []).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255, 153, 0, 0.1)",
                              color: "#1A1A2E",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                        ))}
                      </Box>
                      <Button
                        component={Link}
                        href={`/insights/${insight.slug}`}
                        endIcon={<ArrowForwardIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        sx={{
                          color: "#FF9900",
                          fontWeight: 600,
                          textTransform: "none",
                          textDecoration: "none",
                          "&:hover": {
                            color: "#e68a00",
                            bgcolor: "rgba(255, 153, 0, 0.05)",
                            textDecoration: "none",
                          },
                        }}
                      >
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All Insights */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#1A1A2E",
              fontSize: { xs: "1.5rem", md: "1.75rem" },
            }}
          >
            {selectedCategory === "All" ? "All Insights" : selectedCategory}
          </Typography>
          <Grid container spacing={3}>
            {regularInsights.map((insight) => (
              <Grid item xs={12} sm={6} md={4} key={insight.id}>
                <Card
                  onClick={() => router.push(`/insights/${insight.slug}`)}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    border: "1px solid rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      background: `linear-gradient(135deg, ${getCategoryColor(
                        insight.category
                      )} 0%, ${getCategoryColor(insight.category)}dd 100%)`,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                      }}
                    >
                      <Chip
                        label={insight.category}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          color: "white",
                          fontWeight: 600,
                          backdropFilter: "blur(8px)",
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "#1A1A2E",
                        fontSize: "1.1rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {insight.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        lineHeight: 1.5,
                        fontSize: "0.875rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {insight.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {insight.readTime}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(insight.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 1.5,
                      }}
                    >
                      {(insight.tags || []).slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.1)",
                            color: "#1A1A2E",
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            height: "20px",
                          }}
                        />
                      ))}
                    </Box>
                    <Button
                      component={Link}
                      href={`/insights/${insight.slug}`}
                      size="small"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        color: "#FF9900",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "0.875rem",
                        p: 0,
                        textDecoration: "none",
                        "&:hover": {
                          color: "#e68a00",
                          bgcolor: "transparent",
                          textDecoration: "none",
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "error.main",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Error loading insights
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Box>
          ) : filteredInsights.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No insights found
              </Typography>
              <Typography variant="body2">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
}

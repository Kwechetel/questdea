"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

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
  body: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function InsightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const slug = params?.slug as string;
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      fetchInsight();
    }
  }, [slug]);

  const fetchInsight = async () => {
    try {
      const response = await fetch(`/api/insights/by-slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Insight not found");
        }
        throw new Error("Failed to fetch insight");
      }
      const data = await response.json();
      setInsight(data);
    } catch (err: any) {
      setError(err.message || "Failed to load insight. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !insight) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px", pb: 10 }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || "Insight not found"}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            href="/insights"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
              color: "#1A1A2E",
              fontWeight: 700,
            }}
          >
            Back to Insights
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px", pb: 10 }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          href="/insights"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Back to Insights
        </Button>

        {/* Category Header */}
        <Box
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${getCategoryColor(
              insight.category
            )} 0%, ${getCategoryColor(insight.category)}dd 100%)`,
            p: 4,
            color: "white",
          }}
        >
          <Chip
            label={insight.category}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              mb: 2,
              backdropFilter: "blur(8px)",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            {insight.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 3, lineHeight: 1.6 }}
          >
            {insight.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon sx={{ fontSize: "1rem" }} />
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                {insight.readTime}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              By {insight.author}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              {new Date(insight.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, mb: 4 }}>
          {/* Tags */}
          {insight.tags && insight.tags.length > 0 && (
            <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {insight.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{
                    bgcolor: "rgba(255, 153, 0, 0.1)",
                    color: "#1A1A2E",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Article Body */}
          {insight.body ? (
            <Box
              sx={{
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  fontWeight: 700,
                  color: "#1A1A2E",
                  mt: 4,
                  mb: 2,
                },
                "& h1": { fontSize: "2rem" },
                "& h2": { fontSize: "1.75rem" },
                "& h3": { fontSize: "1.5rem" },
                "& p": {
                  mb: 2,
                  lineHeight: 1.8,
                  color: "text.primary",
                  fontSize: "1.1rem",
                },
                "& ul, & ol": {
                  mb: 2,
                  pl: 3,
                },
                "& li": {
                  mb: 1,
                  lineHeight: 1.8,
                },
                "& code": {
                  bgcolor: "#f5f5f5",
                  padding: "2px 6px",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.9em",
                },
                "& pre": {
                  bgcolor: "#1A1A2E",
                  color: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  overflow: "auto",
                  mb: 2,
                  "& code": {
                    bgcolor: "transparent",
                    color: "inherit",
                    padding: 0,
                  },
                },
                "& blockquote": {
                  borderLeft: "4px solid #FF9900",
                  pl: 2,
                  ml: 0,
                  fontStyle: "italic",
                  color: "text.secondary",
                  mb: 2,
                },
                "& a": {
                  color: "#FF9900",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 2,
                  my: 2,
                },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {insight.body}
              </ReactMarkdown>
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
                lineHeight: 1.8,
                fontSize: "1.1rem",
              }}
            >
              Full article content coming soon...
            </Typography>
          )}
        </Paper>

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            component={Link}
            href="/insights"
            sx={{
              background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
              color: "#1A1A2E",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
              },
            }}
          >
            View All Insights
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

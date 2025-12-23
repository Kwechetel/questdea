"use client";

import React, { useState, useEffect, useTransition } from "react";
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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  stack: string;
  coverImageUrl: string | null;
  body: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CaseStudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Only enable client-side effects after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && slug) {
      fetchCaseStudy();
    }
  }, [slug, isMounted]);

  const fetchCaseStudy = async () => {
    try {
      const response = await fetch(`/api/case-studies/by-slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Case study not found");
        }
        throw new Error("Failed to fetch case study");
      }
      const data = await response.json();
      startTransition(() => {
        setCaseStudy(data);
        setLoading(false);
      });
    } catch (err: any) {
      startTransition(() => {
        setError(err.message || "Failed to load case study. Please try again.");
        setLoading(false);
      });
      console.error(err);
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

  if (error || !caseStudy) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px", pb: 10 }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || "Case study not found"}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            href="/work"
            variant="contained"
          >
            Back to Work
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
          href="/work"
          sx={{ mb: 4 }}
        >
          Back to Work
        </Button>

        {caseStudy.coverImageUrl && (
          <Box
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <img
              src={caseStudy.coverImageUrl}
              alt={caseStudy.title}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1A1A2E",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            {caseStudy.title}
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}
          >
            {caseStudy.summary}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Chip
              label={caseStudy.stack}
              sx={{
                bgcolor: "#FF9900",
                color: "#1A1A2E",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "4px 8px",
              }}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

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
              {caseStudy.body}
            </ReactMarkdown>
          </Box>
        </Paper>

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            component={Link}
            href="/work"
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
            View All Case Studies
          </Button>
        </Box>
      </Container>
    </Box>
  );
}


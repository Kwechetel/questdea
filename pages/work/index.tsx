"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  stack: string;
  coverImageUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function WorkPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await fetch("/api/case-studies?published=true");
      if (!response.ok) {
        throw new Error("Failed to fetch case studies");
      }
      const data = await response.json();
      setCaseStudies(data);
    } catch (err) {
      setError("Failed to load case studies. Please try again.");
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px", pb: 10 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1A1A2E",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Our Work
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto" }}
          >
            Explore our portfolio of successful projects and case studies
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {caseStudies.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No case studies available yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for our latest work!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {caseStudies.map((caseStudy) => (
              <Grid item xs={12} md={6} lg={4} key={caseStudy.id}>
                <Card
                  component={Link}
                  href={`/work/${caseStudy.slug}`}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {caseStudy.coverImageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={caseStudy.coverImageUrl}
                      alt={caseStudy.title}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1A1A2E",
                        mb: 1,
                        fontSize: { xs: "1.25rem", md: "1.5rem" },
                      }}
                    >
                      {caseStudy.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, flexGrow: 1 }}
                    >
                      {caseStudy.summary}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={caseStudy.stack}
                        size="small"
                        sx={{
                          bgcolor: "#FF9900",
                          color: "#1A1A2E",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#FF9900",
                        fontWeight: 600,
                        mt: "auto",
                      }}
                    >
                      Read More
                      <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}


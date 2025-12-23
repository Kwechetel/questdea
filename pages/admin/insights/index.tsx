"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Switch,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
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
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInsightsPage() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setCheckingSession(true);
      return;
    }

    if (status === "unauthenticated") {
      window.location.href = "/admin-access";
      return;
    }

    const isAdmin = String(session?.user?.role) === "ADMIN";
    if (status === "authenticated" && !isAdmin) {
      window.location.href = "/admin-access";
      return;
    }

    setCheckingSession(false);
  }, [status, session]);

  useEffect(() => {
    if (checkingSession || status === "loading") return;

    fetchInsights();
  }, [checkingSession, status]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/insights", {
        credentials: "include", // Include cookies for session
      });
      if (!res.ok) throw new Error("Failed to fetch insights");
      const data = await res.json();
      setInsights(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      setError(""); // Clear previous errors
      const res = await fetch(`/api/insights/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for session
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update published status"
        );
      }

      const result = await res.json();
      // Update local state immediately for better UX
      setInsights((prev) =>
        prev.map((insight) =>
          insight.id === id
            ? { ...insight, published: !currentStatus }
            : insight
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update insight");
      // Revert on error by refetching
      await fetchInsights();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this insight?")) return;

    try {
      const res = await fetch(`/api/insights/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
      await fetchInsights();
      setAnchorEl(null);
      setSelectedInsight(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete insight");
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    insightId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedInsight(insightId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInsight(null);
  };

  if (checkingSession || status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const isAdmin = String(session?.user?.role) === "ADMIN";
  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Access denied. Admin role required.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
              <Button
                component={Link}
                href="/admin"
                variant="text"
                sx={{ minWidth: "auto", p: 0, color: "text.secondary" }}
              >
                Dashboard
              </Button>
              <Typography sx={{ color: "text.secondary" }}>/</Typography>
              <Typography sx={{ color: "text.primary", fontWeight: 600 }}>
                Insights
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1A1A2E",
                mb: 1,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              Insights Management
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Manage your insights and articles ({insights.length} total)
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/admin/insights/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
              color: "#1A1A2E",
              fontWeight: 700,
              "&:hover": {
                background: "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
              },
            }}
          >
            New Insight
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Featured</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Published</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {insights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <ArticleIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        No insights yet
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Create your first insight to get started
                      </Typography>
                      <Button
                        component={Link}
                        href="/admin/insights/new"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                          background:
                            "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                          color: "#1A1A2E",
                          fontWeight: 700,
                        }}
                      >
                        Create Insight
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  insights.map((insight) => (
                    <TableRow key={insight.id} hover>
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: "#1A1A2E" }}
                        >
                          {insight.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {insight.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={insight.category}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 153, 0, 0.1)",
                            color: "#1A1A2E",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={insight.featured ? "Yes" : "No"}
                          size="small"
                          sx={{
                            bgcolor: insight.featured
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(0, 0, 0, 0.05)",
                            color: insight.featured
                              ? "#22c55e"
                              : "text.secondary",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={insight.published}
                          onChange={() =>
                            handleTogglePublished(insight.id, insight.published)
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(insight.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            size="small"
                            component={Link}
                            href={`/insights/${insight.slug}`}
                            target="_blank"
                            title="View public page"
                          >
                            {insight.published ? (
                              <VisibilityIcon fontSize="small" />
                            ) : (
                              <VisibilityOffIcon fontSize="small" />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            component={Link}
                            href={`/admin/insights/${insight.id}`}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, insight.id)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={
                              Boolean(anchorEl) &&
                              selectedInsight === insight.id
                            }
                            onClose={handleMenuClose}
                          >
                            <MenuItem
                              component={Link}
                              href={`/admin/insights/${insight.id}`}
                              onClick={handleMenuClose}
                            >
                              <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleDelete(insight.id);
                                handleMenuClose();
                              }}
                              sx={{ color: "error.main" }}
                            >
                              <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                              Delete
                            </MenuItem>
                          </Menu>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}

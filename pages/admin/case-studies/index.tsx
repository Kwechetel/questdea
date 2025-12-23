"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

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

export default function AdminCaseStudiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseStudyToDelete, setCaseStudyToDelete] = useState<string | null>(
    null
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      window.location.href = "/admin-access";
      return;
    }

    // Check role - JWT stores it as string
    const isAdmin = String(session?.user?.role) === "ADMIN";
    if (status === "authenticated" && isAdmin) {
      fetchCaseStudies();
    } else if (status === "authenticated" && !isAdmin) {
      window.location.href = "/admin-access";
    }
  }, [status, session, router]);

  const fetchCaseStudies = async () => {
    try {
      const response = await fetch("/api/case-studies", {
        credentials: "include", // Include cookies for session
      });
      if (!response.ok) {
        throw new Error("Failed to fetch case studies");
      }
      const data = await response.json();
      setCaseStudies(data);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to load case studies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (
    id: string,
    currentPublished: boolean
  ) => {
    try {
      const response = await fetch(`/api/case-studies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session
        body: JSON.stringify({ published: !currentPublished }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update published status"
        );
      }

      // Update local state immediately for better UX
      setCaseStudies((prev) =>
        prev.map((cs) =>
          cs.id === id ? { ...cs, published: !currentPublished } : cs
        )
      );

      setSnackbar({
        open: true,
        message: `Case study ${
          !currentPublished ? "published" : "unpublished"
        }`,
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update published status",
        severity: "error",
      });
      console.error(err);
      // Revert on error by refetching
      await fetchCaseStudies();
    }
  };

  const handleDeleteClick = (id: string) => {
    setCaseStudyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!caseStudyToDelete) return;

    try {
      const response = await fetch(`/api/case-studies/${caseStudyToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete case study");
      }

      setCaseStudies((prev) =>
        prev.filter((cs) => cs.id !== caseStudyToDelete)
      );

      setSnackbar({
        open: true,
        message: "Case study deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setCaseStudyToDelete(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete case study",
        severity: "error",
      });
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
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

  // Check role - JWT stores it as string
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
                Case Studies
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
              Case Studies
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Manage your portfolio case studies ({caseStudies.length} total)
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/admin/case-studies/new"
            sx={{
              background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
              color: "#1A1A2E",
              fontWeight: 700,
              "&:hover": {
                background: "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
              },
            }}
          >
            New Case Study
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stack</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {caseStudies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No case studies found. Create your first one!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                caseStudies.map((caseStudy) => (
                  <TableRow key={caseStudy.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {caseStudy.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {caseStudy.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {caseStudy.stack}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          label={caseStudy.published ? "Published" : "Draft"}
                          color={caseStudy.published ? "success" : "default"}
                          size="small"
                        />
                        <Switch
                          checked={caseStudy.published}
                          onChange={() =>
                            handleTogglePublished(
                              caseStudy.id,
                              caseStudy.published
                            )
                          }
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(caseStudy.createdAt)}</TableCell>
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
                          href={`/work/${caseStudy.slug}`}
                          target="_blank"
                          title="View public page"
                        >
                          {caseStudy.published ? (
                            <VisibilityIcon fontSize="small" />
                          ) : (
                            <VisibilityOffIcon fontSize="small" />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/admin/case-studies/${caseStudy.id}`}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(caseStudy.id)}
                          color="error"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Case Study</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this case study? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

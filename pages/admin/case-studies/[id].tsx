"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from "@mui/icons-material";

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

export default function EditCaseStudyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    stack: "",
    coverImageUrl: "",
    body: "",
    published: false,
  });

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
      if (!isNew) {
        fetchCaseStudy();
      }
    } else if (status === "authenticated" && !isAdmin) {
      window.location.href = "/admin-access";
    }
  }, [status, session, router, id, isNew]);

  const fetchCaseStudy = async () => {
    try {
      const response = await fetch(`/api/case-studies/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch case study");
      }
      const data: CaseStudy = await response.json();
      setFormData({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        stack: data.stack,
        coverImageUrl: data.coverImageUrl || "",
        body: data.body,
        published: data.published,
      });
    } catch (err) {
      setError("Failed to load case study. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-generate slug if slug is empty or matches previous title
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isNew ? "/api/case-studies" : `/api/case-studies/${id}`;
      const method = isNew ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          coverImageUrl: formData.coverImageUrl || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save case study");
      }

      const result = await response.json();
      const savedCaseStudy = result.caseStudy || result;

      setSnackbar({
        open: true,
        message: `Case study ${isNew ? "created" : "updated"} successfully`,
        severity: "success",
      });

      // Redirect to edit page if it was new
      if (isNew) {
        setTimeout(() => {
          router.push(`/admin/case-studies/${savedCaseStudy.id}`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save case study");
      setSnackbar({
        open: true,
        message: err.message || "Failed to save case study",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
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
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            href="/admin/case-studies"
            sx={{ mb: 2 }}
          >
            Back to Case Studies
          </Button>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1A1A2E",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {isNew ? "Create New Case Study" : "Edit Case Study"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              helperText="URL-friendly identifier (e.g., 'my-awesome-project')"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              multiline
              rows={3}
              helperText="Brief description (max 500 characters)"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Tech Stack"
              name="stack"
              value={formData.stack}
              onChange={handleChange}
              required
              helperText="Technologies used (e.g., 'React, Node.js, PostgreSQL')"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Cover Image URL"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              helperText="URL to cover image"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Body (Markdown)"
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              multiline
              rows={15}
              helperText="Full case study content in Markdown format"
              sx={{ mb: 3 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, published: e.target.checked }))
                  }
                />
              }
              label="Published"
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                component={Link}
                href="/admin/case-studies"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
                sx={{
                  background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                  color: "#1A1A2E",
                  fontWeight: 700,
                  "&:hover": {
                    background: "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                  },
                }}
              >
                {saving ? "Saving..." : isNew ? "Create" : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

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


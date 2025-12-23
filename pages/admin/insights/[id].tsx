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
  Chip,
  InputAdornment,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from "@mui/icons-material";

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

export default function EditInsightPage() {
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
  const [checkingSession, setCheckingSession] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    readTime: "",
    author: "LASTTE Team",
    tags: [] as string[],
    featured: false,
    body: "",
    published: true,
  });

  const [tagInput, setTagInput] = useState("");

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

    if (!isNew) {
      fetchInsight();
    } else {
      setLoading(false);
    }
  }, [checkingSession, status, id, isNew]);

  const fetchInsight = async () => {
    try {
      const response = await fetch(`/api/insights/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch insight");
      }
      const data: Insight = await response.json();
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description,
        category: data.category,
        readTime: data.readTime,
        author: data.author,
        tags: data.tags || [],
        featured: data.featured,
        body: data.body || "",
        published: data.published,
      });
    } catch (err) {
      setError("Failed to load insight. Please try again.");
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
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isNew ? "/api/insights" : `/api/insights/${id}`;
      const method = isNew ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          body: formData.body || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save insight");
      }

      const result = await response.json();
      setSnackbar({
        open: true,
        message: isNew
          ? "Insight created successfully!"
          : "Insight updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        router.push("/admin/insights");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save insight");
    } finally {
      setSaving(false);
    }
  };

  if (checkingSession || status === "loading" || loading) {
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px", pb: 10 }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            href="/admin/insights"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2, color: "text.secondary" }}
          >
            Back to Insights
          </Button>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1A1A2E",
              mb: 1,
            }}
          >
            {isNew ? "Create New Insight" : "Edit Insight"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                fullWidth
              />

              <TextField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                fullWidth
                helperText="URL-friendly identifier (auto-generated from title)"
              />

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={4}
                helperText="Brief description shown in the insights list"
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  fullWidth
                  helperText="e.g., Architecture, Engineering, Strategy"
                />

                <TextField
                  label="Read Time"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  required
                  fullWidth
                  helperText="e.g., '12 min'"
                />
              </Box>

              <TextField
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                fullWidth
              />

              <Box>
                <TextField
                  label="Tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  fullWidth
                  helperText="Press Enter to add a tag"
                  InputProps={{
                    endAdornment: formData.tags.length > 0 && (
                      <InputAdornment position="end">
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          {formData.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              onDelete={() => handleRemoveTag(tag)}
                              sx={{ bgcolor: "rgba(255, 153, 0, 0.1)" }}
                            />
                          ))}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                label="Body (Full Article Content)"
                name="body"
                value={formData.body}
                onChange={handleChange}
                fullWidth
                multiline
                rows={12}
                helperText="Full article content (markdown supported)"
              />

              <Box sx={{ display: "flex", gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Featured"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          published: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Published"
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href="/admin/insights"
                  variant="outlined"
                  sx={{
                    borderColor: "#FF9900",
                    color: "#FF9900",
                    "&:hover": {
                      borderColor: "#FFD580",
                      color: "#FFD580",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving}
                  sx={{
                    background:
                      "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                    color: "#1A1A2E",
                    fontWeight: 700,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                    },
                  }}
                >
                  {saving ? "Saving..." : isNew ? "Create" : "Save"}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}


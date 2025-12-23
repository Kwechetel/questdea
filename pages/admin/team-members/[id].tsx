"use client";

import React, { useState, useEffect, useTransition } from "react";
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
  Snackbar,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string | null;
  description: string;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditTeamMemberPage() {
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
    name: "",
    role: "",
    image: "",
    description: "",
    facebookUrl: "",
    linkedinUrl: "",
    order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (status === "loading") {
      startTransition(() => {
        setCheckingSession(true);
      });
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

    startTransition(() => {
      setCheckingSession(false);
    });
  }, [status, session, isMounted]);

  useEffect(() => {
    if (!isMounted || checkingSession || status === "loading") return;

    if (!isNew) {
      fetchTeamMember();
    } else {
      startTransition(() => {
        setLoading(false);
      });
    }
  }, [checkingSession, status, id, isNew, isMounted]);

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch team member");
      }
      const data: TeamMember = await response.json();
      startTransition(() => {
        setFormData({
          name: data.name,
          role: data.role,
          image: data.image || "",
          description: data.description,
          facebookUrl: data.facebookUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          order: data.order,
        });
        setImagePreview(data.image || null);
      });
    } catch (err) {
      startTransition(() => {
        setError("Failed to load team member. Please try again.");
      });
      console.error(err);
    } finally {
      startTransition(() => {
        setLoading(false);
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      startTransition(() => {
        setError("Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.");
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      startTransition(() => {
        setError("File size exceeds 5MB limit");
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      startTransition(() => {
        setImagePreview(reader.result as string);
      });
    };
    reader.readAsDataURL(file);

    // Upload file
    startTransition(() => {
      setUploading(true);
      setError("");
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/team-member-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();
      startTransition(() => {
        setFormData((prev) => ({ ...prev, image: data.url }));
        setSnackbar({
          open: true,
          message: "Image uploaded successfully!",
          severity: "success",
        });
      });
    } catch (err: any) {
      startTransition(() => {
        setError(err.message || "Failed to upload image");
        setImagePreview(null);
      });
    } finally {
      startTransition(() => {
        setUploading(false);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      setSaving(true);
      setError("");
    });

    try {
      const url = isNew
        ? "/api/team-members"
        : `/api/team-members/${id}`;
      const method = isNew ? "POST" : "PATCH";

      const payload = {
        name: formData.name,
        role: formData.role,
        image: formData.image || null,
        description: formData.description,
        facebookUrl: formData.facebookUrl || null,
        linkedinUrl: formData.linkedinUrl || null,
        order: formData.order,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save team member");
      }

      startTransition(() => {
        setSnackbar({
          open: true,
          message: isNew
            ? "Team member created successfully"
            : "Team member updated successfully",
          severity: "success",
        });
      });

      setTimeout(() => {
        router.push("/admin/team-members");
      }, 1500);
    } catch (err: any) {
      startTransition(() => {
        setError(err.message || "Failed to save team member");
        setSaving(false);
      });
    }
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

  if (loading) {
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px" }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
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
            <Button
              component={Link}
              href="/admin/team-members"
              variant="text"
              sx={{ minWidth: "auto", p: 0, color: "text.secondary" }}
            >
              Team Members
            </Button>
            <Typography sx={{ color: "text.secondary" }}>/</Typography>
            <Typography sx={{ color: "text.primary", fontWeight: 600 }}>
              {isNew ? "New" : "Edit"}
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1A1A2E",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {isNew ? "Add New Team Member" : "Edit Team Member"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="e.g., Junior Dev and System Support Technician"
              sx={{ mb: 3 }}
            />

            {/* Image Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                Profile Picture
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={imagePreview || formData.image || undefined}
                  alt="Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    border: "2px solid rgba(255, 153, 0, 0.3)",
                  }}
                >
                  <ImageIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="image-upload"
                    type="file"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={
                        uploading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CloudUploadIcon />
                        )
                      }
                      disabled={uploading}
                      sx={{
                        borderColor: "#FF9900",
                        color: "#FF9900",
                        "&:hover": {
                          borderColor: "#FFD580",
                          backgroundColor: "rgba(255, 153, 0, 0.1)",
                        },
                      }}
                    >
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </label>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 1, color: "text.secondary" }}
                  >
                    Max 5MB. Formats: JPEG, PNG, WebP, GIF
                  </Typography>
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Or enter image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                helperText="Alternatively, paste a direct image URL"
                size="small"
              />
            </Box>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={6}
              helperText="Brief description of the team member"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Facebook URL"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/username"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              helperText="Display order (lower numbers appear first)"
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                component={Link}
                href="/admin/team-members"
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
          </form>
        </Paper>
      </Container>

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


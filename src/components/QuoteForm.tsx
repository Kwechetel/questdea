"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  business: string;
  budget: string;
  message: string;
  website: string; // Honeypot field
}

export default function QuoteForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<QuoteFormData>({
    name: "",
    email: "",
    phone: "",
    business: "",
    budget: "",
    message: "",
    website: "", // Honeypot
  });
  const [errors, setErrors] = useState<Partial<QuoteFormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    if (success) {
      setSubmitDisabled(true);
      const timer = setTimeout(() => {
        setSubmitDisabled(false);
        setSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          business: "",
          budget: "",
          message: "",
          website: "",
        });
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof QuoteFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<QuoteFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check honeypot field (should be empty)
    if (formData.website) {
      // Silent fail for bots
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business || null,
          budget: formData.budget || null,
          message: formData.message || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form");
      }

      setSuccess(true);
    } catch (error: any) {
      setErrors({
        email: error.message || "Failed to submit. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)",
        py: { xs: 6, md: 10 },
        position: "relative",
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "#1A1A2E",
            fontSize: { xs: "1.75rem", md: "2.25rem" },
          }}
        >
          Request a Quote
        </Typography>
        <Typography
          align="center"
          sx={{ color: "text.secondary", mb: 4, fontSize: "1.1rem" }}
        >
          Tell us about your project and we'll get back to you with a tailored
          proposal
        </Typography>

        {success && (
          <Alert
            icon={<CheckCircleIcon />}
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            Thank you! Your request has been submitted. We'll get back to you
            soon.
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: "#ffffff",
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={submitDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                disabled={submitDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone *"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                disabled={submitDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                name="business"
                value={formData.business}
                onChange={handleChange}
                disabled={submitDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Range"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., $5,000 - $10,000"
                disabled={submitDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Details"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Tell us about your project, goals, and requirements..."
                disabled={submitDisabled}
              />
            </Grid>
            {/* Honeypot field - hidden from users */}
            <Grid item xs={12} sx={{ display: "none" }}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || submitDisabled}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  background:
                    "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                  color: "#1A1A2E",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                  },
                  "&:disabled": {
                    opacity: 0.6,
                  },
                }}
              >
                {loading
                  ? "Submitting..."
                  : submitDisabled
                  ? "Submitted!"
                  : "Submit Request"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}


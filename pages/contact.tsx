"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Wrapper component to prevent hydration issues
const MotionWrapper = ({
  children,
  isMounted,
  ...props
}: {
  children: React.ReactNode;
  isMounted: boolean;
  [key: string]: any;
}) => {
  if (!isMounted) {
    return <div>{children}</div>;
  }
  return <motion.div {...props}>{children}</motion.div>;
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Only enable animations after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    startTransition(() => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof ContactFormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
          phone: formData.phone || null,
          business: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      setErrors({
        email: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <EmailIcon />,
      label: "Email",
      value: "hello@lastte.com",
      href: "mailto:hello@lastte.com",
      color: "#FF9900",
    },
    {
      icon: <PhoneIcon />,
      label: "Phone",
      value: "0662123241",
      href: "tel:0662123241",
      color: "#22c55e",
    },
  ];

  const socialLinks = [
    {
      icon: <LinkedInIcon />,
      href: "https://linkedin.com/company/lastte",
      label: "LinkedIn",
    },
    {
      icon: <FacebookIcon />,
      href: "https://facebook.com/lastte",
      label: "Facebook",
    },
    {
      icon: <GitHubIcon />,
      href: "https://github.com/lastte",
      label: "GitHub",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
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
            "radial-gradient(circle at 10% 20%, rgba(255,153,0,0.03) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(26,26,46,0.03) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: "80px", sm: "100px", md: "120px" },
          pb: { xs: 4, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            {isMounted ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                    background:
                      "linear-gradient(135deg, #1A1A2E 0%, #FF9900 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Let's Build Something
                  <br />
                  <Box component="span" sx={{ color: "#FF9900" }}>
                    Extraordinary
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    maxWidth: "600px",
                    margin: "0 auto",
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  Ready to transform your ideas into reality? We're here to help
                  you create digital experiences that make an impact.
                </Typography>
              </motion.div>
            ) : (
              <>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                    background:
                      "linear-gradient(135deg, #1A1A2E 0%, #FF9900 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Let's Build Something
                  <br />
                  <Box component="span" sx={{ color: "#FF9900" }}>
                    Extraordinary
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    maxWidth: "600px",
                    margin: "0 auto",
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  Ready to transform your ideas into reality? We're here to help
                  you create digital experiences that make an impact.
                </Typography>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pb: 10 }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Side - Contact Info */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: "120px" },
                height: { md: "fit-content" },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "#1A1A2E",
                  fontSize: { xs: "1.75rem", md: "2rem" },
                }}
              >
                Get in Touch
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  lineHeight: 1.8,
                  fontSize: "1rem",
                }}
              >
                Whether you have a project in mind or just want to explore
                possibilities, we'd love to hear from you. Drop us a line and
                let's start a conversation.
              </Typography>

              {/* Contact Methods */}
              <Box sx={{ mb: 4 }}>
                {contactMethods.map((method, index) => (
                  <MotionWrapper
                    key={method.label}
                    isMounted={isMounted}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Box
                      component="a"
                      href={method.href}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2.5,
                        mb: 2,
                        borderRadius: 2,
                        textDecoration: "none",
                        color: "inherit",
                        transition: "all 0.3s ease",
                        bgcolor: "rgba(255, 255, 255, 0.6)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        "&:hover": {
                          bgcolor: "white",
                          transform: "translateX(8px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          borderColor: method.color,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          bgcolor: `${method.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: method.color,
                          flexShrink: 0,
                        }}
                      >
                        {method.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          {method.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1A1A2E",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                          }}
                        >
                          {method.value}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon
                        sx={{
                          color: "text.secondary",
                          fontSize: "1.25rem",
                          opacity: 0.5,
                        }}
                      />
                    </Box>
                  </MotionWrapper>
                ))}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Social Links */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Connect With Us
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  {socialLinks.map((social, index) => (
                    <MotionWrapper
                      key={social.label}
                      isMounted={isMounted}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "rgba(255, 153, 0, 0.08)",
                          color: "#FF9900",
                          border: "1px solid rgba(255, 153, 0, 0.2)",
                          "&:hover": {
                            bgcolor: "#FF9900",
                            color: "white",
                            borderColor: "#FF9900",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(255, 153, 0, 0.3)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </MotionWrapper>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Contact Form */}
          <Grid item xs={12} md={7}>
            <MotionWrapper
              isMounted={isMounted}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  bgcolor: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #FF9900 0%, #FFD580 50%, #FF9900 100%)",
                  },
                }}
              >
                {success && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      bgcolor: "rgba(34, 197, 94, 0.1)",
                      color: "#16a34a",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    Message sent successfully! We'll get back to you within 24
                    hours.
                  </Alert>
                )}

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#1A1A2E",
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                  }}
                >
                  Send us a Message
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 4,
                  }}
                >
                  Fill out the form below and we'll respond as soon as possible.
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor:
                              focusedField === "name"
                                ? "rgba(255, 153, 0, 0.02)"
                                : "transparent",
                            transition: "all 0.3s ease",
                            "&:hover fieldset": {
                              borderColor: "#FF9900",
                            },
                            "&.Mui-focused": {
                              bgcolor: "rgba(255, 153, 0, 0.05)",
                              "& fieldset": {
                                borderColor: "#FF9900",
                                borderWidth: "2px",
                              },
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FF9900",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor:
                              focusedField === "email"
                                ? "rgba(255, 153, 0, 0.02)"
                                : "transparent",
                            transition: "all 0.3s ease",
                            "&:hover fieldset": {
                              borderColor: "#FF9900",
                            },
                            "&.Mui-focused": {
                              bgcolor: "rgba(255, 153, 0, 0.05)",
                              "& fieldset": {
                                borderColor: "#FF9900",
                                borderWidth: "2px",
                              },
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FF9900",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor:
                              focusedField === "phone"
                                ? "rgba(255, 153, 0, 0.02)"
                                : "transparent",
                            transition: "all 0.3s ease",
                            "&:hover fieldset": {
                              borderColor: "#FF9900",
                            },
                            "&.Mui-focused": {
                              bgcolor: "rgba(255, 153, 0, 0.05)",
                              "& fieldset": {
                                borderColor: "#FF9900",
                                borderWidth: "2px",
                              },
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FF9900",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("subject")}
                        onBlur={() => setFocusedField(null)}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor:
                              focusedField === "subject"
                                ? "rgba(255, 153, 0, 0.02)"
                                : "transparent",
                            transition: "all 0.3s ease",
                            "&:hover fieldset": {
                              borderColor: "#FF9900",
                            },
                            "&.Mui-focused": {
                              bgcolor: "rgba(255, 153, 0, 0.05)",
                              "& fieldset": {
                                borderColor: "#FF9900",
                                borderWidth: "2px",
                              },
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FF9900",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        error={!!errors.message}
                        helperText={errors.message}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor:
                              focusedField === "message"
                                ? "rgba(255, 153, 0, 0.02)"
                                : "transparent",
                            transition: "all 0.3s ease",
                            "&:hover fieldset": {
                              borderColor: "#FF9900",
                            },
                            "&.Mui-focused": {
                              bgcolor: "rgba(255, 153, 0, 0.05)",
                              "& fieldset": {
                                borderColor: "#FF9900",
                                borderWidth: "2px",
                              },
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FF9900",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MotionWrapper
                        isMounted={isMounted}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          endIcon={
                            loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <SendIcon />
                            )
                          }
                          fullWidth
                          sx={{
                            py: 1.75,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                            color: "#1A1A2E",
                            fontWeight: 700,
                            fontSize: "1rem",
                            textTransform: "none",
                            boxShadow: "0 4px 16px rgba(255, 153, 0, 0.3)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #e68a00 0%, #FF9900 100%)",
                              boxShadow: "0 6px 24px rgba(255, 153, 0, 0.4)",
                            },
                            "&:disabled": {
                              opacity: 0.7,
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          {loading ? "Sending Message..." : "Send Message"}
                        </Button>
                      </MotionWrapper>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </MotionWrapper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  Folder as FolderIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pt: "80px", pb: 10 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <DashboardIcon
            sx={{
              fontSize: 64,
              color: "#FF9900",
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1A1A2E",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto" }}
          >
            Manage your leads and case studies
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Leads Management Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 32, color: "#1A1A2E" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1A1A2E",
                        mb: 0.5,
                      }}
                    >
                      Leads Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and manage all incoming leads
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Manage quote requests, update lead status, and track
                  conversions. Filter by status, view details, and delete leads.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  href="/admin/leads"
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                    color: "#1A1A2E",
                    fontWeight: 700,
                    py: 1.5,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                    },
                  }}
                >
                  Manage Leads
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Case Studies Management Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <FolderIcon sx={{ fontSize: 32, color: "#1A1A2E" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1A1A2E",
                        mb: 0.5,
                      }}
                    >
                      Case Studies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your portfolio case studies
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Create, edit, and publish case studies for your portfolio.
                  Control visibility and manage all your work in one place.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  href="/admin/case-studies"
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                    color: "#1A1A2E",
                    fontWeight: 700,
                    py: 1.5,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                    },
                  }}
                >
                  Manage Case Studies
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Insights Management Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: 32, color: "#1A1A2E" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1A1A2E",
                        mb: 0.5,
                      }}
                    >
                      Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your blog articles and insights
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Create, edit, and publish insights articles. Share technical
                  knowledge, case studies, and thought leadership content.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  href="/admin/insights"
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                    color: "#1A1A2E",
                    fontWeight: 700,
                    py: 1.5,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                    },
                  }}
                >
                  Manage Insights
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Team Members Management Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 32, color: "#1A1A2E" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1A1A2E",
                        mb: 0.5,
                      }}
                    >
                      Team Members
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your team members
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Add, edit, and manage team members displayed on the about page.
                  Control their information, photos, and social links.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  href="/admin/team-members"
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                    color: "#1A1A2E",
                    fontWeight: 700,
                    py: 1.5,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #FFD580 0%, #FF9900 100%)",
                    },
                  }}
                >
                  Manage Team
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* WhatsApp Chat Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 32, color: "#fff" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1A1A2E",
                        mb: 0.5,
                      }}
                    >
                      WhatsApp Chat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chat with your clients
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Receive and respond to client messages via WhatsApp. View
                  conversation history and manage multiple chats in one place.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  href="/admin/whatsapp-chat"
                  variant="contained"
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    py: 1.5,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
                    },
                  }}
                >
                  Open Chat
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            sx={{
              borderColor: "#FF9900",
              color: "#FF9900",
              fontWeight: 600,
              px: 4,
              "&:hover": {
                borderColor: "#FFD580",
                color: "#FFD580",
                backgroundColor: "rgba(255,153,0,0.05)",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

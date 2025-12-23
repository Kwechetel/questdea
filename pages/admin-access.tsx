"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function AdminAccessPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Get callbackUrl from query params
  const getCallbackUrl = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get("callbackUrl");
      return callbackUrl ? decodeURIComponent(callbackUrl) : "/admin";
    }
    return "/admin";
  };

  // Check for Configuration error in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam === "Configuration") {
      setError(
        "Server configuration error: NEXTAUTH_SECRET is missing. Please contact the administrator."
      );
    }
  }, []);

  // Redirect if already logged in (only once, after session is loaded)
  useEffect(() => {
    if (status === "loading") {
      setCheckingSession(true);
      return;
    }

    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      setCheckingSession(false);
      // Use callbackUrl if available, otherwise default to /admin
      const callbackUrl = getCallbackUrl();
      window.location.href = callbackUrl;
      return;
    }

    setCheckingSession(false);
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Check if it's a rate limit error
        if (result.error.includes("Too many") || result.error.includes("locked")) {
          setError(result.error);
        } else {
          setError("Invalid email or password");
        }
        setLoading(false);
      } else if (result?.ok) {
        // Use callbackUrl if available, otherwise default to /admin
        const callbackUrl = getCallbackUrl();
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (checkingSession || status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #050816 0%, #1A1A2E 50%, #0F1419 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#FF9900" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #050816 0%, #1A1A2E 50%, #0F1419 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: "80px", sm: 0 },
        pb: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: 3,
            p: { xs: 4, md: 6 },
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 32, color: "#1A1A2E" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1A1A2E",
                mb: 1,
                fontSize: { xs: "1.75rem", md: "2rem" },
              }}
            >
              Admin Access
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Secure administrative login
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #FF9900 0%, #FFD580 100%)",
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
}


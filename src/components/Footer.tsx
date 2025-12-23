"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  SvgIcon,
  SvgIconProps,
  Grid,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import logo from "../assets/logo.png";
import Link from "next/link";

// Custom X (Twitter) icon component
const XIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only use session data after mount to prevent hydration mismatches
  const isAuthenticated = isMounted && !!session;

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #050816 0%, #1A1A2E 100%)",
        color: "#fff",
        py: { xs: 6, md: 8 },
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <img
                src={
                  typeof logo === "string"
                    ? logo
                    : (logo as any)?.src || String(logo)
                }
                alt="LASTTE Logo"
                style={{
                  height: isMobile ? 36 : 44,
                  marginRight: 12,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: isMobile ? 18 : 20,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                LASTTE
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: isMobile ? "0.875rem" : "0.95rem",
                lineHeight: 1.6,
                mb: 3,
                maxWidth: "500px",
              }}
            >
              Helping you design, build, and scale digital products and
              platforms with clarity, reliability, and purpose.
            </Typography>
            {/* Social Links */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                component="a"
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  "&:hover": {
                    color: "#FFD580",
                    borderColor: "#FFD580",
                    backgroundColor: "rgba(255,213,128,0.1)",
                  },
                  transition: "all 0.3s ease",
                }}
                size="small"
              >
                <XIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  "&:hover": {
                    color: "#FFD580",
                    borderColor: "#FFD580",
                    backgroundColor: "rgba(255,213,128,0.1)",
                  },
                  transition: "all 0.3s ease",
                }}
                size="small"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Links Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#FFD580",
                fontWeight: 700,
                fontSize: isMobile ? "0.95rem" : "1rem",
                mb: 2,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: isMobile ? "0.875rem" : "0.9rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFD580";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                Home
              </Link>
              <Link
                href="/work"
                style={{
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: isMobile ? "0.875rem" : "0.9rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFD580";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                Portfolio
              </Link>
              <Link
                href="/insights"
                style={{
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: isMobile ? "0.875rem" : "0.9rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFD580";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                Insights
              </Link>
              <Link
                href="/about"
                style={{
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: isMobile ? "0.875rem" : "0.9rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFD580";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                About
              </Link>
              <Link
                href="/contact"
                style={{
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: isMobile ? "0.875rem" : "0.9rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFD580";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                Contact
              </Link>
              {!isAuthenticated && (
                <Button
                  component={Link}
                  href="/admin-access"
                  variant="text"
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    textTransform: "none",
                    padding: "4px 8px",
                    minWidth: "auto",
                    opacity: 0.6,
                    "&:hover": {
                      color: "rgba(255,255,255,0.7)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      opacity: 0.8,
                    },
                  }}
                >
                  Admin
                </Button>
              )}
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#FFD580",
                fontWeight: 700,
                fontSize: isMobile ? "0.95rem" : "1rem",
                mb: 2,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: isMobile ? "0.875rem" : "0.9rem",
                }}
              >
                <Box
                  component="a"
                  href="mailto:info@lastte.com"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#FFD580",
                    },
                    transition: "color 0.3s ease",
                  }}
                >
                  hello@lastte.com
                </Box>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            mt: { xs: 5, md: 6 },
            pt: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            }}
          >
            © {currentYear} LASTTE. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            }}
          >
            Built with clarity, reliability, and purpose.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

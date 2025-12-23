"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSession, signOut } from "next-auth/react";
// Knowledge Hub link added
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logo.png";
import Link from "next/link";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session } = useSession();
  
  // Only use session data after mount to prevent hydration mismatches
  const isAdmin = isMounted && session?.user?.role === "ADMIN";
  const isAuthenticated = isMounted && !!session;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleDrawerToggle = () => {
    if (!isMounted) return;
    startTransition(() => {
      setMobileOpen(!mobileOpen);
    });
  };

  const handleDrawerClose = () => {
    if (!isMounted) return;
    startTransition(() => {
      setMobileOpen(false);
    });
  };

  // Only render session-dependent content after mount
  const drawer = (
    <Box
      sx={{
        width: 260,
        bgcolor: "#050816",
        height: "100%",
        color: "#fff",
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Link
          href="/"
          onClick={handleDrawerClose}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src={
              typeof logo === "string"
                ? logo
                : (logo as any)?.src || String(logo)
            }
            alt="LASTTE Logo"
            style={{ height: 42, marginRight: 8 }}
          />
          <Typography
            variant="h6"
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.08em",
            }}
          >
            LASTTE
          </Typography>
        </Link>
      </Box>
      {isMounted && (
      <List>
        {!isAuthenticated && (
          <>
            <ListItem sx={{ justifyContent: "center", mb: 1 }}>
              <Button
                fullWidth
                component={Link}
                href="/work"
                onClick={handleDrawerClose}
                sx={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: "10px 0",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,213,128,0.12)",
                  },
                  mb: 1,
                }}
              >
                Portfolio
              </Button>
            </ListItem>
            <ListItem sx={{ justifyContent: "center", mb: 1 }}>
              <Button
                fullWidth
                component={Link}
                href="/insights"
                onClick={handleDrawerClose}
                sx={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: "10px 0",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,213,128,0.12)",
                  },
                  mb: 1,
                }}
              >
                Insights
              </Button>
            </ListItem>
            <ListItem sx={{ justifyContent: "center", mb: 1 }}>
              <Button
                fullWidth
                component={Link}
                href="/about"
                onClick={handleDrawerClose}
                sx={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: "10px 0",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,213,128,0.12)",
                  },
                  mb: 2,
                }}
              >
                About
              </Button>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                component={Link}
                href="/contact"
                onClick={handleDrawerClose}
                variant="outlined"
                sx={{
                  borderRadius: 999,
                  borderColor: "#FFD580",
                  color: "#FFD580",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: "10px 0",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#FF9900",
                    color: "#FF9900",
                  },
                  mb: isAdmin ? 1 : 0,
                }}
              >
                Contact
              </Button>
            </ListItem>
          </>
        )}
        {isAdmin && (
          <ListItem>
            <Button
              fullWidth
              component={Link}
              href="/admin"
              onClick={handleDrawerClose}
              startIcon={<DashboardIcon />}
              sx={{
                borderRadius: 999,
                backgroundColor: "#FF9900",
                color: "#1A1A2E",
                fontWeight: 700,
                fontSize: 16,
                padding: "10px 0",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e68a00",
                },
                mb: isAuthenticated ? 1 : 0,
              }}
            >
              Admin
            </Button>
          </ListItem>
        )}
        {isAuthenticated && (
          <ListItem>
            <Button
              fullWidth
              onClick={() => {
                handleDrawerClose();
                handleLogout();
              }}
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "10px 0",
                textTransform: "none",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              Logout
            </Button>
          </ListItem>
        )}
      </List>
      )}
    </Box>
  );

  return (
    <AppBar
      position={isMobile ? "static" : "fixed"}
      style={{
        backgroundColor: "rgba(5, 8, 22, 0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
        height: "64px",
        padding: 0,
        margin: 0,
        zIndex: 1000,
      }}
    >
      <Toolbar
        style={{
          justifyContent: "space-between",
          minHeight: "64px",
          padding: "0 16px",
          margin: 0,
        }}
      >
        <Box display="flex" alignItems="center">
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src={
                typeof logo === "string"
                  ? logo
                  : (logo as any)?.src || String(logo)
              }
              alt="LASTTE Logo"
              style={{
                height: isMobile ? 40 : 44,
                marginRight: 10,
              }}
            />
            <Typography
              variant="h6"
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: isMobile ? 16 : 18,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              LASTTE
            </Typography>
          </Link>
        </Box>
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ color: "#fff" }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          isMounted ? (
          <Box display="flex" gap={2} alignItems="center">
            {!isAuthenticated && (
              <>
                <Button
                  component={Link}
                  href="/work"
                  sx={{
                    backgroundColor: "transparent",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    padding: "8px 20px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,213,128,0.12)",
                    },
                  }}
                >
                  Portfolio
                </Button>
                <Button
                  component={Link}
                  href="/insights"
                  sx={{
                    backgroundColor: "transparent",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    padding: "8px 20px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,213,128,0.12)",
                    },
                  }}
                >
                  Insights
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  sx={{
                    backgroundColor: "transparent",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    padding: "8px 20px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,213,128,0.12)",
                    },
                  }}
                >
                  About
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    borderColor: "#FFD580",
                    color: "#FFD580",
                    fontWeight: 700,
                    fontSize: 16,
                    padding: "8px 20px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#FF9900",
                      color: "#FF9900",
                    },
                  }}
                >
                  Contact
                </Button>
              </>
            )}
            {isAdmin && (
              <Button
                component={Link}
                href="/admin"
                startIcon={<DashboardIcon />}
                sx={{
                  borderRadius: 999,
                  backgroundColor: "#FF9900",
                  color: "#1A1A2E",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: "8px 20px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#e68a00",
                  },
                }}
              >
                Admin
              </Button>
            )}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  borderRadius: 999,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: "8px 20px",
                  textTransform: "none",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
          ) : null
        )}
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

import React, { useState } from "react";
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../assets/logo.png";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: "#1A1A2E", height: "100%" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <RouterLink
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src={logo}
            alt="QuestDea Logo"
            style={{ height: 32, marginRight: 12 }}
          />
          <Typography
            variant="h6"
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            QuestDea
          </Typography>
        </RouterLink>
      </Box>
      <List>
        <ListItem sx={{ justifyContent: "center", mb: 1 }}>
          <Button
            fullWidth
            component={RouterLink}
            to="/knowledge-hub"
            sx={{
              backgroundColor: "transparent",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "10px 0",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              mb: 2,
            }}
          >
            Knowledge Hub
          </Button>
        </ListItem>
        <ListItem sx={{ justifyContent: "center", mb: 1 }}>
          <Button
            fullWidth
            component={RouterLink}
            to="/shop"
            variant="contained"
            startIcon={<ShoppingCartIcon sx={{ color: "#fff" }} />}
            sx={{
              background: "linear-gradient(45deg, #FF9900 30%, #F4911D 90%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "10px 0",
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #F4911D 30%, #FF9900 90%)",
              },
            }}
          >
            Shop
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #FF9900 30%, #F4911D 90%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "10px 0",
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #F4911D 30%, #FF9900 90%)",
              },
            }}
          >
            Signup
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position={isMobile ? "static" : "fixed"}
      style={{
        backgroundColor: "#1A1A2E",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
          <RouterLink
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="QuestDea Logo"
              style={{ height: isMobile ? 28 : 32, marginRight: 12 }}
            />
            <Typography
              variant="h6"
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: isMobile ? 20 : 22,
                textDecoration: "none",
              }}
            >
              QuestDea
            </Typography>
          </RouterLink>
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
          <Box display="flex" gap={2}>
            <Button
              component={RouterLink}
              to="/knowledge-hub"
              sx={{
                backgroundColor: "transparent",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "8px 20px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Knowledge Hub
            </Button>
            <Button
              component={RouterLink}
              to="/shop"
              variant="contained"
              startIcon={<ShoppingCartIcon sx={{ color: "#fff" }} />}
              sx={{
                background: "linear-gradient(45deg, #FF9900 30%, #F4911D 90%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "8px 20px",
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #F4911D 30%, #FF9900 90%)",
                },
              }}
            >
              Shop
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #FF9900 30%, #F4911D 90%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "8px 20px",
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #F4911D 30%, #FF9900 90%)",
                },
              }}
            >
              Signup
            </Button>
          </Box>
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

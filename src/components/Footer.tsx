import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  SvgIcon,
  SvgIconProps,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "../assets/logo.png";
import { Link as RouterLink } from "react-router-dom";

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

  return (
    <Box
      component="footer"
      className="bg-questdea-navy text-white py-6 md:py-8"
    >
      <Container maxWidth="lg">
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand Section */}
          <Box>
            <Typography
              variant="h6"
              className="font-poppins font-bold mb-3 md:mb-4"
              sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
            >
              QuestDea
            </Typography>
            <Typography
              variant="body2"
              className="mb-3 md:mb-4"
              sx={{ fontSize: isMobile ? "0.85rem" : "0.875rem" }}
            >
              Fueling the Journey of Minds, One Idea at a Time.
            </Typography>
            <Box className="flex space-x-2">
              <IconButton
                color="inherit"
                aria-label="Facebook"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                size={isMobile ? "small" : "medium"}
              >
                <FacebookIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="X (Twitter)"
                component="a"
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                size={isMobile ? "small" : "medium"}
              >
                <XIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="LinkedIn"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                size={isMobile ? "small" : "medium"}
              >
                <LinkedInIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Instagram"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                size={isMobile ? "small" : "medium"}
              >
                <InstagramIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="h6"
              className="font-poppins font-bold mb-3 md:mb-4"
              sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
            >
              Quick Links
            </Typography>
            <Box className="flex flex-col space-y-2">
              <RouterLink
                to="/"
                className="text-white hover:text-questdea-orange transition-colors"
                style={{
                  textDecoration: "none",
                  fontSize: isMobile ? "0.85rem" : "0.875rem",
                }}
              >
                Home
              </RouterLink>
              <RouterLink
                to="/knowledge-hub"
                className="text-white hover:text-questdea-orange transition-colors"
                style={{
                  textDecoration: "none",
                  fontSize: isMobile ? "0.85rem" : "0.875rem",
                }}
              >
                Knowledge Hub
              </RouterLink>
              <RouterLink
                to="/about"
                className="text-white hover:text-questdea-orange transition-colors"
                style={{
                  textDecoration: "none",
                  fontSize: isMobile ? "0.85rem" : "0.875rem",
                }}
              >
                About
              </RouterLink>
              <RouterLink
                to="/login"
                className="text-white hover:text-questdea-orange transition-colors"
                style={{
                  textDecoration: "none",
                  fontSize: isMobile ? "0.85rem" : "0.875rem",
                }}
              >
                Login
              </RouterLink>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography
              variant="h6"
              className="font-poppins font-bold mb-3 md:mb-4"
              sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body2"
              className="mb-2"
              sx={{ fontSize: isMobile ? "0.85rem" : "0.875rem" }}
            >
              Email: info@questdea.com
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: isMobile ? "0.85rem" : "0.875rem" }}
            >
              Address: 123 Innovation Street, Tech City, TC 12345
            </Typography>
          </Box>
        </Box>

        {/* Copyright */}
        <Box className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-left">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            flexDirection={isMobile ? "column" : "row"}
          >
            <img
              src={logo}
              alt="QuestDea Logo"
              style={{
                height: isMobile ? 24 : 32,
                marginRight: isMobile ? 0 : 12,
                marginBottom: isMobile ? 8 : 0,
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
            >
              © {currentYear} QuestDea. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

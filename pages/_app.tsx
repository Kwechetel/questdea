import React, { useState, useEffect, useTransition } from "react";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  ThemeProvider,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import "../src/index.css";
import Link from "next/link";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFA500", // LASTTE Orange
    },
    secondary: {
      main: "#1A1A2E", // LASTTE Navy
    },
    text: {
      primary: "#1A1A2E",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
  },
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <MediaQueryWrapper>
            <Component {...pageProps} />
          </MediaQueryWrapper>
          <ConditionalFooter />
        </div>
        <SpeedInsights />
      </ThemeProvider>
    </SessionProvider>
  );
}

// Conditionally render Footer - hide on admin pages
function ConditionalFooter() {
  const router = useRouter();
  const isAdminPage = router.pathname?.startsWith("/admin");
  
  if (isAdminPage) {
    return null;
  }
  
  return <Footer />;
}

// Wrapper component to handle media queries after mount to prevent hydration issues
function MediaQueryWrapper({ children }: { children: React.ReactNode }) {
  const muiTheme = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Always call hook, but use result conditionally
  const isMobileQuery = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isMobile = isMounted ? isMobileQuery : false;

  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  return (
    <main className="flex-grow" style={{ paddingTop: isMobile ? 0 : "64px" }}>
      {children}
    </main>
  );
}

export default MyApp;

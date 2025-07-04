// app/layout.tsx
"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./globals.css";
import Navbar from "./components/navbar";

// Create a custom theme with your color palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#592E83",
      light: "#9984D4",
      dark: "#230C33",
    },
    secondary: {
      main: "#CAA8F5",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F8F9FA",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

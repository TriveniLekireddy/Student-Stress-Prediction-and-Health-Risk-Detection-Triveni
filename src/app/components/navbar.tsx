// app/components/navbar.tsx
"use client";

import React from "react";
import { AppBar, Box, Toolbar, Button, Container } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Test", path: "/predict" },
    { name: "Train", path: "/train" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)", // Centers horizontally
        width: "fit-content", // Content-based width
        background: "rgba(89, 46, 131, 0.7)", // Violet with transparency
        backdropFilter: "blur(10px)", // Frosted glass effect
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", // Deeper shadow for float effect
        border: "1px solid rgba(202, 168, 245, 0.3)", // Violet border
        borderRadius: "16px", // Rounded corners
        zIndex: 1100, // Ensure it's above other content
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "0.5rem 2rem",
          }}
        >
          <Box sx={{ display: "flex", gap: 4 }}>
            {navItems.map((item) => (
              <Link
                href={item.path}
                key={item.name}
                passHref
                style={{ textDecoration: "none" }}
              >
                <Button
                  disableElevation
                  sx={{
                    color: "white",
                    fontWeight: pathname === item.path ? "bold" : "normal",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: pathname === item.path ? "100%" : "0",
                      height: "2px",
                      bottom: 0,
                      left: 0,
                      backgroundColor: "#CAA8F5", // Violet highlight
                      transition: "width 0.3s ease",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(202, 168, 245, 0.2)",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

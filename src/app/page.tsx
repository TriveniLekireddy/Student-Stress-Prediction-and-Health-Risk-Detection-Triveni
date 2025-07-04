"use client";

import { Box, Button, Container, Typography, Paper } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "85vh",
        width: "100%",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#230C33",
                marginBottom: 3,
                fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
              }}
            >
              Student Stress Prediction
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#592E83",
                marginBottom: 5,
                fontWeight: 400,
                maxWidth: "600px",
                mx: { xs: "auto", md: 0 },
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Discover your stress levels based on academic and health data with
              our advanced AI model. Take control of your well-being today.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Link href="/predict" passHref style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: "#9984D4",
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    padding: "14px 32px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "1.1rem",
                    "&:hover": {
                      backgroundColor: "#CAA8F5",
                      boxShadow: "0 4px 20px rgba(153, 132, 212, 0.3)",
                    },
                  }}
                >
                  Predict Now
                </Button>
              </Link>

              <Link
                href="/learn-more"
                passHref
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#9984D4",
                    borderColor: "#9984D4",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "1.1rem",
                    padding: "14px 32px",
                    "&:hover": {
                      borderColor: "#CAA8F5",
                      color: "#CAA8F5",
                      background: "rgba(153, 132, 212, 0.05)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Link>
            </Box>
          </Box>

          <Paper
            elevation={3}
            sx={{
              flex: { xs: 1, md: 1 },
              width: { xs: "100%", md: "50%" },
              height: { xs: "300px", sm: "400px", md: "500px" },
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(153, 132, 212, 0.1)",
              mt: { xs: 4, md: 0 },
              position: "relative",
            }}
          >
            <Image
              src="/student-stress.jpg"
              alt="Student Stress Analysis"
              fill
              style={{
                objectFit: "cover",
              }}
            />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

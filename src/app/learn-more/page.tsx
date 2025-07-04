"use client";

import { Box, Container, Typography, Divider, Paper, Button } from "@mui/material";
import Link from "next/link";

export default function LearnMore() {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(to right, #F8F9FA, #FFFFFF)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "#FFFFFF",
            borderRadius: 3,
            border: "1px solid rgba(153, 132, 212, 0.2)",
            boxShadow: "0px 4px 24px rgba(153, 132, 212, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#230C33", fontWeight: 700, mb: 2 }}
          >
            Learn More About Stress Prediction
          </Typography>

          <Divider sx={{ mb: 3, borderColor: "#9984D4" }} />

          <Typography variant="body1" sx={{ color: "#592E83", mb: 2 }}>
            Our AI-driven student stress prediction system is designed to help you
            understand how various factors like academic pressure, mental health,
            and your environment can affect your well-being.
          </Typography>

          <Typography variant="body1" sx={{ color: "#592E83", mb: 2 }}>
            Using a combination of machine learning models and carefully selected
            indicators, we aim to give you personalized insights into your stress
            levels and help guide you toward supportive actions.
          </Typography>

          <Typography variant="body1" sx={{ color: "#592E83", mb: 4 }}>
            All data is processed securely, and we respect your privacy. No
            personal data is stored or shared without consent.
          </Typography>

          <Link href="/predict" passHref>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#9984D4",
                color: "#FFFFFF",
                fontWeight: "bold",
                textTransform: "none",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#CAA8F5",
                },
              }}
            >
              Start Prediction
            </Button>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}

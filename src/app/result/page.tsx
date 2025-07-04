"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  Stack,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { FaRegLightbulb } from "react-icons/fa";

const predictionMap: Record<number, StressType> = {
  0: "acute",
  1: "episodic",
  2: "chronic",
};

type StressType = "acute" | "episodic" | "chronic";

interface StressTypeInfo {
  label: string;
  description: string;
  recommendations: string[];
  color: string;
}

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
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#230C33",
      secondary: "#592E83",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

const stressTypes: Record<StressType, StressTypeInfo> = {
  acute: {
    label: "Acute Stress",
    description: "Short-term stress from specific events or situations.",
    recommendations: [
      "Practice deep breathing exercises to calm your mind.",
      "Engage in light physical activity like a short walk.",
      "Break tasks into smaller, manageable steps.",
    ],
    color: "#22c55e",
  },
  episodic: {
    label: "Episodic Stress",
    description: "Frequent stress from recurring challenges or pressures.",
    recommendations: [
      "Establish a consistent daily routine to reduce chaos.",
      "Practice mindfulness or meditation for 10 minutes daily.",
      "Seek support from friends or a counselor to manage triggers.",
    ],
    color: "#f97316",
  },
  chronic: {
    label: "Chronic Stress",
    description: "Persistent stress from ongoing life circumstances.",
    recommendations: [
      "Consult a mental health professional for personalized strategies.",
      "Prioritize quality sleep with a regular bedtime routine.",
      "Incorporate stress-relief activities like yoga or journaling.",
    ],
    color: "#ef4444",
  },
};

export default function Result() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [stressType, setStressType] = useState<StressType>("episodic");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const stressLevel = searchParams.get("stress_level");
      const probability = searchParams.get("probability");

      if (!stressLevel) {
        throw new Error("Stress level not provided in query parameters");
      }

      const prediction = parseInt(stressLevel, 10);
      if (isNaN(prediction) || !(prediction in predictionMap)) {
        setFetchError(`Invalid stress level: ${stressLevel}`);
        setStressType("episodic");
        return;
      }

      const predictedType = predictionMap[prediction as 0 | 1 | 2];
      setStressType(predictedType);

      if (probability) {
        try {
          const parsedProbability = JSON.parse(decodeURIComponent(probability));
          console.log("Parsed Probability:", parsedProbability);
        } catch (error) {
          console.warn("Failed to parse probability:", error);
        }
      }
    } catch (error) {
      setFetchError(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
      setStressType("episodic");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const stressInfo = stressTypes[stressType];

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 12, textAlign: "center" }}>
          <CircularProgress color="primary" size={40} />
          <Typography variant="body1" sx={{ mt: 3 }}>
            Loading your stress analysis...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#230C33" }}>
            {stressInfo.label}
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            {stressInfo.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Recommendations
          </Typography>

          <Stack spacing={2}>
            {stressInfo.recommendations.map((rec, index) => (
              <Chip
                key={index}
                icon={<FaRegLightbulb />}
                label={rec}
                sx={{
                  backgroundColor: stressInfo.color,
                  color: "#fff",
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>

          {fetchError && (
            <Typography color="error" sx={{ mt: 3 }}>
              {fetchError}
            </Typography>
          )}

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              href="/predict"
              component={Link}
              variant="contained"
              sx={{
                backgroundColor: "#9984D4",
                color: "#fff",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                textTransform: "none",
              }}
            >
              Analyze Again
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}





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
  alpha,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { FaRegLightbulb } from "react-icons/fa";

interface StressTypeInfo {
  label: string;
  description: string;
  recommendations: string[];
  color: string;
}

export default function Result() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [stressType, setStressType] = useState<string>("episodic");
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  const stressTypes: Record<string, StressTypeInfo> = {
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

  useEffect(() => {
    const predictionMap: Record<number, string> = {
      0: "acute",
      1: "episodic",
      2: "chronic",
    };

    try {
      setLoading(true);

      const stressLevel = searchParams.get("stress_level");
      const probability = searchParams.get("probability");

      console.log("Query Parameters:", {
        stress_level: stressLevel,
        probability,
      });

      if (!stressLevel) {
        throw new Error("Stress level not provided in query parameters");
      }

      const prediction = parseInt(stressLevel);
      if (isNaN(prediction) || !(prediction in predictionMap)) {
        console.warn("Invalid prediction value:", stressLevel);
        setFetchError(`Invalid stress level: ${stressLevel}`);
        setStressType("episodic");
        return;
      }

      const predictedType = predictionMap[prediction];
      setStressType(predictedType);

      if (probability) {
        try {
          const parsedProbability = JSON.parse(decodeURIComponent(probability));
          console.log("Parsed Probability:", parsedProbability);
        } catch (err) {
          console.warn("Failed to parse probability:", err);
        }
      }
    } catch (error) {
      console.error("Error processing query parameters:", error);
      setFetchError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
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
        <Container
          maxWidth="md"
          sx={{
            py: 12,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 4, color: theme.palette.primary.dark }}
          >
            Your Stress Analysis Results
          </Typography>

          {fetchError && (
            <Box
              sx={{
                p: 2,
                mb: 4,
                bgcolor: alpha("#f87171", 0.1),
                borderRadius: 2,
                borderLeft: `4px solid #f87171`,
              }}
            >
              <Typography color="error.main" variant="body2">
                Debug info: {fetchError}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              mb: 6,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                background: alpha(theme.palette.primary.light, 0.05),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your Stress Type
              </Typography>
              <Chip
                label={stressInfo.label}
                sx={{
                  bgcolor: stressInfo.color,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 2,
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: "center", maxWidth: 300 }}
              >
                {stressInfo.description}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1.2,
                p: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                background: alpha(theme.palette.primary.light, 0.05),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FaRegLightbulb size={20} color={theme.palette.primary.main} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Personalized Recommendations
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {stressInfo.recommendations.map((rec, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                        mt: 1,
                        mr: 1.5,
                      }}
                    />
                    <Typography variant="body1">{rec}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              background: alpha(theme.palette.primary.light, 0.05),
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, color: theme.palette.primary.dark }}
            >
              Understanding Stress Types
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {Object.values(stressTypes).map((type) => (
                <Box
                  key={type.label}
                  sx={{ display: "flex", alignItems: "flex-start" }}
                >
                  <Chip
                    label={type.label}
                    sx={{
                      bgcolor: type.color,
                      color: "white",
                      mr: 2,
                      minWidth: 140,
                    }}
                  />
                  <Typography variant="body1">{type.description}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link href="/predict" passHref style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  bgcolor: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Analyze Again
              </Button>
            </Link>
            <Link href="/" passHref style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Home
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}








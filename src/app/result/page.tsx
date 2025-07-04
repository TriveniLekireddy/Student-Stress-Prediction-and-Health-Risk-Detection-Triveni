"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const predictionMap: Record<number, string> = {
  0: "acute",
  1: "episodic",
  2: "chronic",
};

const stressTypes = {
  acute: {
    label: "Acute Stress",
    description: "Short-term stress from specific events or situations.",
    recommendations: [
      "Practice deep breathing exercises.",
      "Go for a short walk.",
      "Break tasks into smaller steps.",
    ],
    color: "#22c55e",
  },
  episodic: {
    label: "Episodic Stress",
    description: "Frequent stress from recurring challenges.",
    recommendations: [
      "Create a consistent daily routine.",
      "Practice mindfulness for 10 minutes daily.",
      "Seek support from friends or counselors.",
    ],
    color: "#f97316",
  },
  chronic: {
    label: "Chronic Stress",
    description: "Persistent stress from ongoing circumstances.",
    recommendations: [
      "Consult a mental health professional.",
      "Get regular sleep.",
      "Try yoga or journaling.",
    ],
    color: "#ef4444",
  },
};

export default function Result() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [stressType, setStressType] = useState<string>("episodic");

  const theme = createTheme({
    palette: {
      primary: { main: "#592E83" },
      secondary: { main: "#CAA8F5" },
      background: { default: "#f8f9fa", paper: "#ffffff" },
      text: { primary: "#230C33", secondary: "#592E83" },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      h4: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
    },
  });

  useEffect(() => {
    setLoading(true);
    try {
      const stressLevel = searchParams.get("stress_level");

      if (!stressLevel) throw new Error("Missing stress_level");

      const prediction = parseInt(stressLevel);
      if (isNaN(prediction) || !(prediction in predictionMap)) {
        setStressType("episodic");
        return;
      }

      const predictedType = predictionMap[prediction];
      setStressType(predictedType);
    } catch (err) {
      setStressType("episodic");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const info = stressTypes[stressType];

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
      <Container maxWidth="md" sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          {info.label}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          {info.description}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recommendations:
        </Typography>
        {info.recommendations.map((tip, idx) => (
          <Typography key={idx} sx={{ mb: 1 }}>
            • {tip}
          </Typography>
        ))}
      </Container>
    </ThemeProvider>
  );
}




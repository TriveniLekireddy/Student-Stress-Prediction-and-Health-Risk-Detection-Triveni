"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";

// Moved outside to avoid missing dependency warnings
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
} as const;

type StressTypeKey = keyof typeof stressTypes;

export default function Result() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [stressType, setStressType] = useState<StressTypeKey>("episodic");

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
  });

  useEffect(() => {
    setLoading(true);
    try {
      const stressLevel = searchParams.get("stress_level");
      const prediction = stressLevel ? parseInt(stressLevel) : NaN;

      if (isNaN(prediction) || !(prediction in predictionMap)) {
        setStressType("episodic");
        return;
      }

      const predictedType = predictionMap[prediction] as StressTypeKey;
      setStressType(predictedType);

    } catch {
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
      <Container maxWidth="md" sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Your Stress Type:
        </Typography>
        <Typography variant="h5" sx={{ color: stressInfo.color }}>
          {stressInfo.label}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {stressInfo.description}
        </Typography>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Recommendations:
        </Typography>
        <ul>
          {stressInfo.recommendations.map((rec, i) => (
            <li key={i}>
              <Typography variant="body1">{rec}</Typography>
            </li>
          ))}
        </ul>
      </Container>
    </ThemeProvider>
  );
}



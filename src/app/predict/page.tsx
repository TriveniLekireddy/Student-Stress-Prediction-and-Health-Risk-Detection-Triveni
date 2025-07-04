"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Slider,
  CircularProgress,
  Container,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useRouter } from "next/navigation";

const featureGroups = {
  health: [
    {
      label: "Blood Pressure",
      name: "blood_pressure",
      type: "radio",
      options: [
        { value: 0, label: "Low" },
        { value: 1, label: "Normal" },
        { value: 2, label: "High" },
        { value: 3, label: "Very High" },
      ],
    },
    {
      label: "Headache Frequency",
      name: "headache",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "None",
      maxLabel: "Constant",
    },
  ],
};

export default function Predict() {
  const [formData, setFormData] = useState({
    anxiety_level: 5,
    self_esteem: 15,
    mental_health_history: 0,
    depression: 5,
    headache: 2,
    blood_pressure: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSliderChange = (name: string) => (_event: Event, newValue: number | number[]) => {
    setFormData({ ...formData, [name]: newValue as number });
  };

  const handleRadioChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [name]: parseInt(event.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/predict",
        formData
      );
      const { prediction, probability } = response.data;
      router.replace(`/result?stress_level=${prediction}&probability=${encodeURIComponent(JSON.stringify(probability))}`);
    } catch (err) {
      setError("Error predicting stress level. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {featureGroups.health.map((feature) => (
          <Box key={feature.name} sx={{ mb: 4 }}>
            <Typography>{feature.label}</Typography>
            {feature.type === "slider" && (
              <Slider
                value={formData[feature.name]}
                onChange={handleSliderChange(feature.name)}
                min={feature.min}
                max={feature.max}
                step={1}
                valueLabelDisplay="auto"
              />
            )}
            {feature.type === "radio" && (
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name={feature.name}
                  value={formData[feature.name].toString()}
                  onChange={handleRadioChange(feature.name)}
                >
                  {feature.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value.toString()}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Box>
        ))}

        {error && <Typography color="error">{error}</Typography>}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Analyze My Stress Level"}
        </Button>
      </form>
    </Container>
  );
}






"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Slider,
  CircularProgress,
  Paper,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";

// Tooltip descriptions for each feature
const featureDescriptions = {
  anxiety_level: "Degree of worry and nervousness you experience",
  self_esteem: "Your perception of self-worth and confidence",
  mental_health_history: "Whether you have a history of mental health issues",
  depression: "Feelings of sadness or hopelessness",
  headache: "Frequency and intensity of headaches experienced",
  blood_pressure: "Your blood pressure level affecting overall health",
  sleep_quality: "How well and restfully you sleep",
  breathing_problem: "Frequency of breathing difficulties",
  noise_level: "Level of distracting noise in your study environment",
  living_conditions: "Quality of your living environment",
  safety: "How safe and secure you feel in your environment",
  basic_needs: "Access to fundamental necessities (food, shelter, etc.)",
  academic_performance: "How well you're doing in your academic studies",
  study_load: "Intensity of your academic workload",
  teacher_student_relationship: "Quality of interactions with teachers",
  future_career_concerns: "Worries about your future job prospects",
  social_support: "Level of support received from friends/family",
  peer_pressure: "Influence from peers to behave in certain ways",
  extracurricular_activities: "Involvement in activities outside regular curriculum",
  bullying: "Experiences of being targeted or harassed",
};

// Grouped features for rendering
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
    {
      label: "Sleep Quality",
      name: "sleep_quality",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Poor",
      maxLabel: "Excellent",
    },
    {
      label: "Breathing Problems",
      name: "breathing_problem",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "None",
      maxLabel: "Severe",
    },
  ],
};

interface FormData {
  anxiety_level: number;
  self_esteem: number;
  mental_health_history: number;
  depression: number;
  headache: number;
  blood_pressure: number;
  sleep_quality: number;
  breathing_problem: number;
}

interface FeatureInput {
  label: string;
  name: keyof FormData;
  type: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  options?: { value: number; label: string }[];
}

export default function Predict() {
  const [formData, setFormData] = useState<FormData>({
    anxiety_level: 5,
    self_esteem: 15,
    mental_health_history: 0,
    depression: 5,
    headache: 2,
    blood_pressure: 1,
    sleep_quality: 3,
    breathing_problem: 2,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSliderChange = (name: keyof FormData) => (_event: Event, newValue: number | number[]) => {
    setFormData({ ...formData, [name]: newValue as number });
  };

  const handleRadioChange = (name: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch {
      setError("Error predicting stress level. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = ({
    label,
    name,
    type,
    min,
    max,
    minLabel,
    maxLabel,
    options,
  }: FeatureInput) => {
    return (
      <Box key={name} sx={{ mb: 4 }}>
        <Typography>{label}</Typography>
        {type === "slider" && (
          <Slider
            value={formData[name]}
            onChange={handleSliderChange(name)}
            min={min}
            max={max}
            step={1}
            valueLabelDisplay="auto"
          />
        )}
        {type === "radio" && options && (
          <FormControl component="fieldset">
            <RadioGroup
              row
              name={name}
              value={formData[name].toString()}
              onChange={handleRadioChange(name)}
            >
              {options.map((option) => (
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
    );
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {featureGroups.health.map((feature) => renderInput(feature))}

        {error && <Typography color="error">{error}</Typography>}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Analyze My Stress Level"}
        </Button>
      </form>
    </Container>
  );
}









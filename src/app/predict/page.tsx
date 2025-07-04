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
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SchoolIcon from "@mui/icons-material/School";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";
import { useRouter } from "next/navigation";

// Feature descriptions
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
  extracurricular_activities:
    "Involvement in activities outside regular curriculum",
  bullying: "Experiences of being targeted or harassed",
};

// Feature groups
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
  mental: [
    {
      label: "Anxiety Level",
      name: "anxiety_level",
      type: "slider",
      min: 0,
      max: 20,
      minLabel: "None",
      maxLabel: "Severe",
    },
    {
      label: "Self Esteem",
      name: "self_esteem",
      type: "slider",
      min: 0,
      max: 30,
      minLabel: "Low",
      maxLabel: "High",
    },
    {
      label: "Mental Health History",
      name: "mental_health_history",
      type: "radio",
      options: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
      ],
    },
    {
      label: "Depression Level",
      name: "depression",
      type: "slider",
      min: 0,
      max: 27,
      minLabel: "None",
      maxLabel: "Severe",
    },
  ],
  academic: [
    {
      label: "Academic Performance",
      name: "academic_performance",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Poor",
      maxLabel: "Excellent",
    },
    {
      label: "Study Load",
      name: "study_load",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Light",
      maxLabel: "Heavy",
    },
    {
      label: "Teacher-Student Relationship",
      name: "teacher_student_relationship",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Poor",
      maxLabel: "Excellent",
    },
    {
      label: "Future Career Concerns",
      name: "future_career_concerns",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "None",
      maxLabel: "High",
    },
    {
      label: "Extracurricular Activities",
      name: "extracurricular_activities",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "None",
      maxLabel: "Many",
    },
  ],
  environmental: [
    {
      label: "Social Support",
      name: "social_support",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "None",
      maxLabel: "Strong",
    },
    {
      label: "Peer Pressure",
      name: "peer_pressure",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "None",
      maxLabel: "High",
    },
    {
      label: "Living Conditions",
      name: "living_conditions",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Poor",
      maxLabel: "Excellent",
    },
    {
      label: "Safety",
      name: "safety",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Unsafe",
      maxLabel: "Very Safe",
    },
    {
      label: "Basic Needs Met",
      name: "basic_needs",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Not Met",
      maxLabel: "Fully Met",
    },
    {
      label: "Bullying Experience",
      name: "bullying",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "None",
      maxLabel: "Severe",
    },
    {
      label: "Noise Level",
      name: "noise_level",
      type: "slider",
      min: 0,
      max: 5,
      minLabel: "Quiet",
      maxLabel: "Very Loud",
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
    sleep_quality: 3,
    breathing_problem: 2,
    noise_level: 2,
    living_conditions: 3,
    safety: 3,
    basic_needs: 3,
    academic_performance: 3,
    study_load: 2,
    teacher_student_relationship: 3,
    future_career_concerns: 3,
    social_support: 3,
    peer_pressure: 2,
    extracurricular_activities: 2,
    bullying: 2,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSliderChange =
    (name: string) => (_event: Event, newValue: number | number[]) => {
      setFormData({ ...formData, [name]: newValue as number });
    };

  const handleRadioChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [name]: parseInt(event.target.value) });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting formData:", formData);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/predict",
        formData
      );

      const { prediction, probability } = response.data;

      router.replace(
        `/result?stress_level=${prediction}&probability=${encodeURIComponent(
          JSON.stringify(probability)
        )}`
      );
    } catch (err) {
      console.error("Prediction error:", err);
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
  }) => {
    if (type === "radio") {
      return (
        <Card
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "1px solid rgba(202, 168, 245, 0.3)",
            borderRadius: "8px",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: 500, color: "#592E83", flex: 1 }}>
                {label}
              </Typography>
              <Tooltip title={featureDescriptions[name]} placement="top">
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#9984D4", cursor: "pointer" }}
                />
              </Tooltip>
            </Box>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#592E83", fontSize: "0.75rem" }}
              >
                Select an option
              </FormLabel>
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
                    control={
                      <Radio
                        sx={{
                          color: "#9984D4",
                          "&.Mui-checked": { color: "#592E83" },
                        }}
                      />
                    }
                    label={option.label}
                    sx={{ color: "#592E83" }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          border: "1px solid rgba(202, 168, 245, 0.3)",
          borderRadius: "8px",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: 500, color: "#592E83", flex: 1 }}>
              {label}
            </Typography>
            <Tooltip title={featureDescriptions[name]} placement="top">
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: "#9984D4", cursor: "pointer" }}
              />
            </Tooltip>
          </Box>
          <Box sx={{ px: 1, mt: 2 }}>
            <Slider
              value={formData[name]}
              onChange={handleSliderChange(name)}
              min={min}
              max={max}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: "#9984D4",
                "& .MuiSlider-thumb": { backgroundColor: "#592E83" },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(153, 132, 212, 0.3)",
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                color: "#592E83",
                fontSize: "0.75rem",
              }}
            >
              <Typography variant="caption">{minLabel}</Typography>
              <Typography variant="caption">{maxLabel}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderSliderGroup = (group, title, icon) => (
    <Accordion
      defaultExpanded
      sx={{
        backgroundColor: "rgba(153, 132, 212, 0.05)",
        border: "1px solid rgba(202, 168, 245, 0.2)",
        borderRadius: "8px !important",
        mb: 2,
        "&:before": { display: "none" },
        boxShadow: "0 4px 20px rgba(35, 12, 51, 0.1)",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#592E83" }} />}
        sx={{
          backgroundColor: "rgba(153, 132, 212, 0.1)",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ color: "#230C33", fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          {group.map((feature) => (
            <Grid item xs={12} md={6} key={feature.name}>
              {renderInput(feature)}
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        py: 6,
        background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
      }}
    >
      <Container>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ color: "#230C33", fontWeight: 700, mb: 2 }}
          >
            Student Stress Assessment
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#592E83",
              maxWidth: "800px",
              mx: "auto",
              mb: 3,
              fontWeight: 400,
            }}
          >
            Adjust the sliders or select options to match your current situation
            and get personalized insights
          </Typography>
          <Divider
            sx={{ width: "100px", mx: "auto", borderColor: "#9984D4", mb: 4 }}
          />
          <Typography
            variant="body1"
            sx={{
              color: "#592E83",
              maxWidth: "700px",
              mx: "auto",
              fontStyle: "italic",
            }}
          >
            Our AI model analyzes various aspects of your student life to
            predict stress levels and provide tailored recommendations for
            well-being.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "16px",
            p: { xs: 2, md: 4 },
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(202, 168, 245, 0.2)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {renderSliderGroup(
              featureGroups.health,
              "Health Factors",
              <FavoriteIcon sx={{ color: "#592E83" }} />
            )}
            {renderSliderGroup(
              featureGroups.mental,
              "Mental Wellbeing",
              <PsychologyIcon sx={{ color: "#592E83" }} />
            )}
            {renderSliderGroup(
              featureGroups.academic,
              "Academic Factors",
              <SchoolIcon sx={{ color: "#592E83" }} />
            )}
            {renderSliderGroup(
              featureGroups.environmental,
              "Environmental & Social Factors",
              <GroupIcon sx={{ color: "#592E83" }} />
            )}

            {error && (
              <Typography
                color="error"
                sx={{ textAlign: "center", mt: 2, mb: 2 }}
              >
                {error}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  background:
                    "linear-gradient(90deg, #9984D4 0%, #CAA8F5 100%)",
                  color: "#230C33",
                  fontWeight: "bold",
                  padding: "12px 36px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #CAA8F5 0%, #9984D4 100%)",
                    boxShadow: "0 4px 20px rgba(202, 168, 245, 0.5)",
                  },
                  "&:disabled": { background: "rgba(153, 132, 212, 0.3)" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#230C33" }} />
                ) : (
                  "Analyze My Stress Level"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}









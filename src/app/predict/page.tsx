"use client";

import {
  Box,
  Button,
  Typography,
  Slider,
  CircularProgress,
  Container,
  Grid,
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
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SchoolIcon from "@mui/icons-material/School";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";
import { useRouter } from "next/navigation";

// 👇 Interface to fix TS error
interface FeatureInput {
  label: string;
  name: string;
  type: "slider" | "radio";
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  options?: { value: number; label: string }[];
}

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
  extracurricular_activities: "Involvement in activities outside curriculum",
  bullying: "Experiences of being targeted or harassed",
};

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
  }: FeatureInput) => {
    if (type === "radio") {
      return (
        <Card elevation={0}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
              <Tooltip title={featureDescriptions[name]} placement="top">
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
              </Tooltip>
            </Box>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name={name}
                value={formData[name].toString()}
                onChange={handleRadioChange(name)}
              >
                {options?.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value.toString()}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card elevation={0}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
            <Tooltip title={featureDescriptions[name]} placement="top">
              <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
          <Slider
            value={formData[name]}
            onChange={handleSliderChange(name)}
            min={min}
            max={max}
            valueLabelDisplay="auto"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption">{minLabel}</Typography>
            <Typography variant="caption">{maxLabel}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderSliderGroup = (
    group: FeatureInput[],
    title: string,
    icon: React.ReactNode
  ) => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icon}
          <Typography>{title}</Typography>
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
    <Box sx={{ py: 6 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Student Stress Assessment
        </Typography>
        <form onSubmit={handleSubmit}>
          {renderSliderGroup(featureGroups.health, "Health", <FavoriteIcon />)}
          {renderSliderGroup(featureGroups.mental, "Mental", <PsychologyIcon />)}
          {renderSliderGroup(featureGroups.academic, "Academic", <SchoolIcon />)}
          {renderSliderGroup(
            featureGroups.environmental,
            "Environmental",
            <GroupIcon />
          )}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Analyze My Stress Level"}
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}


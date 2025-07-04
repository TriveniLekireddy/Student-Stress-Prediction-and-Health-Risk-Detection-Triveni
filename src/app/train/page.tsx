"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface DatasetRow {
  anxiety_level: number;
  self_esteem: number;
  mental_health_history: number;
  depression: number;
  headache: number;
  blood_pressure: number;
  sleep_quality: number;
  breathing_problem: number;
  noise_level: number;
  living_conditions: number;
  safety: number;
  basic_needs: number;
  academic_performance: number;
  study_load: number;
  teacher_student_relationship: number;
  future_career_concerns: number;
  social_support: number;
  peer_pressure: number;
  extracurricular_activities: number;
  bullying: number;
  stress_level: number;
}

export default function TestPage() {
  const [tabValue, setTabValue] = useState(0);
  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const models = [
    { name: "MTMKL", accuracy: 0.87, f1Score: 0.91, recall: 0.87, precision: 0.96 },
    { name: "Random Forest", accuracy: 0.88, f1Score: 0.89, recall: 0.88, precision: 0.9 },
    { name: "SVM", accuracy: 0.88, f1Score: 0.91, recall: 0.84, precision: 0.99 },
    { name: "XGBoost", accuracy: 0.88, f1Score: 0.9, recall: 0.88, precision: 0.93 },
    { name: "Decision Trees", accuracy: 0.86, f1Score: 0.86, recall: 0.85, precision: 0.88 },
  ];

  // Mock data used only when tabValue === 1
  useEffect(() => {
    if (tabValue === 1 && dataset.length === 0) {
      const mockDataset: DatasetRow[] = Array.from({ length: 50 }, () => ({
        anxiety_level: Math.floor(Math.random() * 10),
        self_esteem: Math.floor(Math.random() * 30),
        mental_health_history: Math.round(Math.random()),
        depression: Math.floor(Math.random() * 10),
        headache: Math.floor(Math.random() * 5),
        blood_pressure: Math.floor(Math.random() * 3),
        sleep_quality: Math.floor(Math.random() * 5),
        breathing_problem: Math.floor(Math.random() * 5),
        noise_level: Math.floor(Math.random() * 5),
        living_conditions: Math.floor(Math.random() * 5),
        safety: Math.floor(Math.random() * 5),
        basic_needs: Math.floor(Math.random() * 5),
        academic_performance: Math.floor(Math.random() * 5),
        study_load: Math.floor(Math.random() * 5),
        teacher_student_relationship: Math.floor(Math.random() * 5),
        future_career_concerns: Math.floor(Math.random() * 5),
        social_support: Math.floor(Math.random() * 5),
        peer_pressure: Math.floor(Math.random() * 5),
        extracurricular_activities: Math.floor(Math.random() * 5),
        bullying: Math.floor(Math.random() * 5),
        stress_level: Math.floor(Math.random() * 3),
      }));
      setDataset(mockDataset);
    }
  }, [tabValue, dataset.length]);

  const columns = [
    "Anxiety Level", "Self Esteem", "Mental Health History", "Depression",
    "Headache", "Blood Pressure", "Sleep Quality", "Breathing Problem",
    "Noise Level", "Living Conditions", "Safety", "Basic Needs",
    "Academic Performance", "Study Load", "Teacher-Student Relationship",
    "Future Career Concerns", "Social Support", "Peer Pressure",
    "Extracurricular Activities", "Bullying", "Stress Level"
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#FFFFFF", py: 6 }}>
      <Box sx={{ maxWidth: "lg", mx: "auto", px: 3 }}>
        <Typography variant="h2" sx={{ color: "#230C33", mb: 4, textAlign: "center" }}>
          Training Results
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="test tabs"
            sx={{
              "& .MuiTab-root": {
                color: "#592E83",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#CAA8F5",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#CAA8F5",
              },
            }}
          >
            <Tab label="Models" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Dataset" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box>
            {models.map((model, index) => (
              <Accordion
                key={index}
                sx={{ mb: 2, borderRadius: "8px", "&:before": { display: "none" }, backgroundColor: "#F8F9FA" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#592E83" }} />}
                  sx={{ "& .MuiAccordionSummary-content": { color: "#230C33", fontWeight: 600 } }}
                >
                  <Typography>{model.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography sx={{ color: "#592E83" }}>Accuracy: {model.accuracy}</Typography>
                    <Typography sx={{ color: "#592E83" }}>F1 Score: {model.f1Score}</Typography>
                    <Typography sx={{ color: "#592E83" }}>Recall: {model.recall}</Typography>
                    <Typography sx={{ color: "#592E83" }}>Precision: {model.precision}</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {dataset.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#592E83" }} />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ backgroundColor: "#F8F9FA", borderRadius: "8px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableCell key={index} sx={{ fontWeight: 600, color: "#230C33" }}>{column}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataset.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i} sx={{ color: "#592E83" }}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={dataset.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                sx={{
                  "& .MuiTablePagination-toolbar": { color: "#592E83" },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { color: "#592E83" },
                  "& .MuiTablePagination-actions button": { color: "#592E83" },
                }}
              />
            </>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
}




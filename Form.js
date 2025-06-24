import React, { useState, useEffect } from 'react';
import { Container, Typography, Stepper, Step, StepLabel, Box, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserInfoForm from './components/UserInfoForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import TemplateSelection from './components/TemplateSelection';
import ResumePreview from './components/ResumePreview';
import ExportOptions from './components/ExportOptions';
import { generateSessionId } from './utils';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const steps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Template', 'Preview & Export'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [resumeData, setResumeData] = useState({
    personal: {},
    experience: [],
    education: [],
    skills: [],
    template: 'professional'
  });
  const [generatedResume, setGeneratedResume] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [atsScore, setAtsScore] = useState(0);

  // Generate session ID on first load
  useEffect(() => {
    const id = generateSessionId();
    setSessionId(id);
    loadSavedData(id);
  }, []);

  const loadSavedData = async (id) => {
    try {
      const response = await fetch(`/api/load-data/${id}`);
      const data = await response.json();
      if (data) {
        setResumeData(data);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async (data) => {
    try {
      await fetch('/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          data
        }),
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    saveData(resumeData);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setResumeData({
      personal: {},
      experience: [],
      education: [],
      skills: [],
      template: 'professional'
    });
    setGeneratedResume(null);
  };

  const updateResumeData = (section, data) => {
    const updatedData = { ...resumeData, [section]: data };
    setResumeData(updatedData);
    saveData(updatedData);
  };

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: resumeData,
          templateId: resumeData.template
        }),
      });
      const result = await response.json();
      setGeneratedResume(result);
      setAtsScore(result.atsScore);
      setIsGenerating(false);
      handleNext();
    } catch (error) {
      console.error('Error generating resume:', error);
      setIsGenerating(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <UserInfoForm data={resumeData.personal} onUpdate={(data) => updateResumeData('personal', data)} />;
      case 1:
        return <ExperienceForm data={resumeData.experience} onUpdate={(data) => updateResumeData('experience', data)} />;
      case 2:
        return <EducationForm data={resumeData.education} onUpdate={(data) => updateResumeData('education', data)} />;
      case 3:
        return <SkillsForm data={resumeData.skills} onUpdate={(data) => updateResumeData('skills', data)} />;
      case 4:
        return <TemplateSelection template={resumeData.template} onSelect={(template) => updateResumeData('template', template)} />;
      case 5:
        return <ResumePreview resume={generatedResume} atsScore={atsScore} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="app-container">
        <Typography variant="h3" component="h1" gutterBottom align="center" className="app-title">
          AI Resume Builder
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box className="step-content">
          {getStepContent(activeStep)}
        </Box>
        <Box className="navigation-buttons">
          {activeStep !== 0 && (
            <Button onClick={handleBack} className="back-button">
              Back
            </Button>
          )}
          {activeStep === steps.length - 2 && (
            <Button
              variant="contained"
              color="primary"
              onClick={generateResume}
              disabled={isGenerating}
              className="generate-button"
            >
              {isGenerating ? <CircularProgress size={24} /> : 'Generate Resume'}
            </Button>
          )}
          {activeStep < steps.length - 2 && activeStep !== 4 && (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <>
              <ExportOptions resume={generatedResume} />
              <Button onClick={handleReset} className="reset-button">
                Start Over
              </Button>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
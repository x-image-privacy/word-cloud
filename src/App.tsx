import * as React from 'react';
import { useState } from 'react';

import { AppBar, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

import Select from './Select';
import View from './View';
import privacyGraph from './data/privacyGraph';
import { GraphData } from './data/types';

const steps = ['Select Data', 'Visualize'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [graph, setGraph] = useState(privacyGraph);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderSwitch = (activeStep: Number) => {
    switch (activeStep) {
      case 0:
        return (
          <Select
            graph={graph}
            handleSetGraph={(g: GraphData) => setGraph(g)}
          />
        );
      case 1:
        return <View graph={graph} />;
      default:
        return <></>;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            G-Interface
          </Typography>
        </Toolbar>
      </AppBar>
      <Stepper activeStep={activeStep} sx={{ m: 3 }}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {renderSwitch(activeStep)}

      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>Saved!</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button onClick={handleReset} variant="contained" color="info">
                Reset
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, color: 'white' }}
                variant="contained"
                color="info"
              >
                Back
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              {activeStep === 0 && (
                <Button onClick={handleNext} variant="contained" color="info">
                  Next
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

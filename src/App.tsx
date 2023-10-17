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

const steps = ['Select Data', 'Visualize', 'Export'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [graph, setGraph] = useState(privacyGraph);

  const isStepOptional = (step: number) => {
    return false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
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
      default:
        return <View graph={graph} />;
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
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
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
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
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
              {isStepOptional(activeStep) && (
                <Button
                  onClick={handleSkip}
                  sx={{ mr: 1 }}
                  variant="contained"
                  color="info"
                >
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} variant="contained" color="info">
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

import * as React from 'react';
import { useEffect } from 'react';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Box from '@mui/material/Box';

import ExplanationDataImporter from './components/ExplanationDataImporter';
import genomicsGraph from './data/genomicsGraph';
import privacyGraph from './data/privacyGraph';
import { GraphData } from './data/types';

type Props = {
  graph: GraphData;
  handleSetGraph: (graph: GraphData) => void;
};

export default function Select({ handleSetGraph }: Props) {
  const [useCase, setUseCase] = React.useState('privacy');

  const handleUseCase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUseCase(value);
  };

  useEffect(() => {
    switch (useCase) {
      case 'genomics': {
        handleSetGraph(genomicsGraph);
        break;
      }
      case 'privacy': {
        handleSetGraph(privacyGraph);
        break;
      }
    }
  }, [useCase]);

  return (
    <div>
      <Box sx={{ m: 5 }}>
        <FormControl>
          <FormLabel id="use case">Use Case</FormLabel>
          <RadioGroup
            aria-labelledby="use case"
            defaultValue="privacy"
            name="useCase"
            value={useCase}
            onChange={handleUseCase}
          >
            <FormControlLabel
              value="privacy"
              control={<Radio />}
              label="Privacy"
            />
            <FormControlLabel
              value="genomics"
              control={<Radio />}
              label="Genomics"
            />
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label="Custom"
            />
          </RadioGroup>
        </FormControl>
        {useCase === 'custom' ? (
          <ExplanationDataImporter onSubmit={handleSetGraph} />
        ) : (
          <></>
        )}
      </Box>
    </div>
  );
}

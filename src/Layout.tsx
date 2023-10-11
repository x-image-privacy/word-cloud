import React from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import Button from '@mui/material/Button';

import Cytoscape from 'cytoscape';

import { DEFAULT_LAYOUT } from './constants';

type Props = {
  cy: Cytoscape.Core | undefined;
};
export default function Layout({ cy }: Props) {
  const handleCenter = () => {
    if (cy) {
      const n = cy.nodes();
      cy.fit(n);
    }
  };

  const handleFit = () => {
    if (cy) {
      const visibleNodes = cy.nodes(':visible');
      const l = visibleNodes.layout({
        name: layout,
      });
      l.run();
    }
  };
  const handleLayout = (event: SelectChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLayout(String(value));
  };

  const [layout, setLayout] = React.useState<string>(DEFAULT_LAYOUT);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="layout">Layout</InputLabel>
        <Select
          labelId="layout"
          id="layout-id"
          // @ts-ignore
          value={layout}
          label="Layout"
          onChange={handleLayout}
        >
          <MenuItem value={'cola'}>Cola</MenuItem>
          <MenuItem value={'cose'}>Cose</MenuItem>
          <MenuItem value={'fcose'}>Fcose</MenuItem>
          <MenuItem value={'circle'}>Circle</MenuItem>
          <MenuItem value={'concentric'}>Concentric</MenuItem>
          <MenuItem value={'avsdf'}>Avsdf</MenuItem>
          <MenuItem value={'cise'}>Cise</MenuItem>
          <MenuItem value={'cise'}>Grid</MenuItem>
          <MenuItem value={'random'}>Random</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleCenter}>
        Center
      </Button>
      <Button variant="outlined" onClick={handleFit}>
        Fit
      </Button>
    </>
  );
}

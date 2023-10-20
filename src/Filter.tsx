import React, { ChangeEvent, useState } from 'react';

import { FilterAlt as FilterIcon } from '@mui/icons-material';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

type Props = {
  handleSetFilters: (filters: Set<string>) => void;
  filters: Set<string>;
  handleSetMatchFullWord: () => void;
  matchFullWord: boolean;
};

export default function Filters({
  handleSetFilters,
  filters,
  handleSetMatchFullWord,
  matchFullWord,
}: Props) {
  const [query, setQuery] = useState<string>('');

  const handleSearch = () => {
    if (query) {
      const newSet = new Set(filters);
      const terms = query.split(',');
      terms.forEach((term) => {
        const cleanTerm = term.trim().toLowerCase();
        newSet.add(cleanTerm);
      });
      handleSetFilters(newSet);
      setQuery('');
    }
  };

  const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  return (
    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
      <InputLabel htmlFor="filter">Filter</InputLabel>
      <OutlinedInput
        id="filter"
        type="text"
        value={query}
        onChange={handleChangeQuery}
        endAdornment={
          <>
            <InputAdornment position="end">
              <IconButton
                aria-label="filter"
                onClick={handleSetMatchFullWord}
                edge="end"
              >
                <TextFormatIcon
                  color={matchFullWord ? 'primary' : 'disabled'}
                />
              </IconButton>
            </InputAdornment>
            <InputAdornment position="end">
              <IconButton aria-label="filter" onClick={handleSearch} edge="end">
                <FilterIcon />
              </IconButton>
            </InputAdornment>
          </>
        }
        label="Filter..."
        aria-describedby="helper-text"
        inputProps={{
          'aria-label': 'filter',
        }}
      />
      <FormHelperText id="helper-text">Comma-Separated</FormHelperText>
    </FormControl>
  );
}

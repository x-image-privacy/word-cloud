import React, { ChangeEvent, useState } from 'react';

import { FilterAlt as FilterIcon } from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

type Props = {
  handleSetFilters: (filters: Set<string>) => void;
  filters: Set<string>;
};

export default function Filters({ handleSetFilters, filters }: Props) {
  const [query, setQuery] = useState<string>('');
  const handleSearch = () => {
    if (query) {
      const cleanQuery = query.trim().toLowerCase();
      const newSet = new Set(filters);
      newSet.add(cleanQuery);
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
          <InputAdornment position="end">
            <IconButton aria-label="filter" onClick={handleSearch} edge="end">
              <FilterIcon />
            </IconButton>
          </InputAdornment>
        }
        label="Filter..."
      />
    </FormControl>
  );
}

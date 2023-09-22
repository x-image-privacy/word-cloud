import { useState } from 'react';

import { ExplanationData } from '../WordCloud';
import { transformGPipelineData } from './utils/transformations';

type Props = {
  label: string;
  description: string;
  nodesFile: string;
  categoriesFile: string;
  onSubmit: (data: ExplanationData) => void;
};

const UseCase = ({
  label,
  description,
  nodesFile,
  categoriesFile,
  onSubmit,
}: Props) => {
  const [loadingData, setLoadingData] = useState(false);
  const onClick = async () => {
    setLoadingData(true);
    // load the data from the files
    const nodesFileData = await fetch(nodesFile);
    const nodes = await nodesFileData.json();
    const categoriesFileData = await fetch(categoriesFile);
    const categories = await categoriesFileData.json();
    const xData = transformGPipelineData(nodes, categories);
    onSubmit(xData);
    setLoadingData(false);
  };

  return (
    <div className='flex flex-col max-w-sm'>
      <button
        className='inline-flex items-center leading-6 btn btn-blue'
        onClick={onClick}
      >
        {loadingData ? (
          <svg className='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              fill='none'
              stroke='currentColor'
              stroke-width='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        ) : null}
        <span>{loadingData ? 'Loading...' : label}</span>
      </button>
      <div className='text-zinc-500 text-sm'>{description}</div>
    </div>
  );
};
export default UseCase;

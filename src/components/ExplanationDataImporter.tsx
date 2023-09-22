import { useRef, useState } from 'react';

import { ExplanationData } from '../WordCloud';
import { Category, ExplainabilityNode } from './types';
import { transformGPipelineData } from './utils/transformations';

type SuccessButtonProps = {
  isSuccess: boolean;
  onClick: () => void;
  children: JSX.Element | string;
};

const SuccessButton = ({
  isSuccess,
  onClick,
  children,
}: SuccessButtonProps) => {
  return (
    <button
      className={`btn inline-flex justify-center items-center btn-${
        isSuccess ? 'green' : 'blue'
      }`}
      onClick={onClick}
    >
      {isSuccess && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6 mr-2'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};

const DataFileButton = <T,>({
  data,
  children,
  setData,
}: {
  data?: T;
  children: JSX.Element | string;
  setData: (d: T | undefined) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const triggerFileSelection = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current;
      fileInputRef.current.click();
    }
  };

  const handleFile = () => {
    if (fileInputRef && fileInputRef.current && fileInputRef.current.files) {
      const [file] = fileInputRef.current.files;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt?.target?.result as string);
          setError(undefined);
          setData(data);
        } catch (e) {
          if (e instanceof SyntaxError) {
            setData(undefined);
            setError(e.message);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <input
        className='hidden'
        ref={fileInputRef}
        onChange={handleFile}
        type='file'
        accept='.json,.txt,text/plain'
      />
      {error && (
        <div className='w-min-content border bg-red-500 rounded-lg px-4 py-3'>
          <p className='text-white'>{error}</p>
        </div>
      )}
      <SuccessButton isSuccess={!!data} onClick={triggerFileSelection}>
        {children}
      </SuccessButton>
    </>
  );
};

type Props = {
  onSubmit: (data: ExplanationData) => void;
};

const ExplanationDataImporter = ({ onSubmit }: Props) => {
  const [nodeData, setNodeData] = useState<ExplainabilityNode[]>();
  const [categoryData, setCategoryData] = useState<Category[]>();
  const [submitted, setSubmitted] = useState<boolean>();

  const handleTransform = () => {
    if (nodeData && categoryData) {
      const xData = transformGPipelineData(nodeData, categoryData);
      onSubmit(xData);
      setSubmitted(true);
    }
  };

  return (
    <>
      <DataFileButton data={nodeData} setData={setNodeData}>
        Load Nodes
      </DataFileButton>
      <DataFileButton data={categoryData} setData={setCategoryData}>
        Load Categories
      </DataFileButton>
      <SuccessButton isSuccess={!!submitted} onClick={handleTransform}>
        Transform
      </SuccessButton>
    </>
  );
};
export default ExplanationDataImporter;

import { useState } from "react";
import { ExplanationData } from "../WordCloud";
import { transformGPipelineData } from "./utils/transformations";

type UseCaseButtonProps = {
  isSelected: boolean;
  children: string;
  onClick: () => void;
};

const UseCaseButton = ({
  isSelected,
  onClick,
  children,
}: UseCaseButtonProps) => {
  return (
    <button
      className={`btn inline-flex justify-center items-center btn-${
        isSelected ? "green" : "blue"
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};

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
    console.log(nodes, categories);
    const xData = transformGPipelineData(nodes, categories);
    onSubmit(xData);
    setLoadingData(false);
  };

  return (
    <div className="flex flex-col max-w-sm">
      <button
        className="inline-flex items-center leading-6 btn btn-blue"
        onClick={onClick}
      >
        {loadingData ? (
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        <span>{loadingData ? "Loading..." : label}</span>
      </button>
      <div className="text-zinc-500 text-sm">{description}</div>
    </div>
  );
};
export default UseCase;

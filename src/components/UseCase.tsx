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
  const onClick = async () => {
    // load the data from the files
    const nodesFileData = await fetch(nodesFile);
    const nodes = await nodesFileData.json();
    const categoriesFileData = await fetch(categoriesFile);
    const categories = await categoriesFileData.json();
    console.log(nodes, categories);
    const xData = transformGPipelineData(nodes, categories);
    onSubmit(xData);
  };

  return (
    <div className="flex flex-col max-w-sm">
      <div>{label}</div>
      <div className="text-zinc-500 text-sm">{description}</div>
      <button className="btn btn-blue" onClick={onClick}>
        Use
      </button>
    </div>
  );
};
export default UseCase;

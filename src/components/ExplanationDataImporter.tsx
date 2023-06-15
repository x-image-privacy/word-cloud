import { useRef, useState } from "react";
import { ExplanationData } from "../WordCloud";
import { InputNode } from "../WordCloud/types";

type Node = {
  id: string;
  name: string;
  score: number;
};

type Category = {
  elements: string[];
} & Node;

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
      className={`btn inline-flex justify-items-center items-center btn-${
        isSuccess ? "green" : "blue"
      }`}
      onClick={onClick}
    >
      {isSuccess && (
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
          console.log(data);
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
        className="hidden"
        ref={fileInputRef}
        onChange={handleFile}
        type="file"
        accept=".json,.txt,text/plain"
      />
      {error && (
        <div className="w-min-content border bg-red-500 rounded-lg px-4 py-3">
          <p className="text-white">{error}</p>
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
  const [nodeData, setNodeData] = useState<Node[]>();
  const [categoryData, setCategoryData] = useState<Category[]>();

  const handleTransform = () => {
    if (nodeData && categoryData) {
      const xData = categoryData?.map((c) => ({
        category: c.name,
        words: c.elements.reduce<InputNode[]>((words, e) => {
          const el = nodeData.find((n) => n.id === e);
          if (el) {
            words.push({ id: el.id, text: el.name, coef: el.score });
          }
          return words;
        }, []),
      }));
      console.log(xData);
      onSubmit(xData);
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
      <button className="btn btn-blue" onClick={handleTransform}>
        Transform
      </button>
    </>
  );
};
export default ExplanationDataImporter;

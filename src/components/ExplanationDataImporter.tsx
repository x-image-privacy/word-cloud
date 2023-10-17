import { useRef, useState } from 'react';
import * as React from 'react';
import toast from 'react-hot-toast';

import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Done as DoneIcon,
} from '@mui/icons-material';
import { ButtonGroup, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { ElementDefinition } from 'cytoscape';
import randomColor from 'randomcolor';

import { GraphData } from '../data/types';

class CategoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CategoryError';
  }
}

class NodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NodeError';
  }
}

class EdgeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EdgeError';
  }
}

type SuccessButtonProps = {
  isSuccess: boolean;
  onClick: () => void;
  children: JSX.Element | string;
};

type ErrorToastContainerProps = {
  message: string;
  onClick: () => void;
};
const ErrorToastContainer = ({
  message,
  onClick,
}: ErrorToastContainerProps) => {
  return (
    <>
      <Typography>{message}</Typography>
      <IconButton
        aria-label="dismiss"
        size="small"
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          backgroundColor: 'white',
          backgroundOpacity: '75%',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    </>
  );
};

const SuccessButton = ({
  isSuccess,
  onClick,
  children,
}: SuccessButtonProps) => {
  return (
    <Button
      variant="contained"
      color={isSuccess ? 'success' : 'info'}
      onClick={onClick}
      startIcon={<CloudUploadIcon />}
      endIcon={isSuccess && <DoneIcon />}
    >
      {children}
    </Button>
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
          setData(data);
        } catch (e: any) {
          if (e instanceof SyntaxError) {
            toast.error((t) => (
              <ErrorToastContainer
                message={e.message}
                onClick={() => toast.dismiss(t.id)}
              />
            ));
            setData(undefined);
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
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFile}
        type="file"
        accept=".json,.txt,text/plain"
      />
      <SuccessButton isSuccess={!!data} onClick={triggerFileSelection}>
        {children}
      </SuccessButton>
    </>
  );
};

type Props = {
  onSubmit: (data: GraphData) => void;
};

const validateNodeTypeData = (
  node: ElementDefinition,
  i: number,
  nodeType: string,
  ErrorClass: any,
): void | NodeError | CategoryError => {
  // validate existence of data field
  if (!node.data) {
    throw new ErrorClass(`${nodeType} #${i + 1} does not have a data object.`);
  }

  // validate common node type properties
  const props = ['name', 'score', 'id'];
  props.forEach((prop: string) => {
    if (!node.data[prop]) {
      if (node.data.id) {
        throw new ErrorClass(
          `${nodeType} with ID "${node.data.id}" does not have a "data.${prop}" property.`,
        );
      } else if (node.data.name) {
        throw new ErrorClass(
          `${nodeType} "${node.data.name}" does not have a "data.${prop}" property.`,
        );
      } else {
        throw new ErrorClass(
          `${nodeType} #${i + 1} does not have a "data.${prop}" property.`,
        );
      }
    }
  });
};

const validateEdgeTypeData = (edge: ElementDefinition, i: number) => {
  // validate existence of data field
  if (!edge.data) {
    throw new EdgeError(`Edge #${i + 1} does not have a data object.`);
  }

  // validate common node type properties
  const props = ['id', 'source', 'target'];
  props.forEach((prop: string) => {
    if (!edge.data[prop]) {
      if (edge.data.id) {
        throw new EdgeError(
          `Edge with ID "${edge.data.id}" does not have a "data.${prop}" property.`,
        );
      } else {
        throw new EdgeError(
          `Edge #${i + 1} does not have a "data.${prop}" property.`,
        );
      }
    }
  });
};

const validateData = async (
  nodeData: ElementDefinition[],
  categoryData: ElementDefinition[],
  edgeData: ElementDefinition[],
) => {
  const categoryIds: Set<string> = new Set();
  const nodeIds: Set<string> = new Set();
  const edgeIds: Set<string> = new Set();

  // validate properties of categories
  categoryData.forEach((category: ElementDefinition, i: number) => {
    validateNodeTypeData(category, i, 'Category', CategoryError);

    // validate that there are no duplicate ids
    if (categoryIds.has(category.data.id as string)) {
      throw new CategoryError(
        `Duplicate category with ID "${category.data.id}".`,
      );
    } else {
      categoryIds.add(category.data.id as string);
    }

    // create color if not existent
    if (!category.data.color) {
      category.data.color = randomColor({
        luminosity: 'dark',
      });
    }
  });

  // validate properties of nodes
  nodeData.forEach((node: ElementDefinition, i: number) => {
    validateNodeTypeData(node, i, 'Node', NodeError);

    // validate that there are no duplicate ids
    if (nodeIds.has(node.data.id as string)) {
      throw new NodeError(`Duplicate node with ID "${node.data.id}".`);
    } else {
      nodeIds.add(node.data.id as string);
    }

    // validate parent exists
    if (node.data.parent && !categoryIds.has(node.data.parent)) {
      throw new NodeError(
        `Node with ID "${node.data.id}" has invalid parent "${node.data.parent}".`,
      );
    }
  });

  // validate properties of edges
  edgeData.forEach((edge: ElementDefinition, i: number) => {
    validateEdgeTypeData(edge, i);

    // validate that there are no duplicate ids
    if (edgeIds.has(edge.data.id as string)) {
      throw new EdgeError(`Duplicate edge with ID "${edge.data.id}".`);
    } else {
      edgeIds.add(edge.data.id as string);
    }
    // validate edges have sources and targets that exist
    const connectionTypes = ['source', 'target'];
    connectionTypes.forEach((connectionType) => {
      const connectionId = edge.data[connectionType];
      if (!nodeIds.has(connectionId) && !categoryIds.has(connectionId)) {
        throw new EdgeError(
          `Edge with ID "${edge.data.id}" has invalid ${connectionType} "${connectionId}".`,
        );
      }
    });
  });
};

const ExplanationDataImporter = ({ onSubmit }: Props) => {
  const [nodeData, setNodeData] = useState<ElementDefinition[]>();
  const [categoryData, setCategoryData] = useState<ElementDefinition[]>();
  const [edgeData, setEdgeData] = useState<ElementDefinition[]>();
  const [submitted, setSubmitted] = useState<boolean>();

  const handleSubmit = (): void => {
    if (nodeData && categoryData && edgeData) {
      // start promise toast
      const validation = toast.promise(
        validateData(nodeData, categoryData, edgeData),
        {
          loading: <Typography>Validating...</Typography>,
          success: <Typography>Settings saved!</Typography>,
          error: (e: Error) => {
            console.log(e instanceof CategoryError);

            if (e instanceof CategoryError) {
              setCategoryData(undefined);
            } else if (e instanceof NodeError) {
              setNodeData(undefined);
            } else if (e instanceof EdgeError) {
              setEdgeData(undefined);
            }

            return (
              <ErrorToastContainer
                message={e.message}
                onClick={() => toast.dismiss()}
              />
            );
          },
        },
      );

      // perform validation
      validation
        .then(() => {
          const xData: GraphData = {
            nodes: nodeData,
            edges: edgeData,
            parentNodes: categoryData,
          };
          onSubmit(xData);
          setSubmitted(true);
        })
        .catch((err) => {
          setSubmitted(false);
          console.error(`${err.name}: ${err.message}`);
        })
        .finally(() => {});
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <ButtonGroup>
        <DataFileButton data={categoryData} setData={setCategoryData}>
          Load Categories
        </DataFileButton>
        <DataFileButton data={nodeData} setData={setNodeData}>
          Load Nodes
        </DataFileButton>
        <DataFileButton data={edgeData} setData={setEdgeData}>
          Load Edges
        </DataFileButton>
        <Button
          variant="contained"
          color={!!submitted ? 'success' : 'info'}
          onClick={handleSubmit}
          endIcon={!!submitted && <DoneIcon />}
          disabled={!nodeData || !edgeData || !categoryData}
        >
          Submit
        </Button>
      </ButtonGroup>
    </Box>
  );
};
export default ExplanationDataImporter;

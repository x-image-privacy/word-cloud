import React, { useState } from 'react';
import toast from 'react-hot-toast';

import {
  ButtonGroup,
  FormControlLabel,
  FormGroup,
  Modal,
  Switch,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { ElementDefinition } from 'cytoscape';
import Cytoscape from 'cytoscape';
import { saveAs } from 'file-saver';

import { SHOW_PARENT_NODES_KEY, SettingsProps } from './View';
import { ErrorToastContainer } from './components/ExplanationDataImporter';

type Props = {
  cy: Cytoscape.Core | undefined;
  settings: SettingsProps;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const NODES_SELECTOR = 'node:childless';

const exportingNodes = (selector: string): boolean =>
  selector === NODES_SELECTOR;

const handleExport = (
  elements: Cytoscape.CollectionReturnValue,
  dataOnly: boolean,
  fileName: string,
  selector: string,
  settings: SettingsProps,
) => {
  const exportableElements: Cytoscape.CollectionReturnValue = elements.filter(
    ':visible:selectable',
  );
  let json: ElementDefinition[];

  json = exportableElements.map((ele) => {
    let rvalue: ElementDefinition = { data: {} };

    if (dataOnly) {
      rvalue.data = ele.data();
    } else {
      rvalue = {
        ...rvalue,
        // @ts-ignore
        ...ele.json(),
      };
    }

    return rvalue;
  });

  if (exportingNodes(selector) && !settings[SHOW_PARENT_NODES_KEY]) {
    json.forEach((obj: ElementDefinition): void => {
      if (obj?.data.hasOwnProperty('parent')) {
        delete obj.data.parent;
      }
    });
  }

  const blob = new Blob([JSON.stringify(json)], {
    type: 'application/json',
  });

  saveAs(blob, `${fileName}_${new Date().toISOString()}.json`);
};

const showToastError = (err: any) => {
  toast.error((t) => (
    <ErrorToastContainer
      message={err.message}
      onClick={() => toast.dismiss(t.id)}
    />
  ));
};

export default function Export({ cy, settings }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [exportLayout, setExportLayout] = useState<boolean>(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExportThunk = (
    selector: string,
    fileName: string,
    settings: SettingsProps,
  ): Function => {
    return () => {
      if (cy) {
        try {
          const elements = cy.$(selector);
          handleExport(elements, !exportLayout, fileName, selector, settings);
        } catch (err: any) {
          showToastError(err);
        }
      }
    };
  };

  const handleExportCategories = handleExportThunk(
    'node:parent',
    'categories',
    settings,
  );
  const handleExportNodes = handleExportThunk(
    NODES_SELECTOR,
    'nodes',
    settings,
  );
  const handleExportEdges = handleExportThunk('edge', 'edges', settings);

  const handleChangeExportLayout = () => {
    setExportLayout(!exportLayout);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'right' }}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{ mb: 1 }}
        >
          <Button onClick={handleOpen}>Export</Button>
        </ButtonGroup>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-show-export-title"
        aria-describedby="modal-show-export-description"
      >
        <Box sx={style}>
          <Typography id="modal-show-export-title" variant="h6" component="h2">
            Export
          </Typography>
          <Typography id="modal-show-export-description" sx={{ my: 3 }}>
            Export the categories, nodes, and edges currently shown on the
            graph. If layout is selected, elements will be exported with their
            corresponding layout information.
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={exportLayout}
                  onChange={handleChangeExportLayout}
                />
              }
              label="Export Layout"
            />
          </FormGroup>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
              sx={{ my: 2 }}
              disabled={!cy}
            >
              <Button onClick={() => handleExportCategories()}>
                Export Categories
              </Button>
              <Button onClick={() => handleExportNodes()}>Export Nodes</Button>
              <Button onClick={() => handleExportEdges()}>Export Edges</Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

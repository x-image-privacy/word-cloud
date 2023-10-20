import React, { useState } from 'react';

import { ButtonGroup, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Cytoscape from 'cytoscape';
import { saveAs } from 'file-saver';

type Props = {
  cy: Cytoscape.Core | undefined;
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

export default function Export({ cy }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExportCategories = () => {
    if (cy) {
      const eles = cy.$('node:parent:visible');
      const json = eles.jsons();
      // console.log(json);
      // @ts-ignore
      const blob = new Blob([json], { type: 'application/json' });

      saveAs(blob, 'categories.json');
    }
  };
  const handleExportNodes = () => {};
  const handleExportEdges = () => {};

  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        sx={{ mb: 1, visibility: 'hidden' }}
      >
        <Button onClick={handleOpen}>Export</Button>
      </ButtonGroup>
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
          <Typography id="modal-show-export-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            sx={{ mb: 1 }}
            disabled={!cy}
          >
            <Button onClick={handleExportCategories}>Export Categories</Button>
            <Button onClick={handleExportNodes}>Export Nodes</Button>
            <Button onClick={handleExportEdges}>Export Edges</Button>
          </ButtonGroup>
        </Box>
      </Modal>
    </>
  );
}

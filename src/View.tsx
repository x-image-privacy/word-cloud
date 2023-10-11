import React, { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
} from '@mui/material';
import Box from '@mui/material/Box';

import Cytoscape, { Core, NodeSingular } from 'cytoscape';
// @ts-ignore
import avsdf from 'cytoscape-avsdf';
// @ts-ignore
import cise from 'cytoscape-cise';
// @ts-ignore
import cola from 'cytoscape-cola';
// @ts-ignore
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';
// @ts-ignore
import edgehandles from 'cytoscape-edgehandles';
// @ts-ignore
import fcose from 'cytoscape-fcose';
import _ from 'lodash';
import randomColor from 'randomcolor';
import rgbHex from 'rgb-hex';

import Filter from './Filter';
import Layout from './Layout';
import { DEFAULT_LAYOUT } from './constants';
import { GraphData } from './data/types';

Cytoscape.use(fcose);
Cytoscape.use(cola);
Cytoscape.use(avsdf);
Cytoscape.use(cise);
Cytoscape.use(compoundDragAndDrop);
Cytoscape.use(edgehandles);

// todo: figure out how to uncache for nodes that change color
const selectTextOutlineColor = _.memoize(function (ele: NodeSingular) {
  if (ele.isParent()) {
    return ele.data()['color'];
  }

  if (ele.isChild()) {
    return randomColor({
      luminosity: 'dark',
      hue: ele.parent().data()['color'],
    });
  }

  return 'gray';
});

const convertToString = (obj?: any): string => {
  return JSON.stringify(obj, null, 2);
};

const convertFromString = (obj?: any): any => {
  return JSON.parse(obj);
};

const SHOW_NODES_KEY = 'showNodes';
const SHOW_PARENT_NODES_KEY = 'showParentNodes';
const SHOW_EDGES_KEY = 'showEdges';
const SHOW_LABELS = 'showLabels';

type Props = {
  graph: GraphData;
};

const View = ({ graph }: Props) => {
  const [settings, setSettings] = useState({
    [SHOW_NODES_KEY]: true,
    [SHOW_PARENT_NODES_KEY]: true,
    [SHOW_EDGES_KEY]: true,
    [SHOW_LABELS]: true,
  });

  const scores = graph.nodes.map((node) => node.data.score);
  const weights = graph.edges.map((edge) => edge.data.weight);

  const elements = CytoscapeComponent.normalizeElements({
    nodes: [..._.cloneDeep(graph.nodes), ..._.cloneDeep(graph.parentNodes)],
    edges: _.cloneDeep(graph.edges),
  });

  const [cyHandle, setCyHandle] = useState<Core>();
  const [minScore, setMinScore] = useState<Number>(Math.min(...scores));
  const [maxScore, setMaxScore] = useState<Number>(Math.max(...scores));
  const [minWeight, setMinWeight] = useState<Number>(Math.min(...weights));
  const [maxWeight, setMaxWeight] = useState<Number>(Math.max(...weights));
  const [filters, setFilters] = useState<Set<string>>(new Set());

  const stylesheet = [
    {
      selector: 'node[score][name]',
      style: {
        label: 'data(name)',
        backgroundOpacity: 0,
        backgroundColor: selectTextOutlineColor,
        width: `mapData(score, ${minScore}, ${maxScore}, 10, 100)`,
        height: `mapData(score, ${minScore}, ${maxScore}, 10, 100)`,
        fontSize: `mapData(score, ${minScore}, ${maxScore}, 1, 20)`,
        color: 'white',
        textHalign: 'center',
        textValign: 'center',
        // textOutlineColor: `mapData(score, ${minScore}, ${maxScore}, blue, red)`,
        textOutlineColor: selectTextOutlineColor,
        textOutlineOpacity: 0.9,
        textOutlineWidth: 5,
      },
    },
    {
      selector: 'node:orphan',
      style: {
        textOutlineColor: 'gray',
        textOutlineOpacity: 1,
      },
    },
    {
      selector: 'edge',
      style: {
        width: 1,
        opacity: 0.5,
      },
    },
    {
      selector: 'edge[weight]',
      style: {
        width: `mapData(weight, ${minWeight}, ${maxWeight}, 1, 10)`,
        opacity: 0.5,
      },
    },
    {
      selector: 'node:parent[color]',
      style: {
        borderColor: 'data(color)',
        backgroundColor: 'data(color)',
        textOutlineColor: 'data(color)',
        textOutlineOpacity: 1,
        backgroundOpacity: 0.75,
        shape: 'roundrectangle',
        textHalign: 'center',
        textValign: 'top',
        compoundSizingWrtLabels: 'include',
      },
    },
    {
      selector: 'node:selected',
      style: {
        textOutlineOpacity: 1,
        textOutlineColor: 'red',
        backgroundColor: 'red',
      },
    },
  ];

  const areNodesHidden = () =>
    !settings[SHOW_PARENT_NODES_KEY] && !settings[SHOW_NODES_KEY];

  const handleCheckbox = (key: keyof typeof settings) => {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleRemoveFilter = (v: string) => {
    const newSet = new Set(filters);
    newSet.delete(v);
    setFilters(newSet);
  };

  useEffect(() => {
    // anything in here is fired on component mount.
    if (cyHandle) {
      // have to catch this error as it explodes on first load
      try {
        // edges
        if (settings[SHOW_EDGES_KEY]) {
          cyHandle
            .style()
            .selector('edge')
            .style({
              opacity: 0.5,
            })
            .update();
        } else {
          cyHandle
            .style()
            .selector('edge')
            .style({
              opacity: 0,
            })
            .update();
        }

        // parent nodes
        if (settings[SHOW_PARENT_NODES_KEY]) {
          // without labels
          if (!settings[SHOW_LABELS]) {
            cyHandle
              .style()
              .selector('node:parent[color]')
              .style({
                'text-outline-opacity': 0,
                'text-opacity': 0,
                'background-opacity': 1,
              })
              .update();
          } else {
            // with labels
            cyHandle
              .style()
              .selector('node:parent[color]')
              .style({
                'background-opacity': 0.75,
                'border-width': 1,
                'text-outline-opacity': 1,
                'text-opacity': 1,
              })
              .update();
          }
        } else {
          cyHandle
            .style()
            .selector('node:parent[color]')
            .style({
              'background-opacity': 0,
              'border-width': 0,
              'text-outline-opacity': 0,
              'text-opacity': 0,
            })
            .update();
        }

        // note: assuming childless nodes as children
        // show children nodes
        if (settings[SHOW_NODES_KEY]) {
          // without labels
          if (!settings[SHOW_LABELS]) {
            cyHandle
              .style()
              .selector('node:childless')
              .style({
                'text-outline-opacity': 0,
                'text-opacity': 0,
                'background-opacity': 1,
              })
              .update();
          } else {
            // with labels
            cyHandle
              .style()
              .selector('node:childless')
              .style({
                'text-outline-opacity': 1,
                'text-opacity': 1,
              })
              .update();
          }
        } else {
          cyHandle
            .style()
            .selector('node:childless')
            .style({
              'text-outline-opacity': 0,
              'text-opacity': 0,
            })
            .update();
        }

        // hide all nodes
        if (filters.size) {
          cyHandle.nodes().style({ visibility: 'hidden' });
        } else {
          cyHandle.nodes().style({ visibility: 'visible' });
          cyHandle.edges().style({ visibility: 'visible' });
        }

        // filter
        filters.forEach((f) => {
          // bring back relevant nodes
          cyHandle.nodes().forEach((ele) => {
            const cleanName = ele.data('name').trim().toLowerCase();
            if (cleanName.includes(f)) {
              ele.style({ visibility: 'visible' });

              // if node is a child
              // todo: do not assume just one parent
              const category = ele.parent();
              category.style({ visibility: 'visible' });

              // if node is a parent
              const children = ele.children();
              children.style({ visibility: 'visible' });
            }
          });
          cyHandle.edges().style({ visibility: 'visible' });
        });

        cyHandle.nodes(':hidden').forEach((ele) => {
          ele.connectedEdges().style({ visibility: 'hidden' });
        });

        const visibleNodes = cyHandle.nodes(':visible');

        if (visibleNodes.length && cyHandle.container()) {
          cyHandle.fit(visibleNodes);
        }
      } catch (e) {
        console.warn(`caught error: ${e}`);
      }
    }

    return () => {
      // anything in here is fired on component unmount.
    };
  }, [settings, cyHandle, filters]);

  return (
    <>
      <div>
        <Box sx={{ m: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings[SHOW_NODES_KEY]}
                      onChange={() => handleCheckbox(SHOW_NODES_KEY)}
                    />
                  }
                  label="Show Nodes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings[SHOW_PARENT_NODES_KEY]}
                      onChange={() => handleCheckbox(SHOW_PARENT_NODES_KEY)}
                    />
                  }
                  label="Show Categories"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings[SHOW_EDGES_KEY]}
                      onChange={() => handleCheckbox(SHOW_EDGES_KEY)}
                    />
                  }
                  label="Show Edges"
                />
                <FormControlLabel
                  disabled={areNodesHidden()}
                  control={
                    <Checkbox
                      checked={settings[SHOW_LABELS]}
                      onChange={() => handleCheckbox(SHOW_LABELS)}
                      indeterminate={areNodesHidden()}
                    />
                  }
                  label="Show Labels"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <Filter handleSetFilters={setFilters} filters={filters} />
              <div>
                {Array.from(filters).map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    onDelete={() => handleRemoveFilter(f)}
                  />
                ))}
              </div>
            </Grid>
            <Grid item xs={4}>
              <Layout cy={cyHandle} />
            </Grid>
          </Grid>
        </Box>
      </div>
      <div>
        <div>
          <CytoscapeComponent
            id="privacy"
            elements={[...elements]}
            stylesheet={stylesheet}
            style={{
              width: 'calc(100vw - 50px)',
              height: 'calc(100vh - 300px)',
            }}
            layout={{ name: DEFAULT_LAYOUT }}
            cy={(cy) => {
              // todo: enable reshuffling
              setCyHandle(cy);
            }}
          />
        </div>
      </div>
    </>
  );
};
export default View;
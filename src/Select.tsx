import * as React from 'react';
import { useEffect } from 'react';

import CheckBoxSetting from './components/CheckBoxSetting';
import ExplanationDataImporter from './components/ExplanationDataImporter';
import SettingsWrapper from './components/SettingsWrapper';
import genomicsGraph from './data/genomicsGraph';
import privacyGraph from './data/privacyGraph';
import { GraphData } from './data/types';

type Props = {
  layout: string;
  graph: GraphData;
  handleChangeLayout: (layout: string) => void;
  handleSetGraph: (graph: GraphData) => void;
};

export default function Select({
  layout,
  handleChangeLayout,
  handleSetGraph,
}: Props) {
  const [useCase, setUseCase] = React.useState('privacy');

  const handleUseCase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUseCase(value);
  };

  useEffect(() => {
    switch (useCase) {
      case 'genomics': {
        handleSetGraph(genomicsGraph);
        break;
      }
      case 'privacy': {
        handleSetGraph(privacyGraph);
        break;
      }
    }
  }, [useCase]);

  const handleLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const value = event.target.value;
    handleChangeLayout(value);
  };

  return (
    <div>
      <div>
        <SettingsWrapper title="Data">
          <div>
            <SettingsWrapper title="Use Case">
              <div>
                <div>
                  <input
                    type="radio"
                    id="privacy"
                    name="useCase"
                    value="privacy"
                    checked={useCase === 'privacy'}
                    onChange={handleUseCase}
                  />
                  <label htmlFor="privacy">Privacy</label>
                  <br />
                  <input
                    type="radio"
                    id="genomics"
                    name="useCase"
                    value="genomics"
                    checked={useCase === 'genomics'}
                    onChange={handleUseCase}
                  />
                  <label htmlFor="genomics">Genomics</label>
                  <br />
                  <input
                    type="radio"
                    id="custom"
                    name="useCase"
                    value="custom"
                    checked={useCase === 'custom'}
                    onChange={handleUseCase}
                  />
                  <label htmlFor="custom">Custom</label>
                </div>
              </div>
              {useCase === 'custom' ? (
                <ExplanationDataImporter onSubmit={handleSetGraph} />
              ) : (
                <></>
              )}
            </SettingsWrapper>
          </div>
          <div>
            <SettingsWrapper title="Layout">
              <div>
                <div onChange={handleLayout}>
                  <input
                    type="radio"
                    id="fcose"
                    name="layout"
                    value="fcose"
                    checked={layout === 'fcose'}
                  />
                  <label htmlFor="fcose">fCOSE</label>
                  <br />
                  <input
                    type="radio"
                    id="cola"
                    name="layout"
                    value="cola"
                    checked={layout === 'cola'}
                  />
                  <label htmlFor="cola">Cola</label>
                  <br />
                  <input
                    type="radio"
                    id="random"
                    name="layout"
                    value="random"
                    checked={layout === 'random'}
                  />
                  <label htmlFor="random">Random</label>
                </div>
              </div>
            </SettingsWrapper>
          </div>
        </SettingsWrapper>
      </div>
    </div>
  );
}

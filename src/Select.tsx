import * as React from 'react';

import CheckBoxSetting from './components/CheckBoxSetting';
import SettingsWrapper from './components/SettingsWrapper';

type Props = {
  layout: string;
  useCase: string;
  handleChange: (useCase: string) => void;
  handleChangeLayout: (layout: string) => void;
};

export default function Select({
  useCase,
  handleChange,
  layout,
  handleChangeLayout,
}: Props) {
  const handleUseCase = (event: React.FormEvent<HTMLDivElement>) => {
    // @ts-ignore
    const value = event.target.value;
    handleChange(layout);
  };

  const handleLayout = (event: React.FormEvent<HTMLDivElement>) => {
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
                <div onChange={handleUseCase}>
                  <input
                    type="radio"
                    id="privacy"
                    name="useCase"
                    value="privacy"
                    checked={useCase === 'privacy'}
                  />
                  <label htmlFor="privacy">Privacy</label>
                  <br />
                  <input
                    type="radio"
                    id="genomics"
                    name="useCase"
                    value="genomics"
                    checked={useCase === 'genomics'}
                  />
                  <label htmlFor="genomics">Genomics</label>
                </div>
              </div>
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

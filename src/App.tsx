import { ChangeEventHandler, useState } from "react";
import Wordcloud, { ExplanationData } from "./WordCloud";
import { defaultWords1 } from "./data";

const presetData = [
  { label: "empty", value: undefined },
  { label: "default1", value: defaultWords1 },
];

const convertToString = (obj?: any): string => {
  return JSON.stringify(obj, null, 2);
};

const convertFromString = (obj?: any): any => {
  return JSON.parse(obj);
};

const App = () => {
  const [showBounds, setShowBounds] = useState(false);
  const [showWordBounds, setShowWordBounds] = useState(false);
  const [data, setData] = useState<ExplanationData>();
  const [selectedPresetValue, setSelectedPresetValue] = useState(
    presetData[0].label
  );
  const [explanationData, setExplanationData] = useState(
    convertToString(presetData[0].value)
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputData: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const newValue = event.target.value;
    setExplanationData(newValue);
    try {
      JSON.parse(newValue);
      // reset error message in case there is no more error
      setErrorMessage("");
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    }
  };

  return (
    <div style={{ flexDirection: "column", alignItems: "center" }}>
      <fieldset>
        <legend>Data</legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label htmlFor="preset-data">Preset Data</label>
            <select
              value={selectedPresetValue}
              onChange={({ target: { value: chosenLabel } }) => {
                setSelectedPresetValue(chosenLabel);
                setExplanationData(
                  convertToString(
                    presetData.find((p) => p.label === chosenLabel)?.value
                  )
                );
              }}
            >
              {presetData.map((d) => (
                <option value={d.label}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="data">Explanation Data</label>
            <textarea
              id="data"
              name="data"
              value={explanationData}
              onChange={handleInputData}
            />
          </div>

          {errorMessage && <div>Error: {errorMessage}</div>}

          <div>
            <button onClick={() => setData(convertFromString(explanationData))}>
              Display Data
            </button>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Settings</legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <input
              id="showBounds"
              name="showBounds"
              type="checkbox"
              value={showBounds.toString()}
              onChange={() => setShowBounds((p) => !p)}
            />
            <label htmlFor="showBounds">Show bounds</label>
          </div>

          <div>
            <input
              id="showWordBounds"
              name="showWordBounds"
              type="checkbox"
              value={showWordBounds.toString()}
              onChange={() => setShowWordBounds((p) => !p)}
            />
            <label htmlFor="showWordBounds">Show Word bounds</label>
          </div>

          <div>
            <button onClick={() => window.location.reload()}>Update</button>
          </div>
        </div>
      </fieldset>
      <Wordcloud
        data={data}
        showBounds={showBounds}
        showWordBounds={showWordBounds}
      />
    </div>
  );
};
export default App;

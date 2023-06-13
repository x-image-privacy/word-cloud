import { ChangeEventHandler, useState } from "react";
import Wordcloud, { ExplanationData } from "./WordCloud";
import { defaultWords1 } from "./data";

const presetData = [
  { label: "default1", value: defaultWords1 },
  {
    label: "single word",
    value: [
      {
        category: "cat2",
        words: [{ id: "2", text: "World", coef: 0.6 }],
      },
      {
        category: "cat1",
        words: [
          { id: "1", text: "Hello", coef: 1 },
          { id: "2", text: "CatWoman", coef: 0.8 },
        ],
      },
      {
        category: "cat3",
        words: [{ id: "3", text: "Helllo", coef: 0.55 }],
      },
    ],
  },
  { label: "empty", value: [{ category: "hello", words: [] }] },
];

const convertToString = (obj?: any): string => {
  return JSON.stringify(obj, null, 2);
};

const convertFromString = (obj?: any): any => {
  return JSON.parse(obj);
};

const updateParams = (params: { [key: string]: boolean | string }) => {
  const url = new URL(window.location.href);
  const queryString = new URLSearchParams(url.search);
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "boolean") {
      // when value is a boolean we add and remove the value from the url
      value ? queryString.set(key, "true") : queryString.delete(key);
    } else {
      // when value is a string we set it on the search
      queryString.set(key, value);
    }
  });
  url.search = queryString.toString();
  window.history.replaceState({}, "", url.toString());
};

const PRESET_DATA_KEY = "presetData";
const SHOW_BOUNDS_KEY = "showBounds";
const SHOW_WORD_BOUNDS_KEY = "showWordBounds";

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const [showBounds, setShowBounds] = useState(params.has(SHOW_BOUNDS_KEY));
  const [showWordBounds, setShowWordBounds] = useState(
    params.has(SHOW_WORD_BOUNDS_KEY)
  );
  const presetDataLabel = params.get(PRESET_DATA_KEY) ?? presetData[0].label;
  const [selectedPresetValue, setSelectedPresetValue] =
    useState(presetDataLabel);
  const [data, setData] = useState<ExplanationData>(
    (presetData.find((p) => p.label === presetDataLabel) ?? presetData[0]).value
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "12px",
        gap: "5px",
      }}
    >
      <fieldset>
        <legend>Data</legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label htmlFor="preset-data">Preset Data</label>
            <select
              value={selectedPresetValue}
              onChange={({ target: { value: chosenLabel } }) => {
                updateParams({ [PRESET_DATA_KEY]: chosenLabel });
                setSelectedPresetValue(chosenLabel);
                setExplanationData(
                  convertToString(
                    presetData.find((p) => p.label === chosenLabel)?.value
                  )
                );
              }}
            >
              {presetData.map((d) => (
                <option key={d.label} value={d.label}>
                  {d.label}
                </option>
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
              checked={showBounds}
              onChange={() => {
                // add params to url
                updateParams({ [SHOW_BOUNDS_KEY]: !showBounds });
                setShowBounds((p) => !p);
              }}
            />
            <label htmlFor="showBounds">Show bounds</label>
          </div>

          <div>
            <input
              id="showWordBounds"
              name="showWordBounds"
              type="checkbox"
              checked={showWordBounds}
              onChange={() => {
                updateParams({ [SHOW_WORD_BOUNDS_KEY]: !showWordBounds });

                setShowWordBounds((p) => !p);
              }}
            />
            <label htmlFor="showWordBounds">Show Word bounds</label>
          </div>

          <div>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      </fieldset>
      <div
        style={{
          resize: "both",
          overflow: "auto",
          border: "solid #eee 1px",
          maxWidth: "100vw",
          boxSizing: "border-box",
          backgroundColor: "aliceblue",
        }}
      >
        <Wordcloud
          data={data}
          height="100%"
          width="100%"
          showBounds={showBounds}
          showWordBounds={showWordBounds}
        />
      </div>
    </div>
  );
};
export default App;

import { ChangeEventHandler, useState } from "react";
import Wordcloud, { ExplanationData } from "./WordCloud";
import { defaultWords1 } from "./data";
import SettingsWrapper from "./components/SettingsWrapper";
import CheckBoxSetting from "./components/CheckBoxSetting";
import ExplanationDataImporter from "./components/ExplanationDataImporter";

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
      value ? queryString.set(key, "true") : queryString.set(key, "false");
    } else {
      // when value is a string we set it on the search
      queryString.set(key, value);
    }
  });
  url.search = queryString.toString();
  window.history.replaceState({}, "", url.toString());
};

const PRESET_DATA_KEY = "presetData";
const SHOW_WORDS_KEY = "showWords";
const SHOW_BOUNDS_KEY = "showBounds";
const SHOW_WORD_BOUNDS_KEY = "showWordBounds";
const SHOW_ORIGIN_KEY = "showOrigin";

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const [settings, setSettings] = useState({
    [SHOW_WORDS_KEY]: !params.has(SHOW_WORDS_KEY),
    [SHOW_ORIGIN_KEY]: params.has(SHOW_ORIGIN_KEY),
    [SHOW_BOUNDS_KEY]:
      params.has(SHOW_BOUNDS_KEY) && params.get(SHOW_BOUNDS_KEY) === "true",
    [SHOW_WORD_BOUNDS_KEY]: params.has(SHOW_WORD_BOUNDS_KEY),
  });

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

  const handleCheckbox = (key: keyof typeof settings) => {
    updateParams({ [key]: !settings[key] });
    setSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="flex flex-col m-2 gap-2">
      <div className="flex flex-row justify-center gap-2">
        <SettingsWrapper title="Data">
          <SettingsWrapper title="From Files">
            <ExplanationDataImporter
              onSubmit={(d) => setExplanationData(convertToString(d))}
            />
          </SettingsWrapper>
          <SettingsWrapper title="From Presets">
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

            {errorMessage ? <div>Error: {errorMessage}</div> : null}
          </SettingsWrapper>
          <div className="flex grow justify-end">
            <button
              className="btn btn-blue self-end"
              onClick={() => setData(convertFromString(explanationData))}
            >
              Display Data
            </button>
          </div>
        </SettingsWrapper>
        <SettingsWrapper title="Settings">
          <CheckBoxSetting
            id={SHOW_WORDS_KEY}
            value={settings[SHOW_WORDS_KEY]}
            label="Show words"
            onChange={() => handleCheckbox(SHOW_WORDS_KEY)}
          />
          <CheckBoxSetting
            id={SHOW_BOUNDS_KEY}
            value={settings[SHOW_BOUNDS_KEY]}
            label="Show bounds"
            onChange={() => handleCheckbox(SHOW_BOUNDS_KEY)}
          />

          <CheckBoxSetting
            id={SHOW_WORD_BOUNDS_KEY}
            value={settings[SHOW_WORD_BOUNDS_KEY]}
            onChange={() => handleCheckbox(SHOW_WORD_BOUNDS_KEY)}
            label="Show word bounds"
          />
          <CheckBoxSetting
            id={SHOW_ORIGIN_KEY}
            value={settings[SHOW_ORIGIN_KEY]}
            onChange={() => handleCheckbox(SHOW_ORIGIN_KEY)}
            label="Show origin"
          />

          <div className="flex grow justify-end">
            <button
              className="btn btn-blue self-end"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </SettingsWrapper>
      </div>
      <div className="resize box-border overflow-auto border border-gray-300 max-w-screen m-auto bg-blue-50 dark:bg-blue-900">
        <Wordcloud
          data={data}
          height="100%"
          width="100%"
          showWords={settings[SHOW_WORDS_KEY]}
          showOrigin={settings[SHOW_ORIGIN_KEY]}
          showBounds={settings[SHOW_BOUNDS_KEY]}
          showWordBounds={settings[SHOW_WORD_BOUNDS_KEY]}
        />
      </div>
    </div>
  );
};
export default App;

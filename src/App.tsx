import { useState } from "react";
import Wordcloud from "./Wordcloud";
import { defaultWords1 } from "./data";

const App = () => {
  const [showBounds, setShowBounds] = useState(false);
  const [showWordBounds, setShowWordBounds] = useState(false);

  return (
    <div style={{ flexDirection: "column", alignItems: "center" }}>
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
        data={defaultWords1}
        showBounds={showBounds}
        showWordBounds={showWordBounds}
      />
    </div>
  );
};
export default App;

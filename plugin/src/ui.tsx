//@ts-nocheck

import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const [rectCount, setRectCount] = React.useState(5);

  const onCreate = (element: HTMLElement) => {
    const count = parseInt(rectCount, 10);
    parent.postMessage(
      { pluginMessage: { type: 'create-rectangles', count } },
      '*'
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  return (
    <div>
      <img src={require('./logo.svg')} />
      <h2>Rectangle Creators</h2>
      <p>
        Count:
        <input
          value={rectCount}
          onChange={(e) => setRectCount(e.target.valueAsNumber)}
        />
      </p>
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-root'));

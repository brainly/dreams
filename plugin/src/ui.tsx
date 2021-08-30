//@ts-nocheck

import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const [rectCount, setRectCount] = React.useState(5);

  const onCreate = (element: HTMLElement) => {
    parent.postMessage({ pluginMessage: { type: 'import' } }, '*');
  };

  return (
    <div>
      <h2>Brainly Dreams</h2>
      <p>Open exported json figma file.</p>
      <button onClick={onCreate}>Open file</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-root'));

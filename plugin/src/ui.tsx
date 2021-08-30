//@ts-nocheck

import * as React from 'react';
import * as ReactDOM from 'react-dom';

console.log(document.domain);
const App = () => {
  const [rectCount, setRectCount] = React.useState(5);

  const onCreate = (element: HTMLElement) => {
    // create file dialog
    const fileDialog = document.createElement('input');
    fileDialog.type = 'file';
    document.body.appendChild(fileDialog);
    fileDialog.style.display = 'none';
    fileDialog.click();

    fileDialog.addEventListener('change', (e) => {
      console.log(fileDialog.files);

      document.body.removeChild(fileDialog);
    });

    window.addEventListener(
      'focus',
      () => {
        if (!fileDialog.files || fileDialog.files.length === 0) {
          document.body.removeChild(fileDialog);
        }
      },
      { once: true }
    );

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

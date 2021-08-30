//@ts-nocheck

import * as React from 'react';
import * as ReactDOM from 'react-dom';

function readTextFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(reader.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file);
  });
}

const App = () => {
  const handleImport = (element: HTMLElement) => {
    // create file dialog
    const fileDialog = document.createElement('input');
    fileDialog.type = 'file';
    document.body.appendChild(fileDialog);
    fileDialog.style.display = 'none';
    fileDialog.click();

    fileDialog.addEventListener('change', async () => {
      console.log('change', fileDialog.files);

      try {
        const text = await readTextFile(fileDialog.files[0]);
        const json = JSON.parse(text);
        parent.postMessage({ pluginMessage: { type: 'import', json } }, '*');
      } catch (e) {
        console.error(e);
      }

      document.body.removeChild(fileDialog);
    });

    window.addEventListener(
      'focus',
      () => {
        setTimeout(() => {
          if (!fileDialog.files || fileDialog.files.length === 0) {
            document.body.removeChild(fileDialog);
          }
        }, 500);
      },
      { once: true }
    );
  };

  const handleClear = () => {
    parent.postMessage({ pluginMessage: { type: 'clear' } }, '*');
  };

  return (
    <div>
      <h2>Brainly Dreams</h2>
      <p>Open exported json figma file.</p>
      <button onClick={handleImport}>Import file</button>
      <button onClick={handleClear}>Clear document</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-root'));

//@ts-nocheck
import 'regenerator-runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { decodeBase64, encode } from './canvas';

import '../styles/global.css';

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

async function createImageFromString(data: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = await decodeBase64(canvas, ctx, data);
  const bytes = await encode(canvas, ctx, imageData);
  return bytes;
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

  React.useEffect(() => {
    async function messageHandler(e) {
      const { pluginMessage } = e.data;
      if (pluginMessage) {
        switch (pluginMessage.type) {
          case 'createImageFromString':
            const imageData = await createImageFromString(pluginMessage.data);
            parent.postMessage(
              { pluginMessage: { type: 'createImageFromString', imageData } },
              '*'
            );
            break;
          default:
            throw new Error(`Unknown message type: ${pluginMessage.type}`);
            break;
        }
      }
    }
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  });

  return (
    <div className="font-sans text-ui11">
      <h2 className="bg-black h-[152px] flex justify-center items-center text-white uppercase text-xs tracking-wider">
        Dreams
      </h2>
      <div className="py-2">
        <div className="grid grid-cols-components px-2 items-center relative h-8">
          <div className="col-span-full flex justify-between w-full h-8">
            <div className="pl-2 flex items-center font-semibold">Import</div>
            <button onClick={handleClear}>Clear document</button>
          </div>
        </div>
        <div className="grid grid-cols-components px-2 items-center relative h-8 my-2">
          <button
            className="col-span-26 col-start-2 h-8 border border-b border-black rounded-md"
            onClick={handleImport}
          >
            Import file
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-root'));

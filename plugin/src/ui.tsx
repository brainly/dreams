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
      <h2 className="bg-black h-[152px] flex justify-center items-center text-white text-xs tracking-wider relative">
        <span className="uppercase">Dreams</span>
        <span className="absolute left-0 bottom-4 right-0 flex justify-center text-ui11 text-white text-opacity-30">
          created with ❤️ by coderitual
        </span>
      </h2>
      <div className="py-2">
        <div className="grid grid-cols-components px-2 items-center relative h-8">
          <div className="col-span-full flex justify-between w-full h-8">
            <div className="pl-2 flex items-center font-semibold">Import</div>
            <button
              className="w-8 h-8 flex justify-center items-center rounded-3 hover:bg-black hover:bg-opacity-5 active:border-blue active:border-2"
              onClick={handleClear}
              aria-label="Refresh / Clean document"
            >
              <svg
                role="img"
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14 3.18765L12.8253 4.65603C12.8172 4.60387 12.8084 4.55185 12.7988 4.5C12.6473 3.68064 12.3107 2.90189 11.8094 2.22539C11.1073 1.27797 10.1193 0.581275 8.99113 0.238084C7.86297 -0.105107 6.65438 -0.0766253 5.54364 0.319329C4.75053 0.602055 4.03729 1.06145 3.45517 1.65764C3.22204 1.8964 3.00994 2.1571 2.82216 2.43718L2.8223 2.43728L3.65275 2.99406L3.6529 2.99416C4.19015 2.19282 4.97073 1.58538 5.87948 1.26143C6.78823 0.937481 7.77704 0.914179 8.70005 1.19496C9.62305 1.47574 10.4314 2.04574 11.0058 2.82088C11.4905 3.47502 11.787 4.24603 11.8678 5.05063L9.66778 3.58398L9.11308 4.41603L12.1131 6.41603L12.4945 6.6703L12.7809 6.31235L14.7809 3.81235L14 3.18765ZM2 4.68765L0 7.18765L0.780869 7.81235L1.95557 6.34397C1.96367 6.39614 1.97251 6.44815 1.9821 6.5C2.13361 7.31936 2.47019 8.09811 2.97151 8.77461C3.67359 9.72203 4.66158 10.4187 5.78973 10.7619C6.91789 11.1051 8.12649 11.0766 9.23723 10.6807C10.0303 10.3979 10.7436 9.93855 11.3257 9.34237C11.5583 9.10409 11.7701 8.84398 11.9575 8.56455L11.9587 8.56282L11.9586 8.56272L11.1281 8.00594L11.128 8.00585L11.1269 8.00741C10.5897 8.80797 9.80955 9.41483 8.90139 9.73857C7.99263 10.0625 7.00383 10.0858 6.08082 9.80504C5.15782 9.52426 4.34949 8.95426 3.77509 8.17912C3.29034 7.52498 2.99384 6.75397 2.9131 5.94937L5.11308 7.41603L5.66778 6.58398L2.66778 4.58398L2.28637 4.3297L2 4.68765Z"
                  fill="black"
                  fill-opacity="0.8"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-components px-2 items-center relative h-8 my-2">
          <button
            className="col-span-26 col-start-2 px-[11px] h-8 border border-b border-black rounded-md active:border-blue active:border-2"
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

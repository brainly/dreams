import { render } from '@packages/renderer';
import { deprecate } from './commands/deprecate';

figma.on('run', ({ command, parameters }: RunEvent) => {
  switch (command) {
    case 'ui': {
      figma.showUI(__html__, {
        width: 240,
        height: 248,
      });
      return;
    }
    case 'deprecate': {
      deprecate();
      break;
    }
  }

  figma.closePlugin();
});

figma.parameters.on('input', ({ query, result }) => {
  console.log('Received input', query, result);
  result.setSuggestions(
    ['Armadillo', 'Baboon', 'Cacatua', 'Dolphin'].filter((s) =>
      s.includes(query)
    )
  );
});

async function importJson(json: unknown) {
  console.log('Import json');
  const { cancel } = figma.notify('Importing components', {
    timeout: Infinity,
  });
  await render(json);
  cancel();
  figma.notify('Finished importing components');
}

function clear() {
  figma.root.children.forEach((page) => {
    if (page !== figma.currentPage) {
      page.remove();
    } else {
      page.children.forEach((child) => {
        child.remove();
      });
      page.name = 'Page 1';
    }
  });
}

figma.ui.on('message', (msg, props) => {
  console.log(msg, props);
  switch (msg.type) {
    case 'import': {
      importJson(msg.json);
      break;
    }
    case 'clear': {
      clear();
      break;
    }

    default:
      break;
  }
});

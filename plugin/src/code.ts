import { render } from '@packages/renderer';

figma.showUI(__html__, {
  width: 240,
  height: 248,
});

function importJson(json: unknown) {
  console.log('Import json');
  render(json);
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

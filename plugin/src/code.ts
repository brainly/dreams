import { render } from '@packages/renderer';

figma.showUI(__html__);

function importJson(json: unknown) {
  console.log('Import json');
  render(json);
}

function clear() {
  figma.root.children.forEach((child) => {
    if (child !== figma.currentPage) {
      child.remove();
    } else {
      child.children.forEach((child) => {
        child.remove();
      });
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

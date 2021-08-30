import { render } from './render';

figma.showUI(__html__);

function importJson(json: unknown) {
  console.log('Import json');
  render(json);
}

figma.ui.on('message', (msg, props) => {
  console.log(msg, props);
  switch (msg.type) {
    case 'import': {
      importJson(msg.json);
      break;
    }
    case 'clear': {
      figma.root.children.forEach((child) => {
        if (child !== figma.currentPage) {
          child.remove();
        } else {
          child.children.forEach((child) => {
            child.remove();
          });
        }
      });
      break;
    }

    default:
      break;
  }
});

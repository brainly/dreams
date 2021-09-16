import {
  createSceneNodeFromElement,
  createDocument,
  createPage,
  createFrame,
} from '@packages/core';
import 'regenerator-runtime';

function bemClassToText(bemClass) {
  return bemClass.replace('sg-', '').replace('-', ' ');
}

function buildNameFromBEM(classes) {
  const mainClass = classes[0];

  if (mainClass) {
    // if node is an element (bEm)
    if (mainClass.indexOf('__') > -1) {
      return mainClass.replace(/^[a-z-]+__/, '');
    } else {
      // if node is a block (Bem)
      return bemClassToText(mainClass);
    }
  }

  return 'text';
}

export async function getFigmaDocument() {
  const stylesheet = document.querySelector<HTMLAnchorElement>('head > link');
  let styleGuideVersion = '';

  if (stylesheet) {
    styleGuideVersion =
      stylesheet.href.match(/\/([0-9]+\.[0-9]+\.[0-9]+)\//)?.[1] ?? '';
  }

  const figmaDocument = createDocument();
  const page = createPage();

  figmaDocument.appendChild(page);
  page.name = `Brainly Pencil - Style Guide ${styleGuideVersion}`;

  Array.from(
    document.querySelectorAll<HTMLElement>(
      'section > .item, section > .inline-item'
    )
  )
    .map(async (metaNode) => {
      const componentNode = metaNode.firstChild as Element;
      const name = metaNode.title;
      const {
        left: x,
        top: y,
        width,
        height,
      } = componentNode.getBoundingClientRect();

      const frame = await createSceneNodeFromElement(componentNode);
      if (!frame) {
        return;
      }
      frame.x = x;
      frame.y = y;
      frame.width = width;
      frame.height = height;

      frame.id = name;
      frame.name = name;

      const parentAndChildren = [
        // @ts-ignore
        ...componentNode.querySelectorAll('*'),
      ];

      Array.from(parentAndChildren)
        .map(async (node) => {
          const scene = await createSceneNodeFromElement(node);
          //scene.name = buildNameFromBEM(node.classList);
          return scene;
        })
        .forEach(async (scene) => frame.appendChild(await scene));

      return frame;
    })
    .forEach(async (frame) => page.appendChild(await frame));

  return figmaDocument.toJSON();
}

import 'regenerator-runtime';
import {
  createSceneNodeFromElement,
  createDocument,
  createPage,
} from '@packages/core';

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

  const metaNodes = Array.from(
    document.querySelectorAll<HTMLElement>(
      'section > .item, section > .inline-item'
    )
  );

  for (const metaNode of metaNodes) {
    const componentNode = metaNode.firstChild as Element;
    const name = metaNode.title;
    const {
      left: x,
      top: y,
      width,
      height,
    } = componentNode.getBoundingClientRect();

    const component = await createSceneNodeFromElement(componentNode, {
      component: true,
    });
    if (!component) {
      return;
    }
    component.x = x;
    component.y = y;
    component.width = width;
    component.height = height;

    component.id = name;
    component.name = name;

    const componentChildren = [
      // @ts-ignore
      ...componentNode.querySelectorAll('*'),
    ];

    for (const node of componentChildren) {
      const scene = await createSceneNodeFromElement(node);
      //scene.name = buildNameFromBEM(node.classList);
      component.appendChild(scene);
    }

    page.appendChild(component);
  }

  return figmaDocument.toJSON();
}

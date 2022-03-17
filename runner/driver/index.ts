import 'regenerator-runtime';
import {
  sceneNodeFromDOM,
  createDocument,
  createPage,
  createComponentSet,
  ComponentNode,
} from '@packages/core';

function bemClassToText(bemClass) {
  return bemClass.replace('sg-', '').replace('-', ' ');
}

function getPropertiesString(object) {
  return Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join(', ');
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
  const pageNode = createPage();

  figmaDocument.appendChild(pageNode);
  pageNode.name = `Brainly Pencil - Style Guide ${styleGuideVersion}`;

  const metaNodes = Array.from(
    document.querySelectorAll<HTMLElement>(
      'section > .item, section > .inline-item'
    )
  );

  const componentSetMap = new Map();

  for (const metaNode of metaNodes) {
    const componentMetaNode = metaNode.firstChild as Element;
    const name = metaNode.title;
    const componentSetName = metaNode.dataset.component;

    const {
      left: x,
      top: y,
      width,
      height,
    } = componentMetaNode.getBoundingClientRect();

    const componentNode: ComponentNode = (await sceneNodeFromDOM(
      componentMetaNode,
      'COMPONENT'
    )) as ComponentNode;

    if (!componentNode) {
      return;
    }
    componentNode.x = x;
    componentNode.y = y;
    componentNode.width = width;
    componentNode.height = height;

    componentNode.id = name;
    componentNode.name = name;

    const componentMetaChildren = [
      // @ts-ignore
      ...componentMetaNode.querySelectorAll('*'),
    ];

    for (const node of componentMetaChildren) {
      const sceneNode = await sceneNodeFromDOM(node);
      //scene.name = buildNameFromBEM(node.classList);
      componentNode.appendChild(sceneNode);
    }

    if (componentSetName) {
      const componentProperties = JSON.parse(
        metaNode.dataset.properties ?? 'null'
      );
      componentNode.variantProperties = componentProperties;

      if (!componentSetMap.has(componentSetName)) {
        const componentSetNode = createComponentSet();
        componentSetNode.name = componentSetName;

        pageNode.appendChild(componentSetNode);
        componentSetMap.set(componentSetName, componentSetNode);
      }

      const componentSetNode = componentSetMap.get(componentSetName);
      componentSetNode.appendChild(componentNode);
    } else {
      pageNode.appendChild(componentNode);
    }
  }

  return figmaDocument.toJSON();
}

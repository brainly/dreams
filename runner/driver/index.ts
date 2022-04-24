import 'regenerator-runtime';
import {
  sceneNodeFromDOM,
  createDocument,
  createPage,
  createComponentSet,
  ComponentNode,
} from '@packages/core';
import { SceneNode } from '@packages/core/dist/nodes/scene';

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
  const page = createPage();

  figmaDocument.appendChild(page);
  page.name = `Brainly Pencil - Style Guide ${styleGuideVersion}`;

  const icons: { type: string; size: number; component: ComponentNode }[] = [];
  const variants = new Map();

  const metaNodes = Array.from(
    document.querySelectorAll<HTMLElement>(
      'section > .item, section > .inline-item'
    )
  );

  for (const metaNode of metaNodes) {
    const componentNode = metaNode.firstChild as Element;
    const name = metaNode.title;
    const variantsName = metaNode.dataset.component;

    const {
      left: x,
      top: y,
      width,
      height,
    } = componentNode.getBoundingClientRect();

    const component: ComponentNode = (await sceneNodeFromDOM(
      componentNode,
      'COMPONENT'
    )) as ComponentNode;

    if (!component) {
      continue;
    }

    component.x = x;
    component.y = y;
    component.width = width;
    component.height = height;
    component.name = name;

    // Creating content of a component from its children
    const children = Array.from(componentNode.querySelectorAll('*'));
    for (const element of children) {
      let scene: SceneNode = await sceneNodeFromDOM(element, 'FRAME', true);

      // Replacing scene nodes with instances of nested components
      // Button
      // ---
      if (component.name.startsWith('Button/') && node?.type === 'SVG') {
        const type = element.children[0].id;
        const icon = icons.find((icon) => icon.type === type);
        if (icon) {
          scene = icon.component.createInstance();
        }
      }

      component.appendChild(scene);
    }

    // Components that are part of other components
    // Icon
    // ---
    if (component.name.startsWith('Icon/')) {
      const [, group, type, size] = component.name.split('/');
      icons.push({
        type: `icon-${type}`,
        size: parseInt(size, 10),
        component,
      });
    }

    // Adding component to component set when variantsName is defined.
    // The component set is created lazily for the first variants name found.
    // This way we don't need an extra html container for variants,
    // and each component can define the set it belongs to using data attributes.
    if (variantsName) {
      const componentProperties = JSON.parse(
        metaNode.dataset.properties ?? 'null'
      );
      component.variantProperties = componentProperties;

      if (!variants.has(variantsName)) {
        const componentSetNode = createComponentSet();
        componentSetNode.name = variantsName;

        page.appendChild(componentSetNode);
        variants.set(variantsName, componentSetNode);
      }

      const componentSetNode = variants.get(variantsName);
      componentSetNode.appendChild(component);
    } else {
      page.appendChild(component);
    }
  }

  return figmaDocument.toJSON();
}

import 'regenerator-runtime';
import {
  sceneNodeFromDOM,
  createDocument,
  createPage,
  createComponentSet,
  ComponentNode,
  InstanceNode,
  SvgNode,
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
    const element = metaNode.firstChild as Element;
    const name = metaNode.title;
    const variantsName = metaNode.dataset.component;

    const { left: x, top: y, width, height } = element.getBoundingClientRect();

    const component: ComponentNode = (await sceneNodeFromDOM(
      element,
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
    component.version = styleGuideVersion;

    // Creating content of a component from its children
    const children = Array.from(element.querySelectorAll('*'));
    for (const child of children) {
      let scene = await sceneNodeFromDOM(child, 'FRAME', true);

      // Replacing scene nodes with instances of nested components
      // Button
      // ---
      if (component.name.startsWith('button/') && scene?.type === 'SVG') {
        const type = child.querySelector('svg')?.id;
        const size = child.clientHeight;
        const icon = icons.find(
          (icon) => icon.type === type && icon.size === size
        );

        if (icon) {
          console.log('Replacing SVG with instance of component', icon);
          const instance: InstanceNode = icon.component.createInstance();
          instance.applyOverrides(scene);

          // This specific ovveride is caused by the  way SVGs
          // are handled in plugin (mergin invisible parent frames into one).
          const svg = instance.findOne(
            (node) => node.type === 'SVG'
          ) as SvgNode;
          if (svg) {
            svg.content = (scene as SvgNode).content;
          }

          // Applying consitend name to the instance
          // to satisfy overriding mechanism inside figma
          instance.name = 'Icon';
          scene = instance;
        }
      }

      component.appendChild(scene);
    }

    // Components that are part of other components
    // Icon
    // ---
    if (component.name.startsWith('icon/')) {
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
        componentSetNode.version = styleGuideVersion;

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

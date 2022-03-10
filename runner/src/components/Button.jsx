import React from 'react';
import Button, {
  BUTTON_TYPE,
  BUTTON_SIZE,
} from 'brainly-style-guide/src/components/buttons/Button';
import Icon from 'brainly-style-guide/src/components/icons/Icon';
import { getValues } from '../utils/getValues';

const noToggleTypes = [
  'solid',
  'solid-inverted',
  'solid-blue',
  'solid-mint',
  'transparent-inverted',
  'facebook',
];

// Limit scope to only one button type
// filter BUTTON_TYPE object and leave only solid-blue
// TODO: use all types after initial phase
const BUTTON_TYPE_ONLY = Object.keys(BUTTON_TYPE)
  .filter((key) => BUTTON_TYPE[key] === 'solid-blue')
  .reduce((acc, val) => ({ ...acc, [val]: BUTTON_TYPE[val] }), {});

const ButtonsPage = () => {
  const buttonsVariations = [];

  getValues(BUTTON_TYPE_ONLY, false).forEach((type) => {
    getValues(BUTTON_SIZE, false).forEach((size) => {
      [null, 'peach', 'mustard', 'blue', 'default'].forEach((toggle) => {
        [false, true].forEach((disabled) => {
          [false, true, 'reversed-order', 'icon-only'].forEach((icon) => {
            if (
              (toggle && noToggleTypes.includes(type)) ||
              (toggle === 'peach' && type === 'transparent-mustard') ||
              (toggle === 'blue' && type === 'transparent-mustard') ||
              (toggle === 'default' && type === 'transparent-mustard') ||
              (toggle === 'mustard' && type === 'transparent-peach') ||
              (toggle === 'blue' && type === 'transparent-peach') ||
              (toggle === 'default' && type === 'transparent-peach') ||
              (toggle === 'mustard' && type === 'transparent-blue') ||
              (toggle === 'peach' && type === 'transparent-blue') ||
              (toggle === 'default' && type === 'transparent-blue') ||
              (toggle === 'default' && !icon)
            ) {
              return;
            }

            if (icon === 'iconOnly' && !icon) {
              return;
            }

            let iconSize;

            if (size === 'l') {
              iconSize = 32;
            } else if (size === 's') {
              iconSize = 16;
            } else {
              iconSize = 24;
            }

            let togglableName;

            if (noToggleTypes.includes(type) && !toggle) {
              togglableName = '';
            } else {
              togglableName = `${toggle ? `toggle-${toggle}` : '_default'}/`;
            }

            let iconVariant;

            if (icon === 'reversed-order') {
              iconVariant = 'icon_right';
            } else if (icon === 'icon-only') {
              iconVariant = 'icon_only';
            } else if (icon) {
              iconVariant = 'icon_left';
            } else {
              iconVariant = 'default';
            }

            const name = `button/${type}/${size}/${iconVariant}/${togglableName}${
              disabled ? 'disabled' : '_default'
            }`;

            // Variants specific properties
            const component = `button/${type}`;
            const properties = {
              size,
              state: disabled ? 'disabled' : 'default',
              icon: iconVariant,
            };

            buttonsVariations.push(
              <div
                title={name}
                data-component={component}
                data-properties={JSON.stringify(properties)}
                className="inline-item"
              >
                <Button
                  icon={
                    icon ? (
                      <Icon
                        type={toggle ? 'heart' : 'heart_outlined'}
                        color="adaptive"
                        size={iconSize}
                      />
                    ) : null
                  }
                  toggle={toggle}
                  type={type}
                  size={size}
                  disabled={disabled}
                  iconOnly={icon === 'icon-only'}
                  reversedOrder={icon === 'reversed-order'}
                >
                  Button
                </Button>
              </div>
            );
          });

          buttonsVariations.push(<br />);
        });
      });
    });
  });

  return <section>{buttonsVariations}</section>;
};

export default ButtonsPage;

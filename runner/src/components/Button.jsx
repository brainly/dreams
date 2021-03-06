import React from 'react';
import Button, {
  BUTTON_TYPE,
  BUTTON_SIZE,
} from 'brainly-style-guide/src/components/buttons/Button';
import Icon from 'brainly-style-guide/src/components/icons/Icon';
import { getValues } from '../utils/getValues';
import { TYPE as ICON_TYPE } from 'brainly-style-guide/src/components/icons/Icon';

const noToggleTypes = [
  'solid',
  'solid-inverted',
  'solid-indigo',
  'solid-indigo-inverted',
  'facebook',
  'google',
  'apple',
];

// Limit scope to only one button type
// filter BUTTON_TYPE object and leave only solid-blue
// TODO: use all types after initial phase
const BUTTON_TYPE_ONLY = Object.keys(BUTTON_TYPE)
  .filter((key) => BUTTON_TYPE[key] === 'outline')
  .reduce((acc, val) => ({ ...acc, [val]: BUTTON_TYPE[val] }), {});

const ButtonsPage = () => {
  const buttonsVariations = [];

  getValues(BUTTON_TYPE, false).forEach((type) => {
    getValues(BUTTON_SIZE, false).forEach((size) => {
      [null, 'red', 'yellow', 'default'].forEach((toggle) => {
        [false, true].forEach((disabled) => {
          [false, true, 'reversed-order', 'icon-only'].forEach((icon) => {
            if (
              (toggle && noToggleTypes.includes(type)) ||
              (toggle === 'yellow' && type === 'outline-indigo') ||
              (toggle === 'red' && type === 'outline-indigo') ||
              (toggle === 'yellow' && type === 'outline-inverted') ||
              (toggle === 'red' && type === 'outline-inverted') ||
              (toggle === 'yellow' && type === 'transparent-red') ||
              (toggle === 'red' && type === 'transparent-red') ||
              (toggle === 'yellow' && type === 'transparent-inverted') ||
              (toggle === 'red' && type === 'transparent-inverted') ||
              (toggle && !icon)
            ) {
              return;
            }

            if (icon === 'iconOnly' && !icon) {
              return;
            }

            let iconType = toggle ? 'heart' : 'heart_outlined';

            if (type === BUTTON_TYPE.APPLE) {
              iconType = ICON_TYPE.APPLE;
            } else if (type === BUTTON_TYPE.GOOGLE) {
              iconType = ICON_TYPE.GOOGLE;
            } else if (type === BUTTON_TYPE.FACEBOOK) {
              iconType = ICON_TYPE.FACEBOOK;
            }

            let iconSize;

            if (size === 'l') {
              iconSize = 32;
            } else if (size === 's') {
              iconSize = 16;
            } else {
              iconSize = 24;
            }

            // Be careful here
            let togglableName;
            if (!noToggleTypes.includes(type)) {
              togglableName = toggle;

              if (toggle === null) {
                togglableName = '-';
              } else if (toggle === 'default') {
                if (type === BUTTON_TYPE.TRANSPARENT_LIGHT) {
                  togglableName = 'gray';
                } else {
                  togglableName = 'black';
                }
              }

              if (
                type === BUTTON_TYPE.OUTLINE_INDIGO ||
                type === BUTTON_TYPE.OUTLINE_INVERTED ||
                type === BUTTON_TYPE.TRANSPARENT_RED ||
                type === BUTTON_TYPE.TRANSPARENT_INVERTED
              ) {
                togglableName = toggle ? 'on' : 'off';
              }
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

            const name = `button/${type}/${size}/${iconVariant}/${
              togglableName ? `${togglableName}/` : ''
            }${disabled ? 'disabled' : '_default'}`;

            // Variants specific properties
            const component = `button/${type}`;
            const properties = {
              size,
              icon: iconVariant,
              state: disabled ? 'disabled' : 'default',
              toggle: togglableName,
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
                      <Icon type={iconType} color="adaptive" size={iconSize} />
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

  return <section style={{}}>{buttonsVariations}</section>;
};

export default ButtonsPage;

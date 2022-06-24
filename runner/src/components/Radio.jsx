import React from 'react';
import { Radio } from 'brainly-style-guide';
import { getValues } from '../utils/getValues';

const RadioPage = () => {
  const RadioVariations = [];

  [false, true].forEach((checked) => {
    if (checked === false) {
      name += '_default_';
    } else {
      name += 'checked';
    }

    RadioVariations.push(
      <div title={name} className="inline-item">
        <Radio onChange={() => {}} checked={checked} />
      </div>
    );
    RadioVariations.push(<br />);
  });

  return <section>{RadioVariations}</section>;
};

export default RadioPage;

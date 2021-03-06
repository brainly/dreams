import React from 'react';
import ColorMasksPage from './components/ColorMasks.jsx';
import TextPage from './components/Text.jsx';
import AvatarsPage from './components/Avatar.jsx';
import ButtonsPage from './components/Button.jsx';
import InputsPage from './components/Input.jsx';
import SelectsPage from './components/Select.jsx';
import TextareasPage from './components/Textarea.jsx';
import CheckboxesPage from './components/Checkbox.jsx';
import CountersPage from './components/Counter.jsx';
import RadioPage from './components/Radio.jsx';
import ColorsPage from './components/Color.jsx';
import IconsPage from './components/Icon.jsx';
import LabelsPage from './components/Label.jsx';
import SubjectIconsPage from './components/SubjectIcon.jsx';
import MathSymbolsPage from './components/MathSymbol.jsx';
import ListsPage from './components/List';
import DropdownsPage from './components/Dropdown';
import FlashMessagesPage from './components/FlashMessage';
import SearchPage from './components/Search';
import BoxesPage from './components/Box';
import BubblesPage from './components/Bubble';
import RatingPage from './components/Rating';
import LogoPage from './components/Logo';

import './styles/app.css';

const FixesLoader = React.lazy(() => import('./fixes/FixesLoader'));

const App = () => (
  <div>
    <CheckboxesPage />

    {/* 
    <ColorMasksPage />
    <LogoPage />
    <AvatarsPage />
    <BoxesPage />
    <BubblesPage />
    <ButtonsPage />
    <CheckboxesPage />
    <CountersPage />
    <DropdownsPage />
    <FlashMessagesPage />
    <InputsPage />
    <ListsPage />
    <MathSymbolsPage />
    <RadioPage />
    <RatingPage />
    <SearchPage />
    <SelectsPage />
    <SubjectIconsPage />
    <TextareasPage />
    <LabelsPage />

    <TextPage />
    <ColorsPage /> 
    */}

    <React.Suspense fallback={<div>Loading fixes...</div>}>
      <FixesLoader />
    </React.Suspense>
  </div>
);

export default App;

import React from 'react';
import SideBar from './components/SideBar/SideBar';
import MainContent from './components/MainContent';

import { useState } from 'react';
import Stack from 'react-bootstrap/Stack';

const App = props => {
  const [showSideBar, setShowSideBar] = useState(true);

  const handleToggleSideBar = () => {
    if (showSideBar) {
      setShowSideBar(false);
      return;
    }
    setShowSideBar(true);
  };

  return (
    <React.Fragment>
      <Stack direction='horizontal'>
        <SideBar show={showSideBar} />
        <MainContent toggleSideBar={handleToggleSideBar} sideBar={showSideBar} />
      </Stack>
    </React.Fragment>
  );
};

export default App;

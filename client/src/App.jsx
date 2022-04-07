import React, {Fragment} from 'react';
import Canvas from './components/Canvas/Canvas';
import Toolbar from './components/Toolbar/Toolbar';
import SettingBar from './components/SettingBar/SettingBar';
import "./styles/app.scss";
import {BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom'

const App = () => {
  return (
      <Router>
        <Fragment>
          <div className="app">
              <Routes>
                  <Route path='/:id' element={
                    <>
                      <Toolbar/>
                      <SettingBar/>
                      <Canvas/> 
                    </>
                  } />
                    
                  <Route path='/' element={<Navigate to={`f${(+new Date()).toString(16)}`}/>} />
              </Routes>
          </div>
        </Fragment>
      </Router>
  );
};

export default App;

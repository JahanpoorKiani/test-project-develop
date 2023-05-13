import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginView from './LoginView';
import MapView from "./MapView";


const App = () => (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginView />} />
        <Route path="/MapView" element={<MapView />} />
      </Routes>
    </Router>
);

export default App;

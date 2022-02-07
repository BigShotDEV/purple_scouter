import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";import reportWebVitals from './reportWebVitals';
import auth from "./Utils/authentication"

import './App.css';
import RootRoute from './routes/root';
import LoginRoute from './routes/login';
import StatsRoute from './routes/stats';
import CreateFormRoute from './routes/create-form';
import TeamStatsPage from './Componenets/TeamsStats/TeamsStats/teamStatsPage';

ReactDOM.render(
  <BrowserRouter>
     <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginRoute/>} />
      <Route path="/stats" element={<StatsRoute/>} />
      <Route path="/stats/teams/:team" element={<TeamStatsPage/>} />
      <Route path="/create-form" element={<CreateFormRoute/>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

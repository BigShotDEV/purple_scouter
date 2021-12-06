import React from 'react';
import './App.css';
import CheckBox from './Componenets/CheckBox/check-box';

export default class App extends React.Component{
  render() {
    return (
    <div className="app">
      <CheckBox keys={["whoami", "The coolest man on earth", "whoareyou", "who are we"]}>This is the checkbox test.</CheckBox>
    </div>
      );
  }
}
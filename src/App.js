import React from 'react';
import './App.css';
import CheckBox from './Componenets/CheckBox/check-box';
import RadioBox from './Componenets/RadioBox/radio-box';
import TextBox from './Componenets/TextBox/text-box';

export default class App extends React.Component{
  render() {
    return (
    <div className="app">
      <CheckBox keys={["whoami", "The coolest man on earth", "whoareyou", "who are we"]}>This is the checkbox test.</CheckBox>
      <RadioBox keys={["whoami", "The coolest man on earth", "whoareyou", "who are we"]}>This is the radiobox test.</RadioBox>
      <TextBox>This is the Textbox test.</TextBox>
    </div>
      );
  }
}
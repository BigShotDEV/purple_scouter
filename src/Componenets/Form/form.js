import React from 'react';
import CheckBox from '../CheckBox/check-box';
import RadioBox from '../RadioBox/radio-box';
import SubmitButton from '../SubmitButton/submit-button';
import TextBox from '../TextBox/text-box';

/**
 * This Componenet handles all about the form.
 * 
 */
export default class Form extends React.Component {
    render() {
        return (
            <div className="form">
                <CheckBox keys={["whoami", "The coolest man on earth", "whoareyou", "who are we"]}>This is the checkbox test.</CheckBox>
                <RadioBox keys={["whoami", "The coolest man on earth", "whoareyou", "who are we"]}>This is the radiobox test.</RadioBox>
                <TextBox>This is the Textbox test.</TextBox>
                <SubmitButton>Submit Button</SubmitButton>
            </div>         
        );
    }
}
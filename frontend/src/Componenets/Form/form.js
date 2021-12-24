import React from 'react';
import { API } from '../../Utils/authentication';
import CheckBox from './CheckBox/check-box';
import RadioBox from './RadioBox/radio-box';
import SubmitButton from './SubmitButton/submit-button';
import TextBox from './TextBox/text-box';
import './form.css';

/**
 * This Componenet handles all about the form.
 * 
 */
export default class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            form: undefined
        }
    }

    componentDidMount() {
        this.requestForm().then(form => {
            console.log(form)
            this.setState({form: form});
        })
    }
    
    requestForm = () => {
        return new Promise((resolve, reject) => {
            fetch(`${API}/api/form/`, {
                method: "GET",
                credentials: "include",
            }
            ).then(res => {
                return res.json();
            }).then(data => {
                resolve(data);
            }).catch(e => {console.alert(e); reject(e)})
        })
    }
    
    renderCheckBox = (property) => {
        try {
            return <CheckBox keys={property.options}>{property.title}</CheckBox>;
        } catch (e) {
            return <></>;
        }
    }

    renderRadioBox = (property) => {
        try {
            return <RadioBox keys={property.options}>{property.title}</RadioBox>;
        } catch (e) {
            return <></>;
        }
    }

    renderTextBox = (property) => {
        console.log(property)
        try {
            return <TextBox>{property.title}</TextBox>;
        } catch (e) {
            console.log(e)
            return <></>;
        }
    }

    render() {
        if (!this.state.form) return <h>Loading...</h>;

        return (
            <div className="form">
                <div className="title"><h>{this.state.form.title}</h></div>
                {
                    this.state.form.properties.map(property => {
                        console.log(property.type)
                        if (property.type == "radio-box") {
                            return this.renderRadioBox(property);
                        } else if (property.type === "check-box") {
                            return this.renderCheckBox(property);
                        } else if (property.type === "text-box") {
                            return this.renderTextBox(property);
                        }
                    })
                }
                <SubmitButton>Submit</SubmitButton>
            </div>         
        );
    }
}
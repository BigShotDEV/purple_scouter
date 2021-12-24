import React from 'react';
import { API } from '../../Utils/authentication';
import CheckBox from './CheckBox/check-box';
import RadioBox from './RadioBox/radio-box';
import SubmitButton from './SubmitButton/submit-button';
import TextBox from './TextBox/text-box';

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
            this.setState({form: form});
        })
    }
    
    requestForm = () => {
        return new Promise((resolve, reject) => {
            fetch(`${API}/api/form`, {
                method: "GET",
                credentials: "include",
            }
            ).then(res => {
                return res.json();
            }).then(data => {
                resolve(data);
            }).catch(e => reject(e))
        })
    }
    
    renderCheckBox = (property) => {
        try {
            return <CheckBox options={property.options}>{property.title}</CheckBox>;
        } catch (e) {
            return <></>;
        }
    }

    renderRadioBox = (property) => {
        try {
            return <RadioBox options={property.options}>{property.title}</RadioBox>;
        } catch (e) {
            return <></>;
        }
    }

    renderTextBox = (property) => {
        try {
            return <TextBox>{property.title}</TextBox>;
        } catch (e) {
            return <></>;
        }
    }

    render() {
        if (!this.state.form) return <h>Loading...</h>;

        return (
            <div className="form">
                <h className="title">{this.state.form.title}</h>
                {
                    this.state.form.properties.map(property => {
                        if (property.type == "radio-box") {
                            this.renderRadioBox(property);
                        } else if (property.type === "check-box") {
                            this.renderCheckBox(property);
                        } else if (property.type === "text-box") {
                            this.renderTextBox(property);
                        }
                    })
                }
                <SubmitButton>Submit</SubmitButton>
            </div>         
        );
    }
}
import React from 'react';
import { API, whoami } from '../../Utils/authentication';
import CheckBox from './CheckBox/check-box';
import RadioBox from './RadioBox/radio-box';
import SubmitButton from './SubmitButton/submit-button';
import TextBox from './TextBox/text-box';
import './form.css';
import { deleteCookie, getCookie, setCookie } from '../../Utils/cookie';
import Nav from '../Nav/nav';
import NumberBox from './NumberBox/number-box'
import Headline from './Headline/headline';

/**
 * This Componenet handles all about the form.
 * 
 */
export default class Form extends React.Component {
    COOKIE_EXDAYS = 0.5; // 12 hours
    COOKIE_NAME = "form_data";

    constructor(props) {
        super(props);

        // here dynamically updating the form_data.
        this.form_data = {} // example: {"id": data, ...}

        this.cookie_data = this.loadFormData();

        this.state = {
            form: undefined,
        }
    }


    /**
     * Loads form_data from the cookie.
     */
    loadFormData = () => {
        try {
            let cookie_data = JSON.parse(getCookie(this.COOKIE_NAME));
            this.form_data = cookie_data; // this is the only place which shouldn't call updateCookie
            return cookie_data;
        } catch (e) {
            return {};
        }
    }

    /**
     * Call this function to change the data for you, it also updates the cookie.
     * 
     * !NOTICE! Do not change form data directly, it won't update the cookie.
     * 
     * @param {int} id The field id
     * @param {any} data The data to change
     */
    updateFormData = (id, data) => {
        // here we can set a cookie each time.
        this.form_data[id] = data;

        setCookie(this.COOKIE_NAME, JSON.stringify(this.form_data), this.COOKIE_EXDAYS); // update the form's cookie.
    }

    handleRadioBox = (event, id) => {
        this.updateFormData(id, [event.target.value]);
    }

    handleCheckBox = (event, id) => {
        if (this.form_data[id] === undefined) this.updateFormData(id, []);

        if (this.form_data[id].includes(event)) {
            this.updateFormData(id, this.form_data[id].filter((data) => data != event));
            return;
        }

        this.updateFormData(id, [...this.form_data[id], event]);
    }

    handleTextBox = (event, id) => {
        this.updateFormData(id, [event.target.value]);
    }

    handleNumberBox = (value, id) => {
        this.updateFormData(id, [value])
    }

    handleSubmit = async () => {
        let stats = [];
        let user_name = "";
        let game_number = 0;
        let team_number = 0;


        // the form data in the this.form_data.
        // add a post request for the data.

        if (this.state.form.properties.length > Object.keys(this.form_data).length) {
            // goes here if the user hasn't asnwers all of the form.

            alert("error");
            return;
        }

        user_name = (await whoami()).user_name; // sets the user_name

        this.state.form.properties.map((property, id) => { // sets the stats
            stats[id] = { title: this.state.form.properties[id].title, value: this.form_data[id] };
        });

        let requestBody = {
            user_name: user_name,
            game_number: game_number,
            team_number: team_number,
            stats: stats
        }

        fetch(`${API}/api/game/`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(res => {
            return res.json();
        }).then(data => {
            window.location.reload();
        })
            .catch(e => {
                alert(e)
            })
        deleteCookie(this.COOKIE_NAME);
    }

    componentDidMount() {
        this.requestForm().then(form => {
            this.setState({ form: form });
        })
    }

    // retrieves the latest form from the db.
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
            }).catch(e => { console.alert(e); reject(e) })
        })
    }

    // renders a check box
    renderCheckBox = (property, id) => {
        try {
            return <CheckBox id={id} onChange={this.handleCheckBox} default={this.cookie_data[id]} keys={property.options}>{property.title}</CheckBox>;
        } catch (e) {
            return <></>;
        }
    }

    // renders a radio box
    renderRadioBox = (property, id) => {
        try {
            return <RadioBox id={id} onChange={this.handleRadioBox} default={this.cookie_data[id]} keys={property.options}>{property.title}</RadioBox>;
        } catch (e) {
            return <></>;
        }
    }

    // renders a text box
    renderTextBox = (property, id) => {
        try {
            return <TextBox id={id} default={this.cookie_data[id]} onChange={this.handleTextBox} >{property.title}</TextBox>;
        } catch (e) {
            return <></>;
        }
    }

    renderNumberBox = (property, id) => {
        try {
            return <NumberBox id={id} default={this.cookie_data[id]} onChange={this.handleNumberBox}>{property.title}</NumberBox>
        } catch (e) {
            return <></>;
        }
    }

    /**
     * renders an headline
     * 
     * @param {Object} property a property object
     * @returns an XHTML object of an headline
     */
    renderHeadline = (property) => {
        try {
            return <Headline>{property.title}</Headline>;
        } catch (e) {
            return <></>;
        }
    }

    render() {
        if (!this.state.form) return <h>Loading...</h>;

        return (
            <div className="form">
                <Nav items={[{ title: "home", link: "https://www.google.com" }, { title: "home", link: "https://www.google.com" }, { title: "home", link: "https://www.google.com" }, { title: "home", link: "https://www.google.com" }]}></Nav>
                <div className="title"><h>{this.state.form.title}</h></div>
                {
                    this.state.form.properties.map((property) => {
                        if (property.type == "radio-box") {
                            return this.renderRadioBox(property, property.id);
                        } else if (property.type === "check-box") {
                            return this.renderCheckBox(property, property.id);
                        } else if (property.type === "text-box") {
                            return this.renderTextBox(property, property.id);
                        } else if (property.type === "number-box") {
                            return this.renderNumberBox(property, property.id);
                        } else if (property.type === "headline") {
                            return this.renderHeadline(property); // doesn't have an id, 'cause it doesn't output anything.
                        }
                    })
                }
                <SubmitButton onClick={this.handleSubmit}>Submit</SubmitButton>
            </div>
        );
    }
}
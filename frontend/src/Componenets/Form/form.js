import React from 'react';
import { API, whoami } from '../../Utils/authentication';
import CheckBox from './CheckBox/check-box';
import RadioBox from './RadioBox/radio-box';
import SubmitButton from './SubmitButton/submit-button';
import TextBox from './TextBox/text-box';
import './form.css';
import { deleteCookie, getCookie, setCookie } from '../../Utils/cookie';
import Nav from '../Nav/nav';
import Headline from './Headline/headline';
import CounterBox from './CounterBox/counter-box'
import NumberBox from './NumberBox/number-box';
import BooleanBox from './BooleanBox/boolean-box';

/**
 * This Componenet handles all about the form.
 * 
 * The game number(id=0) and the team number(id=1)
 */
export default class Form extends React.Component {
    COOKIE_EXDAYS = 0.5; // 12 hours
    COOKIE_NAME = "form_data";
    GAME_INFO_COOKIE = "game_info"

    constructor(props) {
        super(props);

        // here dynamically updating the form_data.
        this.form_data = {} // example: {"id": data, ...}

        this.cookie_data = this.loadFormData();
        this.game_info_cookie = this.loadGameInfo();

        this.game_info_name = {
            game_number: {"hebrew": "מספר משחק", "english": "game number"},
            team_number: {"hebrew": "מספר קבוצה", "english": "team number"}
        }

        this.state = {
            form: undefined,
            game_number: this.cookie_data.game_number === undefined ? 0 : this.cookie_data.game_number,
            team_number: this.cookie_data.team_number  === undefined ? 0 : this.cookie_data.team_number,
            language: "hebrew",
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
     * Loads the game info from cookies.
     * 
     * @returns The game info
     */
    loadGameInfo = () => {
        try {
            let game_info = JSON.parse(getCookie(this.GAME_INFO_COOKIE));
            
            return game_info;
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
            this.updateFormData(id, this.form_data[id].filter((data) => data !== event));
            return;
        }

        this.updateFormData(id, [...this.form_data[id], event]);
    }

    handleBooleanBox = (id) => {
        if (this.form_data[id] === undefined || this.form_data[id] === false) {
            this.updateFormData(id, true)
        } else {
            this.updateFormData(id, false)
        }
    }

    handleTextBox = (event, id) => {
        this.updateFormData(id, event.target.value);
    }

    handleNumberBox = (event, id) => {
        this.updateFormData(id, Number(event.target.value));
    }

    handleCounterBox = (value, id) => {
        this.updateFormData(id, value)
    }

    handleGameInfo = (event, id) => {
        switch (id) {
            case(0):
                this.setState({game_number: Number(event.target.value)});
                setCookie(this.GAME_INFO_COOKIE, JSON.stringify({game_number: Number(event.target.value), team_number: this.state.team_number}), this.COOKIE_EXDAYS); // update the form's cookie.
                break;
            case(1):
                this.setState({team_number: Number(event.target.value)});
                setCookie(this.GAME_INFO_COOKIE, JSON.stringify({game_number: this.state.game_number, team_number: Number(event.target.value)}), this.COOKIE_EXDAYS); // update the form's cookie.
                break;
        } 

    }

    handleSubmit = async () => {
        let properties = JSON.parse(JSON.stringify(this.state.form.properties));

        properties = properties.filter((property => property.type !== "headline"));

        let stats = [];
        let user_name = "";
        let game_number = this.state.game_number;
        let team_number = this.state.team_number;
        let form_length = 0;

        for (const property of this.state.form.properties) {
            if (property.type !== "headline") form_length++;
        }


        // the form data in the this.form_data.
        // add a post request for the data.

        if (form_length > Object.keys(this.form_data).length) {
            // goes here if the user hasn't asnwers all of the form.

            alert("You need to complete the form in order to submit it");
            return;
        }

        user_name = (await whoami()).user_name; // sets the user_name
        console.log(this.form_data, properties)
        properties.map((property, id) => { // sets the stats
            try {
                // I know you are might be afraid right now, but think of me the guy who acutally thought of it. I didn't commited suicide (yet).
                // ok, its get the indexes of the answers in the languages the form was performed and then it joins all of the answers from all of the languages.
                let ids = this.form_data[id].map(answer => properties[property.id].options[this.state.language].indexOf(answer, 0));
                let answers = {};
                Object.keys(properties[property.id].options).forEach(language => {
                    answers[language] = ids.map(id => properties[property.id].options[language][id])[0];
                });

                stats[id] = { title: properties[property.id].title, value: answers, graph_stack: property.graph_stack };
            } catch (e) {
                stats[id] = { title: properties[property.id].title, value: this.form_data[id], graph_stack: property.graph_stack};
            }
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
        deleteCookie(this.GAME_INFO_COOKIE);
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
            return <CheckBox language={this.state.language} id={id} onChange={this.handleCheckBox} default={this.cookie_data[id]} keys={property.options}>{property.title[this.state.language] !== undefined ? property.title[this.state.language] : property.title["english"]}</CheckBox>;
        } catch (e) {
            return <></>;
        }
    }

    // renders a radio box
    renderRadioBox = (property, id) => {
        try {
            return <RadioBox language={this.state.language} id={id} onChange={this.handleRadioBox} default={this.cookie_data[id]} keys={property.options}>{property.title[this.state.language] !== undefined ? property.title[this.state.language] : property.title["english"]}</RadioBox>;
        } catch (e) {
            return <></>;
        }
    }

    renderBooleanBox = (property, id) => {
        try {
            if (this.cookie_data[id] === undefined) this.updateFormData(id, false);
            return <BooleanBox id={id} default={this.cookie_data[id]} onChange={this.handleBooleanBox}>{property.title[this.state.language] !== undefined ? property.title[this.state.language] : property.title["english"]}</BooleanBox>;
        } catch (e) {
            return <></>;
        }
    }

    // renders a text box
    renderTextBox = (property, id) => {
        try {
            return <TextBox id={id} default={this.cookie_data[id]} onChange={this.handleTextBox} >{property.title[this.state.language] !== undefined ? property.title[this.state.language] : property.title["english"]}</TextBox>;
        } catch (e) {
            return <></>;
        }
    }

    // renders a number box
    renderNumberBox = (property, id) => {
        try {
            return <NumberBox id={id} default={this.cookie_data[id]} onChange={this.handleNumberBox} >{property.title[this.state.language] !== undefined ? property.title[this.state.language] : property.title["english"]}</NumberBox>;
        } catch (e) {
            console.warn(e)
            return <></>;
        }
    }

    // renders a counter box
    renderCounterBox = (property, id) => {
        try {
            return <CounterBox id={id} default={this.cookie_data[id]} onChange={this.handleCounterBox}>{property.title[this.state.language] !== undefined ? property.title[this.state.language] : property.title["english"]}</CounterBox>;
        } catch (e) {
            console.log("error", e)
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
            return <Headline>{property.title[this.state.language] !== undefined ? property.title[this.state.language] : property.title["english"]}</Headline>;
        } catch (e) {
            return <></>;
        }
    }

    render() {
        if (!this.state.form) return <h>Loading...</h>;
        
        return (
            <div className="form">
                <Nav items={[{ title: "home", link: "/" }, { title: "login", link: "/login" }, { title: "stats", link: "/stats" }]}></Nav>
                
                <div className="title"><h>{this.state.form.title[this.state.language] !== undefined ? this.state.form.title[this.state.language] : this.state.form.title["english"]}</h></div>
                <NumberBox id={0} default={this.game_info_cookie.game_number} onChange={this.handleGameInfo} >{this.game_info_name.game_number[this.state.language]}</NumberBox>
                <NumberBox id={1} default={this.game_info_cookie.team_number} onChange={this.handleGameInfo} >{this.game_info_name.team_number[this.state.language]}</NumberBox>
                {
                    this.state.form.properties.map((property, id) => {
                        switch (property.type) {
                            case "radio-box":
                                return this.renderRadioBox(property, Number(property.id));
                            case "check-box":
                                return this.renderCheckBox(property, Number(property.id));
                            case "text-box":
                                return this.renderTextBox(property, Number(property.id));
                            case "counter-box":
                                return this.renderCounterBox(property, Number(property.id));
                            case "number-box":
                                return this.renderNumberBox(property, Number(property.id));
                            case "headline":
                                return this.renderHeadline(property); // doesn't have an id, 'cause it doesn't output anything.
                            case "boolean-box":
                                return this.renderBooleanBox(property, Number(property.id))
                            default:
                                console.warn(`unsupported form-element type: ${property.type}`);
                        }
                    })
                }
                <SubmitButton onClick={this.handleSubmit}>Submit</SubmitButton>
            </div>
        );
    }
}
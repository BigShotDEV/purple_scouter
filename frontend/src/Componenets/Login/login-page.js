import React from 'react';
import InputField from './inputField/input-field';
import { authentication, isAuthenticated } from '../../Utils/authentication';
import "./login-page.css"

export default class LoginPage extends React.Component {    
    constructor(props) {
        super(props);

        this.state = {
            error: "",
        }
    }

    componentDidMount() {
        isAuthenticated("/").then((isAuth) => {
            if (isAuth) {
                window.location.href = "/"; // redirects, user already authenticated...
            }
        });
    }
    
    /**
     * Authenticates.
     * 
     * @param {String} form The form, username password...
     */
    auth = (form) => {
        authentication(form).then(() => { // success
            window.location.href = "/"; // redirects...
        }).catch(error => { // failed
            this.setState({error: error}); // sets the error.
        })
    }

    render() {
        return (
            <div className="login-page">    
                <div className="title">Login</div>

                 <form name="myForm" action="" onSubmit={(form) => {form.preventDefault(); this.auth(form)}}>
                    <InputField className="input" >Username</InputField>
                    <InputField className="input" inputType="password">Password</InputField>
                    <span className="error">{this.state.error}</span>
                    <button className="enter-button" type="submit">Enter</button>
                </form> 
            </div>
        )
    }
}
import React from 'react';
import InputField from './inputField/input-field';
import { authentication } from '../../Utils/authentication';
import "./login-page.css"

export default class LoginPage extends React.Component {    
    render() {
        return (
            <div className="login-page">    
                <div className="title">Login</div>

                 <form name="myForm" action="" onSubmit={(form) => {form.preventDefault(); authentication(form)}}>
                    <InputField className="input" >Username</InputField>
                    <InputField className="input" inputType="password">Password</InputField>
                    <button className="enter-button" type="submit">Enter</button>
                </form> 
            </div>
        )
    }
}
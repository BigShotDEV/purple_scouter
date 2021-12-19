import React, { Component } from 'react';
import InputField from './inputField/input-field';
import "./login-page.css"

export default class LoginPage extends React.Component {
    render() {
        return (
            <div className="login-page">
                <div className="title">Login</div>
                <InputField className="input">Username</InputField>
                <InputField className="input" inputType="password">Password</InputField>
                <button className="enter-button" onClick={this.props.actions}>Enter</button>
            </div>
        )
    }
}
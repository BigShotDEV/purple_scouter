import React, { Component } from 'react';
import "./input-field.css";

export default class InputField extends React.Component{
    render(){
        return(
        <>
            <div className="input-field">
                {this.props.children + ": "}
                <input type={this.props.inputType === undefined ? "text": this.props.inputType} onChange={this.props.onChange} className="input"></input>
            </div>
        </>
        )
    }
}
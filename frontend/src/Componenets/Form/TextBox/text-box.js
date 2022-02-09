import React from 'react';
import "./text-box.css";

/**
 * This is the TextBox component,
 * it gets the title has a property through the children, 
 * and it gets a onChange callback. 
 */
export default class TextBox extends React.Component {
    render() {
        return (
            <div className="text-box">
                <p className="title">{this.props.children}</p>

                <input type="text" onChange={(event) => {this.props.onChange(event, this.props.id)}} defaultValue={this.props.default ? this.props.default : ""} className="text"></input>
            </div>
        );  
    }
}
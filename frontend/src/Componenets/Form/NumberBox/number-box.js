import React from 'react';
import "./number-box.css";

/**
 * This is the TextBox component,
 * it gets the title has a property through the children, 
 * and it gets a onChange callback. 
 */
export default class NumberBox extends React.Component {
    render() {
        return (
            <div className="number-box">
                <h1>{this.props.children}</h1>

                <input type="number" onChange={(event) => {this.props.onChange(event, this.props.id)}} defaultValue={this.props.default ? this.props.default : ""}></input>
            </div>
        );  
    }
}
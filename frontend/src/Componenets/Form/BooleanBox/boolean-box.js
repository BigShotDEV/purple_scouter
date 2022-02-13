import React from 'react';
import './boolean-box.css'

/**
 * This componenet is a checkbox in the form, 
 * The class gets the title throughte children props
 * and the keys props, the keys props should be in this form:
 * [key1, key2, ...]
 * This third property is the onClick, func(key).
 */
export default class BooleanBox extends React.Component {
    render() {
        return (
            <div className="boolean-box">
                <h1 className="title">
                    {this.props.children}
                </h1>
                <label className="checkbox-label">
                    <input type="checkbox"
                        onChange={() => { this.props.onChange(this.props.id) }}
                        defaultChecked={this.props.default}
                    />
                    <span className="checkbox-custom"></span>
                    <br></br>
                </label>
                    
            </div>
        );
    }
}
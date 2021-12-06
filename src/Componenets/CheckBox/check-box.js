import React from 'react';
import './check-box.css';

/**
 * This componenet is a checkbox in the form, 
 * The class gets the title throughte children props
 * and the keys props, the keys props should be in this form:
 * [key1, key2, ...]
 * This third property is the onClick, func(key).
 */
export default class CheckBox extends React.Component {

    /**
     * Renders all of the options.
     * 
     * @returns A XHTML object of all the options
     */
    renderOptions = () => {
        return this.props.keys.map(key => {
            return <div key={key} className="option">
                <input type="checkbox" onClick={() => {this.props.onClick(key)}} id={key} name={key}/>
                <label for={key}>{key}</label>
            </div>
        })
    }


    render() {
        return (
        <div className="check-box">
            <p className="title">{this.props.children}</p>
            {this.renderOptions()}
        </div>
        );
    }
}
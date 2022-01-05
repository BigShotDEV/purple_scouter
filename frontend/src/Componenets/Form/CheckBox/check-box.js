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
            if (this.props.default === undefined || !this.props.default.includes(key)) {
                return (
                <label className="checkbox-label">
                    <p>{key}</p>
                    <input type="checkbox" onChange={() => {this.props.onChange(key, this.props.id)}} id={key} name={key}/>
                    <span className="checkbox-custom"></span>
                </label>
                );
            } else {
                return (
                    <label className="checkbox-label">
                        <p>{key}</p>
                        <input type="checkbox" onChange={() => {this.props.onChange(key, this.props.id)}} id={key} name={key} defaultChecked={true}/>
                        <span className="checkbox-custom"></span>
                    </label>
                    );
            }
            
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
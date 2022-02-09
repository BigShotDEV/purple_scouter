import React, { useState } from 'react';
import "./number-box.css";


/**
 * This is the TextBox component,
 * it gets the title has a property through the children, 
 * and it gets a onChange callback. 
 */
export default class NumberBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.default ? this.props.default[0] : "0"
        }
    }

    addValue = () => {
        this.props.onChange(Number(this.state.value)+1, this.props.id)
        this.setState({ value: String(Number(this.state.value) + 1) });
    }
    subtractValue = () => {
        if (Number(this.state.value) <= 0) return;
        this.props.onChange(Number(this.state.value)-1, this.props.id)
        this.setState({ value: String(Number(this.state.value) - 1) });
    }

    render() {
        return (
            <div className="number-box">
                <p className="title">{this.props.children}</p>

                <button onClick={this.subtractValue}>-</button>
                <span className='number'>{this.state.value}</span>
                <button onClick={this.addValue}>+</button>
            </div>
        );
    }
}
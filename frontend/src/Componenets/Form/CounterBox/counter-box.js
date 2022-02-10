import React, { useState } from 'react';
import "./counter-box.css";


/**
 * This is the TextBox component,
 * it gets the title has a property through the children, 
 * and it gets a onChange callback. 
 */
export default class NumberBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.default !==undefined ? this.props.default : "-1"
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
            <div className="counter-box">
                <h1 className="title">{this.props.children}</h1>

                <button onClick={this.subtractValue}>-</button>
                <span>{this.state.value}</span>
                <button onClick={this.addValue}>+</button>
            </div>
        );
    }
}
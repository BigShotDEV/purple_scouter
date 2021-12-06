import React from 'react';
import "./radio-box.css";

/**
 * This component is the RadioBox, 
 * he has two props keys [key1, key2, ...],
 * and the children (the title).
 */
export default class RadioBox extends React.Component {
    static id = 0;

    constructor(props) {
        super(props);

        this.id = RadioBox.id;
        RadioBox.id++;
    }

    /**
     * Renders the options.
     * 
     * @returns A rendered XHTMl object.
     */
    renderOptions = () => {
        return this.props.keys.map(key => {
            return (
            <div className="option">
                <input type="radio" onClick={this.props.onClick} id={key} name={this.id} value={key}/>
                <label for={key}>{key}</label>
            </div>
            );
        });
    }

    render() {  
        return (
            <div className="radio-box">
                <p className="title">{this.props.children}</p>
                {this.renderOptions()}
            </div>
        );
    }
}
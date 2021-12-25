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
            if (this.props.default === undefined || !this.props.default.includes(key)) {
            return (
            <div className="option">
                <input type="radio" onChange={(event) => {this.props.onChange(event, this.props.id)}} id={key} name={this.id} value={key}/>
                <label for={key}>{key}</label>
            </div>
            );
            } else {
                return (
                    <div className="option">
                        <input type="radio" onChange={(event) => {this.props.onChange(event, this.props.id)}} id={key} name={this.id} value={key} checked/>
                        <label for={key}>{key}</label>
                    </div>
                    ); 
            }
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
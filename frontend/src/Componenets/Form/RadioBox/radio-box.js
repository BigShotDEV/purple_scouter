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
            if (this.props.default === undefined || !this.props.default.includes(String(key))) {
                return (
                    <label className="radiobox-label">
                        <p>{key}</p>
                        <input type="radio"
                            onChange={(event) => {
                                this.props.onChange(event, this.props.id)
                            }}
                            id={key} name={this.id} value={key} />
                        <span className="radiobox-custom"></span>
                    </label>
                );
            } else {
                return (
                    <label className="radiobox-label">
                        <p>{key}</p>
                        <input type="radio" 
                        onChange={(event) => { this.props.onChange(event, this.props.id) }} 
                        id={key} name={this.id} value={key} defaultChecked />
                        <span className="radiobox-custom"></span>
                    </label>
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
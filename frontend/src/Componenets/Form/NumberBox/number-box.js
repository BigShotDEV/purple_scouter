import React from 'react';
import "./number-box.css";

/**
 * This is the TextBox component,
 * it gets the title has a property through the children, 
 * and it gets a onChange callback. 
 */
export default class NumberBox extends React.Component {
    constructor(props) {
        super(props);

        this.input_ref = React.createRef();
    }

    componentDidMount() {
        // making sure the user inputs only numric values.
        this.input_ref.current.addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57) { // only allows numbers
                evt.preventDefault();
            }
        });
    }

    render() {
        return (
            <div className="number-box">
                <h1>{this.props.children}</h1>

                <input type="number" ref={this.input_ref} onChange={(event) => {this.props.onChange(event, this.props.id)}} defaultValue={this.props.default ? this.props.default : ""}></input>
            </div>
        );  
    }
}
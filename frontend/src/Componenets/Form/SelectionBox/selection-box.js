import React from 'react';
import Select from 'react-select'
import './selection-box.css';

/**
 * The SelectionBox data type.
 * 
 * Gets the options in this form:
 * [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
  ]   
 */
export default class SelectionBox extends React.Component {
    render() {
        return (
            <div className="selection-box">
                <p className="title">{this.props.children}</p>
                <Select options={this.props.options} />
            </div>
        );
    }
}
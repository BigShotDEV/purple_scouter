import React from 'react';
import './submit-button.css';

/**
 * This is the SubmitButton component,
 * it has two properties the children(title),
 * and the 'onClick'.
 */
export default class SubmitButton extends React.Component {
    render() {
        return (
            <div className="submit-button">
                <button className='button' onClick={this.props.onClick}>{this.props.children}</button>
            </div>
        );
    }
}
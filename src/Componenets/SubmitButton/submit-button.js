import React from 'react';
import './submit-button.css';

export default class SubmitButton extends React.Component {
    render() {
        return (
            <div className="submit-button">
                <button className='button' onClick={this.props.onClick}>{this.props.children}</button>
            </div>
        );
    }
}
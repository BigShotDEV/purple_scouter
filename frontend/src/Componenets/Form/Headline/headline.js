import React from 'react';
import './headline.css';

/**
 * An headline, use for beauty.
 */
export default class Headline extends React.Component {
    render() {
        return (
            <div className='headline-container'>
                <p classname='title'>{this.props.children}</p>
            </div>
        );
    }
}


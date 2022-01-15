import React from 'react';
import './nav-item.css';

/**
 * The nav item class gets its title throught he children props and the link through the link props.
 */
export default class NavItem extends React.Component {
    render() {
        return (
        <div className="nav-item">
            <a href={this.props.link}>{this.props.children}</a>
        </div>
        );
    }
}
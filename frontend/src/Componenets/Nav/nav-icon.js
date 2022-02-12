import React from 'react';

export default class NavIcon extends React.Component {
    render() {
        return (
            <>
                <input id="page-nav-toggle" class="main-navigation-toggle" type="checkbox" />
                <label for="page-nav-toggle">
                <svg class="icon--menu-toggle" viewBox="0 0 60 30">
                    <g class="icon-group">
                    <g class="icon--menu">
                        <path d="M 6 0 L 54 0" />
                        <path d="M 6 15 L 54 15" />
                        <path d="M 6 30 L 54 30" />
                    </g>
                    <g class="icon--close">
                        <path d="M 15 0 L 45 30" />
                        <path d="M 15 30 L 45 0" />
                    </g>
                    </g>
                </svg>
                </label>
            </>
        );
    }
}
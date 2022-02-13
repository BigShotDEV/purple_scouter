import React from 'react';
import { isAuthenticated } from '../../Utils/authentication';
import {AiFillCloseCircle} from 'react-icons/ai';
import {IconContext} from 'react-icons';
import './nav-item.css';

/**
 * The nav item class gets its title throught he children props and the link through the link props.
 */
export default class NavItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuth: false,
        }
    }

    componentDidMount() {
        // checks if the user has access to the page.
        isAuthenticated(this.props.link).then(isAuth => {
            this.setState({isAuth: isAuth});
        })
    }

    // This function renders the nav item if the user can access the page.
    renderHasAccess = () => {
        return (
            <li><a href={this.props.link}>{this.props.children}</a></li>
        );
    }

    // This function renders the nave item if the user can't access the page.
    renderRestricted = () => {
        return (
            <li>
                <p className="nav-restricted-item">
                    {this.props.children}

                    <IconContext.Provider value = {{ className: "nav-close-icon" }}>
                        <AiFillCloseCircle/>
                    </IconContext.Provider>
                </p>
                
            </li>
        );
    }

    render() {
        if (this.state.isAuth) {
            return this.renderHasAccess();
        }

        return this.renderRestricted();
    }
}
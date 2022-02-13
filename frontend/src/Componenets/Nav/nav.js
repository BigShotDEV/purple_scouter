import React from 'react';
import NavItem from './item';
import {CgMoreO} from 'react-icons/cg';
import {IconContext} from 'react-icons';
import './nav.scss';
import NavIcon from './nav-icon';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            render: false,
        }
    }

    /**
     * 
     * @param {Array} items An array of objects {title: "title", link: "the link"}.
     * @returns The renered XHTML object of all the items
     */
    renderItems = (items) => {
        return items.map(item => <NavItem link={item.link}>{item.title}</NavItem>)
    }

    handleShowButton = () => {
        this.setState({render: !this.state.render});
    }

    render() {
        return (
            <div className="nav">
               <NavIcon></NavIcon>

                <nav class="main-navigation">
                        <ul>
                        {this.renderItems(this.props.items)}
                        </ul>
                    </nav>     
            </div>
        );

    }
}
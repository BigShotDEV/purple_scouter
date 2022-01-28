import React from 'react';
import NavItem from './item';
import {CgMoreO} from 'react-icons/cg'
import './nav.css';

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
        if (this.state.render) {
            return (
                <div className="nav">
                    <CgMoreO onClick={this.handleShowButton}></CgMoreO>
    
                    {this.renderItems(this.props.items)}
                </div>
            );    
        } 

        return (
            <div className="nav">
                <CgMoreO onClick={this.handleShowButton}></CgMoreO>
            </div>
        );

    }
}
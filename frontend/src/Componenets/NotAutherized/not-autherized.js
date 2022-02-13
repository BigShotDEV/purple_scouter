import React from 'react';
import Nav from '../Nav/nav';
import "./not-autherized.css";

export default class NotAutherizedPage extends React.Component {
    render() {
        return (
        <div className="not-autherized">
            <Nav items={[{ title: "home", link: "/" }, { title: "login", link: "/login" }, { title: "stats", link: "/stats" }]}></Nav>


            <p className="title">Not Autherized</p>
            <p className="content">
                You are not allowed to view the page.
                <br/>
                &emsp;1. You need to <a href="/login">login</a>.
                <br/>
                &emsp;2. This is a admin only site.
            </p>
        </div>
        );
    }
}
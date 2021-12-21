import React from 'react';
import "./not-autherized.css";

export default class NotAutherizedPage extends React.Component {
    render() {
        return (
        <div className="not-autherized">
            <h className="title">Not Autherized</h>
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
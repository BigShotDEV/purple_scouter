import React from 'react';

import Form from "../Componenets/Form/form";
import { isAuthenticated } from '../Utils/authentication';


export default class RootRoute extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: undefined,
        }
    }

    componentDidMount() {
       isAuthenticated("/").then(auth => {
        this.setState({"isAuthenticated": auth});
       })
        
    }

    render() { 
        if (this.state.isAuthenticated === undefined) return<>Loading...</>;
        if (!this.state.isAuthenticated) return <h>Not Autherized!</h>;

        return (
        <>
        <Form/>
        </>
        );
    }
}
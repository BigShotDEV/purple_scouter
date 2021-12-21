import React from 'react';

import Form from "../Componenets/Form/form";
import NotAutherizedPage from '../Componenets/NotAutherized/not-autherized';
import { isAuthenticated } from '../Utils/authentication';


export default class RootRoute extends React.Component {
    PATH = "/"
    
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: undefined,
        }
    }

    componentDidMount() {
       isAuthenticated(this.PATH).then(auth => {
        this.setState({"isAuthenticated": auth});
       })
        
    }

    render() { 
        if (this.state.isAuthenticated === undefined) return<>Loading...</>;
        if (!this.state.isAuthenticated) return <NotAutherizedPage></NotAutherizedPage>;

        return (
        <>
        <Form/>
        </>
        );
    }
}
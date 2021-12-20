import React from 'react';

import Form from "../Componenets/Form/form";
import { isAuthenticated } from '../Utils/authentication';


export default class RootRoute extends React.Component{
    render() {
        isAuthenticated("/");
        return (
        <>
        <Form/>
        </>)
        ;
    }
}
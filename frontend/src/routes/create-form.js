import React from 'react';
import CreateFormPage from '../Componenets/CreateForm/create-form';
import NotAutherizedPage from '../Componenets/NotAutherized/not-autherized';
import { isAuthenticated } from '../Utils/authentication';

/**
 * This route is for the form page, only admin visible page which can create new forms.
 */
export default class CreateFormRoute extends React.Component {
    PATH = "/api/form"
    
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
        // if (this.state.isAuthenticated === undefined) return<>Loading...</>;
        // if (!this.state.isAuthenticated) return <NotAutherizedPage></NotAutherizedPage>;

        return (
        <>
        <CreateFormPage/>
        </>
        );
    }
}
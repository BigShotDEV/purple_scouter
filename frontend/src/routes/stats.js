import React from 'react';
import NotAutherizedPage from '../Componenets/NotAutherized/not-autherized';
import { isAuthenticated } from '../Utils/authentication';


export default class StatsRoute extends React.Component {
    PATH = "/stats"
    
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

        return <h>Stats Page!</h>;
    }
}
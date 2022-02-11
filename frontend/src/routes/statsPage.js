import React from 'react';
import NotAutherizedPage from '../Componenets/NotAutherized/not-autherized';
import { isAuthenticated } from '../Utils/authentication';
import TeamsStatsPage from '../Componenets/TeamsStats/StatsPage/teamStatsPage';


export default class StatsPageRoute extends React.Component {
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

        return <TeamsStatsPage/>;
    }
}
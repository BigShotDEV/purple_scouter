import React from 'react';
import BarGraph from './graphs/graph';
import './stats.css'

export default class Stats extends React.Component {    
    
    render() {
        return (
            <div className="stats-page">    
                <BarGraph labels={['3073', '3074', '3075']}
                       values={[{label: 'joe', data: [95, 95, 101]},
                                {label: 'mama', data: [110, 115, 10]},
                                {label: 'who', data: [110, 22, 25]},
                                {label: 'the', data: [10, 22, 25]},
                                {label: 'hell', data: [110, 115, 25]},
                                {label: 'is', data: [110, 10, 25]},
                                {label: 'steve', data: [115, 22, 25]},
                                {label: 'jobs', data: [45, 73, 121]}]}/>
            </div>
        )
    }
}
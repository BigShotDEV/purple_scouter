import React from 'react';
import Graph from './graphs/graph';
import './stats.css'

export default class Stats extends React.Component {    
    
    render() {
        return (
            <div className="stats-page">    
                <Graph labels={['boaz', 'ovadia', 'ziv', 'roni', 'beiman']}
                       values={[{label: 'loser meter', data: [95, 95, 101, 105, 100]},
                                {label: 'pro meter', data: [110, 115, 10, 22, 25]}]}
                       label={'loser meter'}
                       data={[100, 99, 101, 100, 95]}/>
                <Graph/>
                <Graph/>
                <Graph/>
                {/* <MyChart/> */}
            </div>
        )
    }
}
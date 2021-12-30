import React from 'react';
import BarGraph from './graphs/graph';
import './stats.css'

export default class Stats extends React.Component {    
    
    render() {
        return (
            <div className="stats-page">    
                <BarGraph labels={['game 1', 'game 2', 'game 3']}
                       values={[{label: 'total', data: [71, 80, 72], stack: "total"},
                                {label: 'bottom', data: [20, 20, 20], stack: "holes"},
                                {label: 'top', data: [20, 28, 18], stack: "holes"},
                                {label: 'inner', data: [30, 3, 25], stack: "holes"}]}/>
            </div>
        )
    }
}
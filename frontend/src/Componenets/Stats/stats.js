import React from 'react';
import BarGraph from './graphs/graph';
import './stats.css'

export default class Stats extends React.Component {    
    constructor(props){
        super(props);
        this.state = {
            labels: [],
            datas: []
        }

        let mongoData = [
            {
                "_id": {
                    "$oid": "61cecd20784c687627c3a10d"
                },
                "user_name": "joe",
                "game_number": 1,
                "team_number": 3075,
                "stats":{
                    "lower": 12,
                    "upper": 44,
                    "inner": 8,
                    "didTryClimb": true,
                    "didClimb": false,
                    "gotDefended": false,
                    "defended": false
                }
            },
            {
                "_id": {
                    "$oid": "61cecd20784c687627c3a10d"
                },
                "user_name": "joe",
                "game_number": 2,
                "team_number": 3075,
                "stats":{
                    "lower": 8,
                    "upper": 49,
                    "inner": 13,
                    "didTryClimb": true,
                    "didClimb": true,
                    "gotDefended": false,
                    "defended": false
                }
            },
            {
                "_id": {
                    "$oid": "61cecd20784c687627c3a10d"
                },
                "user_name": "steve",
                "game_number": 1,
                "team_number": 3075,
                "stats":{
                    "lower": 15,
                    "upper": 44,
                    "inner": 8,
                    "didTryClimb": true,
                    "didClimb": false,
                    "wasDefended": false,
                    "defended": false
                }
            }
        ]

        let avarageMongoData = {}

        // mongoData.forEach((item, index) => {
        //     this.label.push({

        //     });
        //     this.state.datas.push({
                
        //     });
        // });
    }
    render() {
        return (
            <div className="stats-page">    
                <BarGraph labels={['game 1', 'game 2', 'game 3']}
                       values={[{label: 'total', data: [71, 80, 72], stack: "total"},
                                {label: 'bottom', data: [20, 20, 20], stack: "holes"},
                                {label: 'top', data: [20, 28, 18], stack: "holes"},
                                {label: 'inner', data: [30, 3, 25], stack: "holes"}]}/>
                <p>Climbed: {this.state.test}</p>
            </div>
        )
    }
}
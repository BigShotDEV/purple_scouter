import React from 'react';
import BarGraph from './graphs/graph';
import './stats.css'

export default class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamsData: []
        };

        let mongoData = [
            {
                "_id": {
                    "$oid": "61cecd20784c687627c3a10d"
                },
                "user_name": "joe",
                "game_number": 1,
                "team_number": 3075,
                "stats": {
                    "basic_score": {
                        "lower": 12,
                        "upper": 44,
                        "inner": 8
                    },
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
                "stats": {
                    "basic_score": {
                        "lower": 8,
                        "upper": 49,
                        "inner": 13
                    },
                    "didTryClimb": true,
                    "didClimb": true,
                    "gotDefended": true,
                    "defended": false
                }
            },
            {
                "_id": {
                    "$oid": "61cecd20784c687627c3a10d"
                },
                "user_name": "joe",
                "game_number": 1,
                "team_number": 3076,
                "stats": {
                    "basic_score": {
                        "lower": 45,
                        "upper": 14,
                        "inner": 2
                    },
                    "didTryClimb": true,
                    "didClimb": true,
                    "gotDefended": false,
                    "defended": true
                }
            }
        ];

        let rawTeamsData = {
        };

        mongoData.forEach(item => {
            if (rawTeamsData[item.team_number] === undefined) {
                rawTeamsData[item.team_number] = {};
            }
            rawTeamsData[item.team_number][item.game_number] = item.stats;
        });

        for (const [team, games] of Object.entries(rawTeamsData)) {
            let labels = [];
            Object.keys(games).forEach(key => {
                let label = 'game number #' + key;
                if (games[key].gotDefended) {
                    label += " (got defended)";
                } else if (games[key].defended) {
                    label += " (defended)";
                }
                labels.push(label);
            })
            
            let graphValues = [];


            this.state.teamsData.push(
                <div className="stats-page">
                    <h1>{team}</h1>
                    <BarGraph labels={labels}
                        values={[{ label: 'total', data: [71, 80, 72], stack: "total" },
                        { label: 'bottom', data: [20, 20, 20], stack: "holes" },
                        { label: 'top', data: [20, 28, 18], stack: "holes" },
                        { label: 'inner', data: [30, 3, 25], stack: "holes" }]} />
                </div>
            )
        }
    }
    render() {
        return this.state.teamsData;
    }
}
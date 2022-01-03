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
                    "pablo": 10,
                    "shots": {
                        "lower": 12,
                        "upper": 44,
                        "inner": 8,
                    },
                    "boaz noz": 2,
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
                    "pablo": 10,
                    "shots": {
                        "lower": 8,
                        "upper": 49,
                        "inner": 13,
                    },
                    "boaz noz": 2,
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
                "game_number": 3,
                "team_number": 3075,
                "stats": {
                    "pablo": 10,
                    "shots": {
                        "lower": 8,
                        "upper": 49,
                        "inner": 13,
                        "boaz noz": 2
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
                    "pablo": 10,
                    "shots": {
                        "lower": 45,
                        "upper": 14,
                        "inner": 2,
                    },
                    "boaz noz": 2,
                    "didTryClimb": true,
                    "didClimb": true,
                    "gotDefended": false,
                    "defended": true
                }
            }
        ];

        let rawTeamsData = {};

        mongoData.forEach(item => {
            if (rawTeamsData[item.team_number] === undefined) {
                rawTeamsData[item.team_number] = {};
            }
            rawTeamsData[item.team_number][item.game_number] = item.stats;
        });

        for (const [team, games] of Object.entries(rawTeamsData)) {
            let graphLabels = [];
            let graphValues = []; // {lable: '', data: []}
            let precentageValues = [];
            let amountOfGames = 0;

            for (const [key, value] of Object.entries(mongoData[0].stats)) {
                switch (typeof value) {
                    case "number":
                        graphValues.push({ label: key, data: [], stack: key });
                        break;
                    case "boolean":
                        precentageValues.push({ label: key, times: 0 });
                        break;
                    // case "object":
                    //     for (const [subKey, subValue] of value) {
                    //         switch (typeof subValue) {
                    //             case "number":
                    //                 graphValues.push({ label: key, data: [], stack: subKey });
                    //                 break;
                    //             default:
                    //                 console.warn("unhandled stat type: " + typeof value);
                    //                 break;
                    //         }
                    //     }
                    //     break;
                    default:
                        console.warn("unhandled stat type: " + typeof value);
                        break;
                }
            }

            Object.keys(games).forEach(key => {
                let label = 'game number #' + key;
                if (games[key].gotDefended) {
                    label += " (got defended)";
                } else if (games[key].defended) {
                    label += " (defended)";
                }
                graphLabels.push(label);

                for (const dataStat of Object.keys(games[key])) {
                    graphValues.forEach(item => {
                        if (item.label == dataStat) {
                            item.data.push(games[key][dataStat]);
                        }
                    });

                }

                for (const dataStat of Object.keys(games[key])) {
                    precentageValues.forEach(item => {
                        if (item.label == dataStat && games[key][dataStat]) {
                            item.times++;
                        }
                    });
                }

                amountOfGames++;
            });

            let precentageValuesDisplayed = [<p>total games: {amountOfGames}</p>]
            precentageValues.forEach(item => {
                precentageValuesDisplayed.push(
                    <p>{item.label}: {item.times} out of {amountOfGames} ({(item.times / amountOfGames * 100).toFixed(2).replace(/[.,]00$/, "")}%)</p>
                )
            })

            this.state.teamsData.push(
                <div className="stats-page">
                    <h1>{"team " + team}</h1>
                    <BarGraph labels={graphLabels} values={graphValues} />
                    {precentageValuesDisplayed}
                </div>
            )
        }
    }
    render() {
        return this.state.teamsData;
    }
}
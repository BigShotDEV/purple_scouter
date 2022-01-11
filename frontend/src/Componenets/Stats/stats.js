import React from 'react';
import Select from "react-select"
import { API } from '../../Utils/authentication';
import BarGraph from './graphs/graph';
import './stats.css'

/**
 * this method exports a data sheet into a graph form
 * 
 * @param {Array} data  the data to parse
 * @returns the data sorted into an array of divs ready to be rendered
 */
let exportDataToRender = (data) => {
    let rawTeamsData = {};
    let teamsData = [];

    data.forEach(item => {
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

        for (const [key, value] of Object.entries(data[0].stats)) {
            switch (typeof value) {
                case "number":
                    graphValues.push({ label: key, data: [], stack: key });
                    break;
                case "boolean":
                    precentageValues.push({ label: key, times: 0 });
                    break;
                case "object":
                    for (const [subKey, subValue] of Object.entries(value)) {
                        switch (typeof subValue) {
                            case "number":
                                graphValues.push({ label: subKey, data: [], stack: key });
                                break;
                            default:
                                console.warn("the type of the stat " + key + "\\" + subKey + " (" + typeof subValue + ") is not supported");
                                break;
                        }
                    }
                    break;
                default:
                    console.warn("the type of the stat \"" + key + "\" (" + typeof value + ") is not supported");
                    break;
            }
        }

        Object.keys(games).forEach(key => {
            let label = key;
            if (games[key].gotDefended) {
                label += " (got defended)";
            } else if (games[key].defended) {
                label += " (defended)";
            }
            graphLabels.push(label);

            for (const [dataStat, value] of Object.entries(games[key])) {
                switch (typeof value) {
                    case "number":
                        graphValues.forEach(item => {
                            if (item.label === dataStat) {
                                item.data.push(games[key][dataStat]);
                            }
                        });
                        break
                    case "object":
                        for (const actualDataStat of Object.keys(value)) {
                            graphValues.forEach(item => {
                                if (item.label === actualDataStat) {
                                    item.data.push(games[key][dataStat][actualDataStat]);
                                }
                            });
                        }
                        break
                    case "boolean":
                        precentageValues.forEach(item => {
                            if (item.label === dataStat && games[key][dataStat]) {
                                item.times++;
                            }
                        });
                        break
                    default:
                        console.warn("the type of the stat \"" + key + "\" (" + typeof value + ") is not supported");
                        break;
                }
            }

            amountOfGames++;
        });

        let precentageValuesDisplayed = [<p>total games: {amountOfGames}</p>]
        precentageValues.forEach(item => {
            precentageValuesDisplayed.push(
                <p>{item.label}: {item.times} out of {amountOfGames} ({(item.times / amountOfGames * 100).toFixed(2).replace(/[.,]00$/, "")}%)</p>
            )
        })

        teamsData.push(
            <div className="team-stats">
                <h1>{"team " + team}</h1>
                <BarGraph labels={graphLabels} values={graphValues} />
                {precentageValuesDisplayed}
            </div>
        )
    }
    
    return teamsData
}

export default class Stats extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            mongoData: [],
            tempData: [
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
            ]
        };
    }

    componentDidMount() {
        fetch(`${API}/api/games/`,
            {
                method: "GET",
                credentials: "include",
            }).then(res => {
                return res.json();
            }).then(data => {
                console.log(data)
                this.setState({mongoData: data});
            }).catch(e => {
                alert(e);
            })
    }

    render() {

        return (
            <div className="stats-page">
                <input type="search"></input>
                <div className='centered'>sort by: <Select className='select' options={[
                    { value: "hi", label: "asd" }
                ]} /></div>
                {exportDataToRender(this.state.mongoData)}
            </div>
        )
    }
}
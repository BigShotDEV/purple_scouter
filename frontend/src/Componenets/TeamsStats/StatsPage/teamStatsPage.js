import React, { useState } from 'react';
import { API } from '../../../Utils/authentication';
import BarGraph from './graphs/graph';
import './teamStatsPage.css'

export default class TeamStatsPage extends React.Component {
    TEAM = window.location.pathname.match(/\/stats\/teams\/(.*)/)[1];

    constructor(props) {
        super(props)
        this.state = {
            mongoData: []
        }
    }

    // please do everything again
    badConversion = (data) => {
        let badData = [];

        data.forEach(game => {
            let badGame = { team_number: game.team_number, game_number: game.game_number, stats: {} };
            game.stats.forEach(stat => {
                badGame.stats[stat.title] = stat.value;
            });
            badData.push(badGame);
        });
        return badData;
    }

    /**
     * this method flattens the mongo data (gets the averages)
     * @param {array} mongoData the data recieved from the mongoDB
     * @returns an objects that contains the average all stats
     */
    getAverageOfStatsFromMongoData = (mongoData) => {
        let copyMongoData = JSON.parse(JSON.stringify(mongoData)); // deep copy

        let data = {};
        let amountOfGames = 0;
        let booleanData = {};
        let multiOptionsData = {};

        copyMongoData.forEach(game => {
            amountOfGames++;
            for (const [key, value] of Object.entries(game.stats)) {
                switch (typeof value) {
                    case "number":
                        if (data[key] === undefined) {
                            data[key] = 0;
                        }
                        data[key] *= amountOfGames - 1;
                        data[key] += value;
                        data[key] /= amountOfGames;

                        break;
                    case "boolean":
                        if (booleanData[key] === undefined) {
                            booleanData[key] = 0;
                        }
                        if (value) booleanData[key]++;

                        break;
                    case "string":
                        if (multiOptionsData[key] === undefined) {
                            multiOptionsData[key] = [{ value: value, count: 1 }]
                        } else {
                            let put = false;
                            for (const item of multiOptionsData[key]) {
                                if (item.value === value) {
                                    item.count++;
                                    put = true;
                                    break;
                                }
                            }
                            if (!put) {
                                multiOptionsData[key].push({ value: value, count: 1 });
                            }
                        }

                        break;
                    case "object":
                        if (Array.isArray(value)) {
                            if (multiOptionsData[key] === undefined) {
                                multiOptionsData[key] = [];
                                for (const item of value) {
                                    multiOptionsData[key].push({ value: item, count: 1 });
                                }
                            } else {
                                for (const item of value) {
                                    let put = false;
                                    for (const dataItem of multiOptionsData[key]) {
                                        if (dataItem.value === item) {
                                            dataItem.count++;
                                            put = true;
                                            break;
                                        }
                                    }
                                    if (!put) {
                                        multiOptionsData[key].push({ value: item, count: 1 })
                                    }
                                }
                            }
                            break;
                        }
                        if (data[key] === undefined) {
                            data[key] = {};
                        }
                        for (const [subKey, subValue] of Object.entries(value)) {
                            switch (typeof subValue) {
                                case "number":
                                    if (data[key][subKey] === undefined) {
                                        data[key][subKey] = 0;
                                    }
                                    data[key][subKey] *= amountOfGames - 1;
                                    data[key][subKey] += subValue;
                                    data[key][subKey] /= amountOfGames;

                                    break;
                                case "boolean":
                                    if (data[key][subKey] === undefined) {
                                        data[key][subKey] = 0;
                                    }
                                    data[key][subKey] *= amountOfGames - 1;
                                    data[key][subKey] += value ? 1 : 0;
                                    data[key][subKey] /= amountOfGames;

                                    break;
                                default:
                                    console.warn("the type of the stat " + key + "\\" + subKey + " (" + typeof subValue + ") is not supported");

                                    break;
                            }
                        }

                        break;
                    default:
                        console.warn("the type of the stat " + key + " (" + typeof value + ") is not supported");

                        break;
                }
            }
        });
        for (const [key, value] of Object.entries(booleanData)) {
            data[key] = `${(value / amountOfGames).toFixed(2).replace(/[.,]00$/, "")}% (${value} out of ${amountOfGames})`;
        }
        for (const [key, value] of Object.entries(multiOptionsData)) {
            let str = '';
            for (const item of value) {
                str += `${item.value} - ${item.count} times, `;
            }

            data[key] = str
        }
        return data;
    }

    exportDataToAverageGUI = (mongoData) => {
        let data = this.getAverageOfStatsFromMongoData(mongoData);
        let gamesGUI = [];
        let graphLabels = [];
        let graphValues = []; // {lable: '', data: []}

        for (const [key, value] of Object.entries(data)) {
            switch (typeof value) {
                case 'number':
                    gamesGUI.push(<p key={key}>{`${key}: ${value.toFixed(2).replace(/[.,]00$/, "")}`}</p>);

                    break;
                case "string":
                    gamesGUI.push(<p key={key}>{`${key}: ${value}`}</p>);

                    break;
                case 'object':
                    for (const dataSet of graphValues)
                        dataSet.data.push(0)
                    graphLabels.push(key);

                    for (const [subKey, subValue] of Object.entries(value)) {
                        switch (typeof subValue) {
                            case 'number':
                                graphValues.push({ label: subKey, data: [] });

                                for (let i = 0; i < graphLabels.length - 1; i++)
                                    graphValues[graphValues.length - 1].data.push(0);

                                graphValues[graphValues.length - 1].data.push(subValue);

                                break;
                            default:
                                console.warn(`the type of the stat ${key}\\${subKey} (${typeof subValue}) is not supported`);
                        }
                    }
                    break;
                default:
                    console.warn(`the type of the stat ${key} (${typeof value}) is not supported`);
            }
        }

        gamesGUI.push(<BarGraph labels={graphLabels} values={graphValues} />)

        return gamesGUI;
    }

    componentDidMount() {
        fetch(`${API}/api/teams/${this.TEAM}`,
            {
                method: "GET",
                credentials: "include",
            }).then(res => {
                return res.json();
            }).then(data => {
                data = this.badConversion(data);
                if (data.detail != undefined) { // team not found.
                    window.location.href = "/stats";
                }

                this.setState({ mongoData: data })
            }).catch(e => {
                alert(e);
            })
    }

    render() {
        return <div className='team-stats-page'>
            <h1>Team {this.TEAM}</h1>
            {this.exportDataToAverageGUI(this.state.mongoData)}
        </div>;
    }
}
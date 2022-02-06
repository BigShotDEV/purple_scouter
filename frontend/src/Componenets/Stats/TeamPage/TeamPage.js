import React, { useState } from 'react';
import { API } from '../../../Utils/authentication';
import BarGraph from './graphs/graph';
import './teamPage.css'

export default class TeamPage extends React.Component {
    TEAM = window.location.pathname.match(/\/stats\/teams\/(.*)/)[1];

    constructor(props) {
        super(props)
        this.state = {
            mongoData: []
        }
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
                        if (data[key] === undefined) {
                            data[key] = 0;
                        }
                        data[key] *= amountOfGames - 1;
                        data[key] += value ? 1 : 0;
                        data[key] /= amountOfGames;

                        break;
                    case "object":
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
                    console.log(graphValues)
                    console.log(graphLabels)
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
                this.setState({ mongoData: data })
            }).catch(e => {
                alert(e);
            })
    }

    render() {
        return <div className='TeamPage'>
            <h1>Team {this.TEAM}</h1>
            {this.exportDataToAverageGUI(this.state.mongoData)}
        </div>;
    }
}
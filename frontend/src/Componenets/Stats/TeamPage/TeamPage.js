import React, { useState } from 'react';
import { API } from '../../../Utils/authentication';

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

    exportDataToGUI = (mongoData) => {
        let data = this.getAverageOfStatsFromMongoData(mongoData);
        let gamesGUI = [];


    }

    componentDidMount() {
        fetch(`${API}/api/teams/${this.TEAM}`,
            {
                method: "GET",
                credentials: "include",
            }).then(res => {
                return res.json();
            }).then(data => {
                console.log(this.getAverageOfStatsFromMongoData(data));
                this.setState({ mongoData: data })
            }).catch(e => {
                alert(e);
            })
    }

    render() {
        return <div className='TeamPage' >
            <h1>Team {this.TEAM}</h1>

        </div>;
    }
}
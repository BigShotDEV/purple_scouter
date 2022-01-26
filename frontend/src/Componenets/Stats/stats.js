import React from 'react';
import Select from "react-select"
import { API } from '../../Utils/authentication';
import BarGraph from './graphs/graph';
import './stats.css'

/**
 * this method resorts the mongo data by teams
 * 
 * @param {Object} mongoData the data recieved form mongodb
 * @returns the same data sorted by teams
 */
let exportMongoToTeams = (mongoData) => {
    let rawTeamsData = {};

    mongoData.forEach(item => {
        if (rawTeamsData[item.team_number] === undefined) {
            rawTeamsData[item.team_number] = {};
        }
        rawTeamsData[item.team_number][item.game_number] = item.stats;
    });

    return rawTeamsData;
}
/**
 * this method exports a data sheet into a graph form
 * 
 * @param {Object} data  the data to parse
 * @returns the data sorted into an array of divs ready to be rendered
 */
let exportDataToRender = (rawTeamsData) => {
    let teamsData = [];

    for (const [team, games] of Object.entries(rawTeamsData)) {
        let graphLabels = [];
        let graphValues = []; // {lable: '', data: []}
        let precentageValues = [];
        let amountOfGames = 0;

        for (const [key, value] of Object.entries(Object.values(games)[0])) {
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

/**
 * this method flattens the data sorted by teams 
 * 
 * @param {Object} rawTeamsData the data to flatten
 * @returns the flattened data
 */
let flattenTeamsData = (rawTeamsData) => {
    let copyTeamsData = JSON.parse(JSON.stringify(rawTeamsData)); // deep copy

    let flattenedData = {};

    for (const [team, games] of Object.entries(copyTeamsData)) {
        let amountOfGames = 0;
        let flattenedTeamData = {}
        for (const [game, stats] of Object.entries(games)) {
            amountOfGames++;
            for (const [key, value] of Object.entries(stats)) {
                switch (typeof value) {
                    case "number":
                        if (flattenedTeamData[key] === undefined) {
                            flattenedTeamData[key] = amountOfGames;
                        }
                        flattenedTeamData[key] *= amountOfGames - 1;
                        flattenedTeamData[key] += value;
                        flattenedTeamData[key] /= amountOfGames;
                        
                        break;
                        case "boolean":
                            if (flattenedTeamData[key] === undefined) {
                            flattenedTeamData[key] = amountOfGames;
                        }
                        flattenedTeamData[key] *= amountOfGames - 1;
                        flattenedTeamData[key] += value ? 1 : 0;
                        flattenedTeamData[key] /= amountOfGames;

                        break;
                    case "object":
                        if (flattenedTeamData[key] === undefined) {
                            flattenedTeamData[key] = {};
                        }
                        for (const [subKey, subValue] of Object.entries(value)) {
                            switch (typeof subValue) {
                                case "number":
                                    if (flattenedTeamData[key][subKey] === undefined) {
                                        flattenedTeamData[key][subKey] = amountOfGames;
                                    }
                                    flattenedTeamData[key][subKey] *= amountOfGames - 1;
                                    flattenedTeamData[key][subKey] += subValue;
                                    flattenedTeamData[key][subKey] /= amountOfGames;

                                    break;
                                case "boolean":
                                    if (flattenedTeamData[key][subKey] === undefined) {
                                        flattenedTeamData[key][subKey] = amountOfGames;
                                    }
                                    flattenedTeamData[key][subKey] *= amountOfGames - 1;
                                    flattenedTeamData[key][subKey] += value ? 1 : 0;
                                    flattenedTeamData[key][subKey] /= amountOfGames;

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
        }
        flattenedData[team] = flattenedTeamData;
    }

    return flattenedData;
}

/**
 * this method exports the teams titles from the data sorted by a parameter
 * 
 * @param {Object} rawTeamsData the data from which to get the titles
 * @param {String} sortKey the sorting key
 * @returns the teams titles from the data
 */
let exportTitles = (rawTeamsData, sortKey) => {
    sortKey = "didClimb";

    if (sortKey === undefined || sortKey === null) {
        return Object.keys(rawTeamsData);
    }

    let flattenedTeamData = flattenTeamsData(rawTeamsData);
    let titles = [];

    while (titles.length < Object.keys(flattenedTeamData).length) {
        let maxTeam;

        for (const [team, stats] of Object.entries(flattenedTeamData)) {
            if (!titles.includes(team) && maxTeam === undefined) {
                maxTeam = team;
            } else if (!titles.includes(team) && stats[sortKey] > flattenedTeamData[maxTeam][sortKey]) {
                maxTeam = team;
            }
        }
        titles.push(maxTeam);
    }
    
    console.log("titles: " + titles)
    return titles;
}

/**
 * this method exports the teams titles from the data sorted by a parameter
 * 
 * @param {Object} rawTeamsData the data from which to get the titles
 * @param {String} sortKey the sorting key
 * @returns the teams titles from the data
 */
let exportTitlesGUI = (rawTeamsData, sortKey) => {
    let titles = exportTitles(rawTeamsData, sortKey);
    let GUITitles = [];

    console.log(titles)
    for (const title of titles) {
        console.log(title)
        GUITitles.push(<button>{title}</button>)
    }

    return GUITitles
}

export default class Stats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamsData: []
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
                this.setState({ teamsData: exportMongoToTeams(data) });
            }).catch(e => {
                alert(e);
            })
    }

    render() {

        return (
            <div className="stats-page">
                <div className='centered'>sort by: <Select className='select' options={[
                    { value: "hi", label: "asd" }
                ]} /></div>
                {exportTitlesGUI(this.state.teamsData)}
            </div>
        )
    }
}
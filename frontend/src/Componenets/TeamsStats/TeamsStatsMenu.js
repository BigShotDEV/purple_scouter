import React, { useState } from 'react';
import Select from "react-select"
import { API } from '../../Utils/authentication';
import Nav from '../Nav/nav';
import './TeamsStatsMenu.css'

export default class Stats extends React.Component {
    /**
    * this method resorts the mongo data by teams
    * 
    * @param {Object} mongoData the data recieved form mongodb
    * @returns the same data sorted by teams
    */
    exportMongoToTeams = (mongoData) => {
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
     * this method flattens the data sorted by teams 
     * 
     * @param {Object} rawTeamsData the data to flatten
     * @returns the flattened data
     */
    flattenTeamsData = (rawTeamsData) => {
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

                                        break;
                                }
                            }

                            break;
                        default:

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
    exportTitles = (rawTeamsData, sortKey) => {
        if (sortKey === undefined || sortKey === null || typeof sortKey != "string") {
            return Object.keys(rawTeamsData);
        }

        let objKey = '';
        if(sortKey.includes("⇾")) {
            [objKey, sortKey] = sortKey.split("⇾");
        }

        let flattenedTeamData = this.flattenTeamsData(rawTeamsData);
        let titles = [];

        while (titles.length < Object.keys(flattenedTeamData).length) {
            let maxTeam;

            for (const [team, stats] of Object.entries(flattenedTeamData)) {
                if (!titles.includes(team) && maxTeam === undefined) {
                    maxTeam = team;
                } else if (objKey !== '' && !titles.includes(team) && stats[objKey][sortKey] > flattenedTeamData[maxTeam][objKey][sortKey]) {
                    maxTeam = team;
                } else if (!titles.includes(team) && stats[sortKey] > flattenedTeamData[maxTeam][sortKey]) {
                    maxTeam = team;
                }
            }
            titles.push(maxTeam);
        }

        return titles;
    }

    /**
     * this method exports the teams titles from the data sorted by a parameter
     * 
     * @param {Object} rawTeamsData the data from which to get the titles
     * @param {String} sortKey the sorting key
     * @returns the teams titles from the data
     */
    exportTeamsButtons = (rawTeamsData, sortKey) => {
        let titles = this.exportTitles(rawTeamsData, sortKey);
        let GUITitles = [];

        for (const title of titles) {
            GUITitles.push(
                <div className='team-button'>
                    <button onClick={() => {
                        window.location.href = "/stats/teams/" + title
                    }}>{title}</button>
                </div>
            )
        }

        return GUITitles
    }

    /**
     * 
     * @param {Object} rawTeamsData the data from which to get the keys
     * @returns 
     */
    exportSortingKeys = (rawTeamsData) => {
        if (rawTeamsData.length === 0) return [{ value: "error", label: "error" }];

        let keys = [];

        for (const [key, value] of Object.entries(Object.values(Object.values(rawTeamsData)[0])[0])) {
            switch (typeof value) {
                case "boolean":
                case "number":
                    keys.push(key);
                    break;
                case "object":
                    for (const [subKey, subValue] of Object.entries(value)) {
                        switch (typeof subValue) {
                            case "boolean":
                            case "number":
                                keys.push(key + "⇾" + subKey)
                        }
                    }
                    break;
            }
        }

        let select_items = [];
        keys.forEach(key => {
            select_items.push({ value: key, label: key });
        })
        return select_items;
    }

    updateSortingTitle = (selectObj) => {
        this.setState({ sortingKey: selectObj.value });
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
                this.setState({ teamsData: this.exportMongoToTeams(data) });
            }).catch(e => {
                alert(e);
            })
    }

    handleSubmit = (input) => {
        // window.location.href = "stats/teams/" + input
        alert(input.search)
    }

    constructor(props) {
        super(props);

        this.state = {
            teamsData: [],
            /*
            teamName1: {
                gameNum1: {
                    stat1: val,
                    stat2: val2
                },
                gameNum2: {
                    stat1: val,
                    stat2: val2
                }
            },
            teamName2: {
                gameNum1: {
                    stat1: val,
                    stat2: val2
                },
                gameNum2: {
                    stat1: val,
                    stat2: val2
                }
            }
            */
            sortingKey: ""
        };

    }

    render() {

        return (
            <div className="teams-stats-menu">
                <SearchBar />
                <Select className='select centered'
                    options={this.exportSortingKeys(this.state.teamsData)} placeholder="sort by"
                    onChange={this.updateSortingTitle}
                    styles={
                        {
                            option: (provided, state) => ({
                                ...provided,
                                borderTop: '1px solid gray',
                                backgroundColor: state.isSelected ? '#bfbbbf' : (state.isFocused ? '#bbbbbb' : '#cccccc'),
                                color: state.isSelected ? 'red' : 'black',
                                padding: 8
                            }),
                            control: (provided, state) => ({
                                ...provided,
                                backgroundColor: 'light-gray',
                                border: '0px',
                                padding: 0,
                            }),
                            indicatorSeparator: (provided, state) => ({
                                ...provided,
                                backgroundColor: 'white',
                                border: '0px'
                            }),
                            placeholder: (provided, state) => ({
                                ...provided,
                                color: 'white',
                                border: '0px',
                                padding: 0,
                            }),
                            menu: (provided, state) => ({
                                ...provided,
                                backgroundColor: '#cccccc',
                                border: '0px',
                                padding: 0,
                            }),
                            singleValue: (provided, state) => ({
                                ...provided,
                                color: 'white',
                                border: '5px',
                                padding: 0,
                            })
                        }}
                />
                {this.exportTeamsButtons(this.state.teamsData, this.state.sortingKey)}
            </div>
        )
    }
}

function SearchBar() {
    const [team, setTeam] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.href = "stats/teams/" + team
    }

    return (
        <>
            <Nav items={[{ title: "home", link: "/" }, { title: "login", link: "/login" }, { title: "stats", link: "/stats" }]}></Nav>

            <form onSubmit={handleSubmit}>
                <div className='stats-menu-input-field centered'>
                    <input
                        className='stats-menu-input test'
                        type="text"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                    />
                </div>
            </form>
    </>
    )
}
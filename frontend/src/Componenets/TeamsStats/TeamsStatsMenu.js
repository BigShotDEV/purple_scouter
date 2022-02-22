import React, { useState } from 'react';
import Select from "react-select"
import { API } from '../../Utils/authentication';
import Nav from '../Nav/nav';
import './TeamsStatsMenu.css'

export default class Stats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            averagedTeamsData: [],
            sortingKey: "",
            language: "english"
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
                this.setState({ averagedTeamsData: this.averageTeamsData(data) });
                console.log(this.state.averagedTeamsData)
            }).catch(e => {
                alert(e);
            })
    }

    /**
    * this method resorts the mongo data by teams
    * 
    * @param {Object} mongoData the data recieved form mongodb
    * @returns the same data sorted by teams
    */
    exportMongoToTeams = (mongoData) => {
        let teamsData = {};

        mongoData.forEach(item => {
            if (teamsData[item.team_number] === undefined) {
                teamsData[item.team_number] = {};
            }
            teamsData[item.team_number][item.game_number] = item.stats;
        });

        return teamsData;
    }

    /**
     * this method averages the data sorted by teams 
     * 
     * @param {Object} mongoData the data to average
     * @returns the averaged data
     */
    averageTeamsData = (mongoData) => {
        let teamsData = this.exportMongoToTeams(mongoData)
        let averageData = {};
        for (const [team, games] of Object.entries(teamsData)) {
            let averageTeamsData = [];
            let amountOfGames = 0;
            for (const game of Object.values(games)) {
                amountOfGames++;
                game.forEach((stat, index) => {
                    switch (typeof stat.value) {
                        case 'number':
                            if (index > averageTeamsData.length - 1) {
                                averageTeamsData.push({ title: stat.title, value: 0 });
                            }
                            averageTeamsData[index].value *= amountOfGames - 1;
                            averageTeamsData[index].value += stat.value;
                            averageTeamsData[index].value /= amountOfGames;
                            break;
                        case 'boolean':
                            if (index > averageTeamsData.length - 1) {
                                averageTeamsData.push({ title: stat.title, value: 0 });
                            }
                            if (averageTeamsData.values) {
                                averageTeamsData[index].value *= amountOfGames - 1;
                                averageTeamsData[index].value++;
                                averageTeamsData[index].value /= amountOfGames;
                            }
                            break;
                        default:
                            if (index > averageTeamsData.length - 1) {
                                averageTeamsData.push({ title: stat.title, value: "non-countable" });
                            }
                    }
                });
            }
            averageData[team] = averageTeamsData;
        }
        return averageData;
    }

    /**
     * this method exports the teams titles from the data sorted by a parameter
     * 
     * @param {Object} averagedTeamsData the data from which to get the titles
     * @param {String} sortKey the sorting key
     * @returns the teams titles from the data
     */
    exportTeamsNumbers = (averagedTeamsData, sortIndex) => {
        let titles = [3075, 1690, 248, 3339];
        // let titles = [];

        

        // while()

        return titles;
    }

    /**
     * this method exports the teams titles from the data sorted by a parameter
     * 
     * @param {Object} averagedTeamsData the data from which to get the titles
     * @param {String} sortKey the sorting key
     * @returns the teams titles from the data
     */
    exportTeamsButtons = (averagedTeamsData, sortKey) => {
        let titles = this.exportTeamsNumbers(averagedTeamsData, sortKey);
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
     * @param {Object} averagedTeamsData the data from which to get the keys
     * @returns 
     */
    exportSortingKeys = (averagedTeamsData) => {
        if (averagedTeamsData === null || averagedTeamsData.length < 1)
            return [];

        let gameExample = Object.values(averagedTeamsData)[0];
        let keys = []

        gameExample.forEach((stat, index) => {
            if (typeof stat.value === 'number') keys.push({value: index, label: stat.title[this.state.language]});
        });


        return keys;
    }

    updateSortingTitle = (selectObj) => {
        this.setState({ sortingKey: selectObj.value });
    }

    selectStyle = {
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
    }

    render() {

        return (
            <div className="teams-stats-menu">
                <SearchBar />
                <Select className='select centered'
                    options={this.exportSortingKeys(this.state.averagedTeamsData)}
                    placeholder={this.state.language === "hebrew" ? "מיין על פי:" : "sort by"}
                    onChange={this.updateSortingTitle}
                    styles={this.selectStyle}
                />
                {this.exportTeamsButtons(this.state.averagedTeamsData, this.state.sortingKey)}
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
import React, { useState } from 'react';
import Select from "react-select"
import { API } from '../../Utils/authentication';
import Nav from '../Nav/nav';
import './TeamsStatsMenu.css'

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}


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
                                averageTeamsData.push({ title: stat.title, value: 0, team_name: team });
                            }
                            averageTeamsData[index].value *= amountOfGames - 1;
                            averageTeamsData[index].value += stat.value;
                            averageTeamsData[index].value /= amountOfGames;
                            break;
                        case 'boolean':
                            if (index > averageTeamsData.length - 1) {
                                averageTeamsData.push({ title: stat.title, value: 0, team_name: team });
                            }
                            if (averageTeamsData.values) {
                                averageTeamsData[index].value *= amountOfGames - 1;
                                averageTeamsData[index].value++;
                                averageTeamsData[index].value /= amountOfGames;
                            }
                            break;
                        default:
                            if (index > averageTeamsData.length - 1) {
                                averageTeamsData.push({ title: stat.title, value: "non-countable", team_name: team });
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
    exportTeamsNumbers = (averagedTeamsData, sortKey) => {
        let values = [];
        var lastgame = "0";
        for (const [team, games] of Object.entries(averagedTeamsData)){
            if (games.length === 0) continue;
            games.forEach((stat, index) => {
                if(sortKey == stat.title[this.state.language]){
                            if(values.find(function(title_s){return title_s == team})){
                                console.log("whats")
                                
                            } else{
                                console.log("what")
                                values.push({team: team, value: stat.value})
                            }
                    
                } else if(sortKey == ""){
                    if(lastgame != team){
                        values.push({team: team, value: 0})
                    }
                }
            lastgame = team
            })
        }
        // for(var i = 0; i < values.length; i++){
        //     if(i > 0 && values[i].team != values[i-1].team){
        //         team_values.push(values[i].team + "-" + values[i].value)
        //     } else if(i == 0) {
        //         team_values.push(values[i].team + "-" + values[i].value)
        //     }
        // }
        console.log(values)
        var titles = [];
        var max = 0
        for(const team_value of values){
            titles.push(team_value.team)
        }
        for(const team_value of values){
            if(team_value.value > max){
                titles = arrayRemove(titles, team_value.team)
                titles.push(team_value.team)
                max = team_value.value
                console.log(2)
            }
        }
        // for(var i = 0; i < titles.length; i ++){
        //     titles[i] = titles[i].split("-").shift()
        // }

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
            GUITitles.unshift(
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
        console.log(averagedTeamsData)
        if (averagedTeamsData === null || averagedTeamsData.length < 1) return [];

        let gameExample = Object.values(averagedTeamsData)[0];
        let keys = []

        gameExample.forEach((stat, index) => {
            if (typeof stat.value === 'number') keys.push({value: index, label: stat.title[this.state.language]});
        });

        console.log(keys)
        return keys;
    }

    updateSortingTitle = (selectObj) => {
        this.setState({ sortingKey: selectObj.label });
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
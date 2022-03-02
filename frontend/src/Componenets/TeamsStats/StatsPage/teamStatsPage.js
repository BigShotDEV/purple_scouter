import React, { useState } from 'react';
import { API } from '../../../Utils/authentication';
import Select from "react-select"
import Nav from '../../Nav/nav';
import BarGraph from './graphs/graph';
import './teamStatsPage.css'

function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
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

export default class TeamStatsPage extends React.Component {
    TEAM = window.location.pathname.match(/\/stats\/teams\/(.*)/)[1];

    constructor(props) {
        super(props)
        this.state = {
            mongoData: [],
            amountOfGames: 0,
            sortingKey: "",
            language: 'english'
        }
    }


    componentDidMount() {
        fetch(`${API}/api/teams/${this.TEAM}`,
            {
                method: "GET",
                credentials: "include",
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.detail != undefined) { // team not found.
                    window.location.href = "/stats";
                }

                this.setState({ mongoData: data, amountOfGames: data.length })
            }).catch(e => {
                alert(e);
            })
    }

    summerizeNumber(index, type) {
        if(type == "avg"){
            let average = 0;

            this.state.mongoData.forEach(game => {
                average += game.stats[index].value;
            });

            average /= this.state.amountOfGames;

            return round(average);
        } else if(type == "max") {
            let max = 0;

            this.state.mongoData.forEach(game => {
                if(game.stats[index].value > max){
                    max = game.stats[index].value
                }
            })
            return max
        } else if(type == "min"){
            let min = 1000

            this.state.mongoData.forEach(game => {
                if(game.stats[index].value < min){
                    min = game.stats[index].value
                }
            })
            return min
        } else if(type == "total"){
            let total = 0;

            this.state.mongoData.forEach(game => {
                total += game.stats[index].value;
            });

            return total;
        }
    }

    summerizeBoolean(index, type) {
        if(type == "avg"){
            let sum = 0;

            this.state.mongoData.forEach(game => {
                if (game.stats[index].value) sum++;
            });

            let outOf = 'out of';
            if (this.state.language === 'hebrew') outOf = 'מתוך';

            return `${round(sum / this.state.amountOfGames * 100)}% (${sum} ${outOf} ${this.state.amountOfGames})`;
        }else if(type == "max"){
            let sum = 0
            
            this.state.mongoData.forEach(game => {
                if(game.stats[index].value > sum){
                    sum = game.stats[index].value
                }
            })

            return `${sum}`;
        } else if(type == "min"){
            let sum = 1000

            this.state.mongoData.forEach(game => {
                if(game.stats[index].value < sum){
                    sum = game.stats[index].value
                } 
            })

            return `${sum}`;
        } else if(type == "total"){
            let sum = 0;

            this.state.mongoData.forEach(game => {
                if (game.stats[index].value) sum++;
            });

            let outOf = 'out of';
            if (this.state.language === 'hebrew') outOf = 'מתוך';

            return `(${sum} ${outOf} ${this.state.amountOfGames})`;
        }
    }

    summerizeString(index, type) {
        if(type == "avg"){
            let data = []

            this.state.mongoData.forEach(game => {
                let wasAdded = false;

                for (const dataPiece of data) {
                    if (dataPiece.value === game.stats[index].value[this.state.language]) {
                        wasAdded = true;
                        dataPiece.count++;
                        break;
                    }
                }

                if (!wasAdded) {
                    data.push({ value: game.stats[index].value[this.state.language], count: 1 });
                }
            });

            let text = '';

            let outOf = 'out of';
            if (this.state.language === 'hebrew') outOf = 'מתוך';

            data.forEach(dataPiece => {
                text += `${dataPiece.value} - ${round(dataPiece.count / this.state.amountOfGames * 100)}% (${dataPiece.count} ${outOf} ${this.state.amountOfGames}), `
            })

            return text
        } else if(type == "max"){
            let values = [{label: "Low", value: 0}, {label: "High", value: 1}, {label: "No", value: 0}, {label: "Doesn't position good", value: 1}, {label: "Position good", value: 2}, {label: "A bit", value: 1}, {label: "The entire game", value: 2}, {label: "(1) Low", value: 1}, {label: "(2) Meduim", value: 2}, {label: "(3) High", value: 3}, {label: "(4) Highest", value: 4}, {label: "He fell", value: 0.5}, {label: "Slow", value: 0}, {label: "Fast", value: 1}, {label: "Very fast", value: 2}]
            let max = -1;
            let answer = [{label: "", value: 0}];

            this.state.mongoData.forEach(game => {
            values.forEach(value => {
                if(value.label === game.stats[index].value[this.state.language] && value.value > max){
                    answer[0].label = game.stats[index].value[this.state.language]
                    answer[0].value = value.value
                    max = value.value
                }
            })
        })
            return answer[0].label
        } else if(type == "min"){
            let values = [{label: "Low", value: 0}, {label: "High", value: 1}, {label: "No", value: 0}, {label: "Doesn't position good", value: 1}, {label: "Position good", value: 2}, {label: "A bit", value: 1}, {label: "The entire game", value: 2}, {label: "(1) Low", value: 1}, {label: "(2) Meduim", value: 2}, {label: "(3) High", value: 3}, {label: "(4) Highest", value: 4}, {label: "He fell", value: 0.5}, {label: "Slow", value: 0}, {label: "Fast", value: 1}, {label: "Very fast", value: 2}]
            let min = 1000;
            let answer = [{label: "", value: 0}];

            this.state.mongoData.forEach(game => {
            values.forEach(value => {
                if(value.label === game.stats[index].value[this.state.language] && value.value < min){
                    answer[0].label = game.stats[index].value[this.state.language]
                    answer[0].value = value.value
                    min = value.value
                }
            })
        })
            return answer[0].label
        } else if(type == "total"){
            let data = []

            this.state.mongoData.forEach(game => {
                let wasAdded = false;

                for (const dataPiece of data) {
                    if (dataPiece.value === game.stats[index].value[this.state.language]) {
                        wasAdded = true;
                        dataPiece.count++;
                        break;
                    }
                }

                if (!wasAdded) {
                    data.push({ value: game.stats[index].value[this.state.language], count: 1 });
                }
            });

            let text = '';

            let outOf = 'out of';
            if (this.state.language === 'hebrew') outOf = 'מתוך';

            data.forEach(dataPiece => {
                text += `${dataPiece.value} - (${dataPiece.count}), `
            })

            return text
        }
    }

    summerizeArray(index) {
        let data = []

        this.state.mongoData.forEach(game => {
            game.stats[index].value.forEach(value => {
                let wasAdded = false;

                for (const dataPiece of data) {
                    if (dataPiece.value === value) {
                        wasAdded = true;
                        dataPiece.count++;
                        break;
                    }
                }

                if (!wasAdded) {
                    data.push({ value: value, count: 1 });
                }
            })
        });

        let text = '';

        let outOf = 'out of';
        if (this.state.language === 'hebrew') outOf = 'מתוך';

        data.forEach(dataPiece => {
            text += `${dataPiece.value} - ${round(dataPiece.count / this.state.amountOfGames * 100)}% (${dataPiece.count} ${outOf} ${this.state.amountOfGames}), `
        })

        return text;
    }

    summerize(index, type) {
        let value = this.state.mongoData[0].stats[index].value;

        switch (typeof value) {
            case 'number':
                return this.summerizeNumber(index, type);
            case 'boolean':
                return this.summerizeBoolean(index, type);
            case 'object':
                if (value[this.state.language] !== null) {
                    switch (typeof value[this.state.language]) {
                        case 'string':

                            return this.summerizeString(index, type)
                        case 'object':
                            if (Array.isArray(value[this.state.language])){
                                return this.summerizeArray(index)
                            }
                        default:
                            console.warn(`the type ${typeof value[this.state.language]} is not supported`);
                            return 'unsupported type';
                    }
                }
            default:
                console.warn(`the type ${typeof value} is not supported`);
                return 'unsupported type';
        }
    }

    renderGraph(valueIndexes) {
        if (valueIndexes.length === 0) return <></>;
        let labels = [];
        let values = []; // {label: '', data: []}

        valueIndexes.forEach(index => {
            let statExample = this.state.mongoData[0].stats[index];

            if (!labels.includes(statExample.graph_stack[this.state.language])) {
                labels.push(statExample.graph_stack[this.state.language]);
            }

            let data = [];
            for (let i = 0; i < labels.indexOf(statExample.graph_stack[this.state.language]); i++) {
                data.push(0);
            }

            data.push(this.summerizeNumber(index));

            values.push({ label: statExample.title[this.state.language], data: data });
        });

        return <BarGraph values={values} labels={labels} />
    }

    exportSortingKeys = () => {

        let keys = []
        keys.push({value: 0, label: "avg"})
        keys.push({value: 1, label: "max"})
        keys.push({value: 2, label: "min"})
        keys.push({value: 3, label: "total"})
        return keys;
    }

    renderData() {
        if (this.state.mongoData.length === 0) return <p className='english-paragraph'>sorry, no data is avaliable</p>

        let renderedData = [];
        let graphValuesIndexes = [];


        if (this.state.language === 'hebrew') renderedData.push(<p className='hebrew-paragraph'>סך הכל משחקים: {this.state.amountOfGames}</p>)
        if (this.state.language === 'english') renderedData.push(<p className='english-paragraph'>total games: {this.state.amountOfGames}</p>)
        if(this.state.language === 'english') renderedData.push(<div className="teams-stats-menu">
        <Select className='select centered'
            options={this.exportSortingKeys()}
            placeholder={this.state.language === "hebrew" ? "מיין על פי:" : "sort by"}
            onChange={this.updateSortingTitle}
            styles={this.selectStyle}
        />
    </div>)
        for (let i = 0; i < this.state.mongoData[0].stats.length; i++) {
            if (this.state.mongoData[0].stats[i].graph_stack !== undefined) {
                graphValuesIndexes.push(i);
                continue;
            }

            renderedData.push(
                <p className={this.state.language + "-paragraph"}>{this.state.mongoData[0].stats[i].title[this.state.language]}: {this.summerize(i, this.state.sortingKey)}</p>
            );
        }

        renderedData.push(this.renderGraph(graphValuesIndexes));

        return renderedData;
    }

    render() {
        return <div className='team-stats-page'>
            <Nav items={[{ title: "home", link: "/" }, { title: "login", link: "/login" }, { title: "stats", link: "/stats" }]}></Nav>
            <h1>Team</h1>
            {this.renderData()}
        </div>;
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
    updateSortingTitle = (selectObj) => {
        this.setState({ sortingKey: selectObj.label });
    }
}
import React, { useState } from 'react';
import { API } from '../../../Utils/authentication';
import Nav from '../../Nav/nav';
import BarGraph from './graphs/graph';
import './teamStatsPage.css'

function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}

export default class TeamStatsPage extends React.Component {
    TEAM = window.location.pathname.match(/\/stats\/teams\/(.*)/)[1];

    constructor(props) {
        super(props)
        this.state = {
            mongoData: [],
            amountOfGames: 0,
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

    summerizeNumber(index) {
        let average = 0;

        this.state.mongoData.forEach(game => {
            average += game.stats[index].value;
        });

        average /= this.state.amountOfGames;

        return round(average);
    }

    summerizeBoolean(index) {
        let sum = 0;

        this.state.mongoData.forEach(game => {
            if (game.stats[index].value) sum++;
        });

        let outOf = 'out of';
        if (this.state.language === 'hebrew') outOf = 'מתוך';

        return `${round(sum / this.state.amountOfGames * 100)}% (${sum} ${outOf} ${this.state.amountOfGames})`;
    }

    summerizeString(index) {
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
    }

    summerizeArray(index) {
        let data = []

        this.state.mongoData.forEach(game => {
            game.stats[index].value.forEach(value => {
                console.log(value)
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

    summerize(index) {
        let value = this.state.mongoData[0].stats[index].value;

        switch (typeof value) {
            case 'number':
                return this.summerizeNumber(index);
            case 'boolean':
                return this.summerizeBoolean(index);
            case 'object':
                if (value[this.state.language] !== null) {
                    switch (typeof value[this.state.language]) {
                        case 'string':
                            return this.summerizeString(index)
                        case 'object':
                            if (Array.isArray(value[this.state.language]))
                                return this.summerizeArray(index)
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

    renderData() {
        if (this.state.mongoData.length === 0) return <p className='english-paragraph'>sorry, no data is avaliable</p>

        let renderedData = [];
        let graphValuesIndexes = [];

        if (this.state.language === 'hebrew') renderedData.push(<p className='hebrew-paragraph'>סך הכל משחקים: {this.state.amountOfGames}</p>)
        if (this.state.language === 'english') renderedData.push(<p className='english-paragraph'>total games: {this.state.amountOfGames}</p>)

        for (let i = 0; i < this.state.mongoData[0].stats.length; i++) {
            if (this.state.mongoData[0].stats[i].graph_stack !== undefined) {
                graphValuesIndexes.push(i);
                continue;
            }

            renderedData.push(
                <p className={this.state.language + "-paragraph"}>{this.state.mongoData[0].stats[i].title[this.state.language]}: {this.summerize(i)}</p>
            );
        }

        renderedData.push(this.renderGraph(graphValuesIndexes));

        return renderedData;
    }

    render() {
        return <div className='team-stats-page'>
            <Nav items={[{ title: "home", link: "/" }, { title: "login", link: "/login" }, { title: "stats", link: "/stats" }]}></Nav>

            <h1>Team {this.TEAM}</h1>
            {this.renderData()}
        </div>;
    }
}
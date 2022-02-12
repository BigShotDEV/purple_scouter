import React, { useState } from 'react';
import { API } from '../../../Utils/authentication';
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
            language: 'hebrew'
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

    determineParagraphLanguageClass() {
        if (this.state.language === 'hebrew')
            return 'hebrew-paragraph'
        if (this.state.language === 'english')
            return 'english-paragraph'
    }

    summerizeNumber(index) {
        let average = 0;

        this.state.mongoData.forEach(game => {
            average += game.stats[index].value;
        });

        average /= this.state.amountOfGames;

        return average;
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
                if (dataPiece.value === game.stats[index].value) {
                    wasAdded = true;
                    dataPiece.count++;
                    break;
                }
            }

            if (!wasAdded) {
                data.push({ value: game.stats[index].value, count: 1 });
            }
        });

        let text = '';

        let outOf = 'out of';
        if (this.state.language === 'hebrew') outOf = 'מתוך';

        data.forEach(dataPiece => {
            text += `${dataPiece.value} - ${round(dataPiece.count/this.state.amountOfGames*100)}% (${dataPiece.count} ${outOf} ${this.state.amountOfGames}), `
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
            text += `${dataPiece.value} - ${round(dataPiece.count/this.state.amountOfGames*100)}% (${dataPiece.count} ${outOf} ${this.state.amountOfGames}), `
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
            case 'string':
                return this.summerizeString(index);
            case 'object':
                if (Array.isArray(value))
                    return this.summerizeArray(index);
            default:
                console.warn(`the type ${typeof value} is not supported`);
                return 'unsupported type';
        }
    }

    renderData() {
        if (this.state.mongoData.length === 0) return <p>sorry, no data is avaliable</p>

        let renderedData = [];

        if (this.state.language === 'hebrew') renderedData.push(<p className='hebrew-paragraph'>סך הכל משחקים: {this.state.amountOfGames}</p>)

        for (let i = 0; i < this.state.mongoData[0].stats.length; i++) {
            renderedData.push(
                <p className={this.determineParagraphLanguageClass()}>{this.state.mongoData[0].stats[i].title}: {this.summerize(i)}</p>
            );
        }
        return renderedData;
    }

    render() {
        return <div className='team-stats-page'>
            <h1>Team {this.TEAM}</h1>
            {this.renderData()}
        </div>;
    }
}
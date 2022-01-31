import React, { useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import ColourGenerator from './colourGenerator';

export default class BarGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: this.props.labels,
            datasets: [],
        };

        let stackNum = 0;
        let colourGenerator = new ColourGenerator();

        if (this.props.values !== undefined && this.props.values !== null && Array.isArray(this.props.values)) {
            this.props.values.forEach((item, index) => {
                let nextColour = colourGenerator.generateNew(item.stack, item.newStack);
                if (item.newStack !== undefined && item.newStack) {
                    stackNum++;
                }
                this.state.datasets.push({
                    label: item.label,
                    backgroundColor: 'rgb(' + nextColour[0] + ',' + nextColour[1] + ',' + nextColour[2] + ')',
                    hoverBackgroundColor: 'rgb(240, 160, 50)',
                    borderColor: 'rgba(10,10,10,.9)',
                    hoverBorderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    pointStyle: 'triangle',
                    data: item.data,
                    stack: item.stack === undefined ? "stack " + stackNum : item.stack
                });
            });
        }
    }
    render() {
        return (
            <div className='graph'>
                <Bar
                    data={this.state}
                    options={{
                        aspectRatio: 1.2,
                        title: {
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        scales: {
                            x: {
                                display: true,
                                grid: {
                                    color: 'rgba(75, 37, 87,0)'
                                },
                                stacked: true
                            },
                            y: {
                                display: true,
                                grid: {
                                    color: 'rgb(75, 37, 87)'
                                },
                                stacked: true
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    pointStyle: 'circle',
                                    usePointStyle: true,
                                    padding: 25,
                                    boxWidth: 15,
                                    boxHeight: 15,
                                    // color: '#cccccc'
                                }
                            }
                        }
                    }}
                />
            </div>
        );
    }
}
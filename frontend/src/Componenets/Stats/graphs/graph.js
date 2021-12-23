import React, { useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     labels: this.props.labels,
        //     datasets: this.props.data.forEach(element => {
        //         return {
        //             label: element.label,
        //             backgroundColor:'rgba(75,192,192,1)',
        //             borderColor : 'rgba(0,0,0,1)',
        //             borderWidth : 2,
        //             data : element.data
        //         }
        //     })
        // }
        this.state = {
            labels: this.props.labels,
            datasets: [
                {
                    label: this.props.label,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: this.props.data
                }
            ]
        }
    }
    render() {
        return (
            <div className='graph'>
                <Bar
                    data={this.state}
                    options={{
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
                            },
                            y: {
                                display: true,
                                grid: {
                                    color: 'rgb(75, 37, 87)'
                                },
                            }
                        }
                    }}
                />
            </div>
        );
    }
}
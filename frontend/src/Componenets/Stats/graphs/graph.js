import React, { useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

export default class BarGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: this.props.labels,
            datasets: []
        }
        
        if(this.props.values !== undefined && this.props.values !== null && Array.isArray(this.props.values)){
            this.props.values.forEach((item, index) => {
                this.state.datasets.push({
                    label: item.label,
                    backgroundColor:'rgba(' + (199 + 3*index) +',' + (115 + 15*index) + ',' + (5 + 25*index) + ',1)',
                    borderColor : 'rgba(0,0,0,1)',
                    borderWidth : 2,
                    data : item.data
                });
            });
        };
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
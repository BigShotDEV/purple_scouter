import React from 'react';
import "./counter.css";

/**
 * A counter form,
 * has a increase and a decrease.
 *
 */
export default class Counter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            number: 0,
        }
    }

    /**
     * Sets the number to a new number.
     * 
     * @param {Int} number new number
     */
    setNumber = (number) => {
        this.props.numberChanged(this.props.id, number);
        this.setState({number: number});
    }

    /**
     * Increases the number by one.
     */
    incNumber = () => { 
        this.setNumber(this.state.number+1);
    }

    /**
     * Decreases the number by one.
     */
    decNumber = () => {
        this.setNumber(this.state.number-1);
    }

    render() {
        return (
            <div className="counter-container">
                <p className="title">{this.props.children}</p>
                
                <button className='counter-button counter-inc' onClick={this.incNumber}>+</button>
                <button className='counter-button counter-dec' onClick={this.decNumber}>-</button>
            
                <span className="counter-custom">{this.state.number}</span>
            </div>
            );
    }
}
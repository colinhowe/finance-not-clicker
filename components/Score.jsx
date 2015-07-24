import React from "react"
import MoneyDisplay from "./MoneyDisplay.jsx"

export default class Score extends React.Component {
  render() {
    return <div id="score">
      <p>Money: <MoneyDisplay value={this.props.money} /></p>
      <p>LOC: { this.props.currentLoc}</p>
      <p>LOC/second: { this.props.locPerSecond}</p>
      <p>Devs: { this.props.devs}</p>
      <p>Valuation: <MoneyDisplay value={this.props.valuation} /></p>
      <p>Ownership: {this.props.ownership * 100.0}%</p>
      <p>Your stake: <MoneyDisplay value={this.props.stake} /></p>
    </div>;
  }
}

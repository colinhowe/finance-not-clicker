import React from "react"

export default class Score extends React.Component {
  render() {
    return <div id="score">
      <p>Money: ${this.props.money}</p>
      <p>LOC: { this.props.currentLoc}</p>
      <p>LOC/second: { this.props.locPerSecond}</p>
      <p>Devs: { this.props.devs}</p>
    </div>;
  }
}

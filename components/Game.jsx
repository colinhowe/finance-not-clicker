import React from "react"

import Score from "./Score.jsx"

const TICK_INTERVAL = 1000

class AddDevButton extends React.Component {
  render() {
    return <div onClick={this.props.addDev}>Hire dev</div>
  }
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoc: 0,
      devs: 1,
    };

    this.state.locPerSecond = this.calculateNewLocSpeed(this.state)
  }

  calculateNewLocSpeed(proposedState) {
    return proposedState.devs * 1
  }

  componentDidMount() {
    setInterval(this.tick.bind(this), TICK_INTERVAL)
  }

  render() {
    return <div>
      <Score
        currentLoc={this.state.currentLoc}
        locPerSecond={this.state.locPerSecond}
      />
      <AddDevButton addDev={this.addDev.bind(this)} />
    </div>;
  }

  tick() {
    var elapsed_time = TICK_INTERVAL / 1000 // Number of seconds elapsed
    
    var locIncrement = this.state.locPerSecond * elapsed_time
    var newLoc = this.state.currentLoc + locIncrement

    this.setState({currentLoc: newLoc})
  }

  addDev() {
    var proposedState = {
      devs: this.state.devs + 1,
    }
    proposedState.locPerSecond = this.calculateNewLocSpeed(proposedState)

    this.setState(proposedState)
  }
}

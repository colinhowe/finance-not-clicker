import React from "react"

import Score from "./Score.jsx"

const TICK_INTERVAL = 1000

class Building {
  constructor(name, cost) {
    this.name = name
    this.cost = cost
  }
}

const BUILDINGS = {
  'juniorDev': new Building('Junior Dev', 100000),
  'seniorDev': new Building('Senior Dev', 200000),
}


class AddDevButton extends React.Component {
  render() {
    return <div onClick={this.clickHandler.bind(this)}>
      Hire {this.props.building.name}
    </div>
  }

  clickHandler() {
    this.props.handler(this.props.buildingKey)
  }
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoc: 0,
      money: 500000,
    };

    let buildings = {}
    for (let key in BUILDINGS) {
      buildings[key] = 0
    }

    this.state.buildings = buildings
    this.state.locPerSecond = this.calculateNewLocSpeed(this.state)
  }

  calculateNewLocSpeed(proposedState) {
    return (
      proposedState.buildings['juniorDev'] * 1
      + proposedState.buildings['seniorDev'] * 3
    )
  }

  componentDidMount() {
    setInterval(this.tick.bind(this), TICK_INTERVAL)
  }

  render() {
    let buttons = []
    for (let key in BUILDINGS) {
      buttons.push(<AddDevButton
        buildingKey={key}
        building={BUILDINGS[key]}
        handler={this.addBuilding.bind(this)}
      />)
    }
    return <div>
      <Score
        currentLoc={this.state.currentLoc}
        locPerSecond={this.state.locPerSecond}
        devs={this.state.devs}
        money={this.state.money}
      />
      {buttons}
    </div>;
  }

  tick() {
    let elapsed_time = TICK_INTERVAL / 1000 // Number of seconds elapsed
    
    let locIncrement = this.state.locPerSecond * elapsed_time
    let newLoc = this.state.currentLoc + locIncrement

    this.setState({currentLoc: newLoc})
  }

  addBuilding(key) {
    if (this.state.money < BUILDINGS[key].cost) {
      return
    }

    let proposedState = {
      money: this.state.money - BUILDINGS[key].cost,
      buildings: {},
    }
    for (let key in BUILDINGS) {
      proposedState.buildings[key] = this.state.buildings[key]
    }
    proposedState.buildings[key] = this.state.buildings[key] + 1
    proposedState.locPerSecond = this.calculateNewLocSpeed(proposedState)

    this.setState(proposedState)
  }
}
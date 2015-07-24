import React from "react"

import MoneyDisplay from "./MoneyDisplay.jsx"
import Score from "./Score.jsx"

const TICK_INTERVAL = 1000
const VALUE_OF_MONEY = 0.8

class Building {
  constructor(name, cost, valuation, salary) {
    this.name = name
    this.cost = cost
    this.valuation = valuation
    this.salary = salary
  }
}


const GameState = {
  InProgress: 1,
  GameOverNoMoney: 2,
}


const BUILDINGS = {
  'juniorDev': new Building('Junior Dev', 50000, 110000, 30),
  'seniorDev': new Building('Senior Dev', 100000, 300000, 100),
}


class GameData {
  constructor() {
    this.state = GameState.InProgress
  }
}

const log10 = function(x) {
  return Math.log(x) / Math.log(10)
}

function calculateRaiseAmount(valuation) {
    let value = valuation
    let digits = Math.floor(log10(value))
    let amount = (
        Math.floor(value / Math.pow(10, digits - 1))
        * Math.pow(10, digits - 2)
    )
    return amount
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

class RaiseCapital extends React.Component {
  render() {
    let amount = calculateRaiseAmount(this.props.valuation)
    return <div onClick={this.props.handler}>
      Raise <MoneyDisplay value={amount} />
    </div>
  }
}

function calculateFireSaleValue(valuation) {
  return valuation / 2.0
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.calculateNewGameState(125000)
  }

  componentDidMount() {
    setInterval(this.tick.bind(this), TICK_INTERVAL)
  }

  calculateNewGameState(money) {
    let newState = {
      currentLoc: 0,
      money: money,
      ownership: 1,
      techDebt: 0,
      gameData: new GameData(),
    }
    let buildings = {}
    for (let key in BUILDINGS) {
      buildings[key] = 0
    }

    newState.buildings = buildings
    newState.locPerSecond = this.calculateNewLocSpeed(newState)

    this.calculateValuation(newState, newState)
    return newState
  }

  newGame() {
    this.setState(this.calculateNewGameState(this.state.nextStartingMoney))
  }

  render() {
    if (this.state.gameData.state == GameState.GameOverNoMoney) {
      let moneyRaised = this.state.nextStartingMoney
      return <div>
        <h1>Fire sale!</h1>
        <p>
        Your company has run out of money. There has been a fire sale
        of all assets and this raised <MoneyDisplay value={moneyRaised} />.
        </p>
        <p>
          <span onClick={this.newGame.bind(this)}>
            Onwards and upwards!
          </span>
        </p>
      </div>
    } else {
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
          valuation={this.state.valuation}
          ownership={this.state.ownership}
          stake={this.state.stake}
          techDebt={this.state.techDebt}
        />
        {buttons}
        <RaiseCapital
          handler={this.raiseCapital.bind(this)}
          valuation={this.state.valuation}
        />
      </div>
    }
  }

  calculateNewLocSpeed(proposedState) {
    let base = (
      proposedState.buildings['juniorDev'] * 10
      + proposedState.buildings['seniorDev'] * 30
    )
    let techDebtSlowDown = 1 / (Math.max(1, proposedState.techDebt))
    return base * techDebtSlowDown
  }


  tick() {
    let newState = {
      money: this.state.money
    }

    for (let key in BUILDINGS) {
      newState.money -= this.state.buildings[key] * BUILDINGS[key].salary
    }

    if (newState.money < 0) {
      // Game over, man!
      newState.gameData = new Game()
      newState.gameData.state = GameState.GameOverNoMoney
      newState.nextStartingMoney = calculateFireSaleValue(this.state.valuation)
    } else {
      let locs = this.calculateNewLocSpeed(this.state)
      newState.locPerSecond = locs
      newState.currentLoc = this.state.currentLoc + locs
      newState.techDebt = this.state.techDebt + locs / 1234

      this.calculateValuation(this.state, newState)
    }

    this.setState(newState)
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

    this.setState(proposedState)
  }

  calculateValuation(oldState, newState) {
    newState.valuation = (
      (newState.money * VALUE_OF_MONEY)
      + (newState.currentLoc * 5)
    )
    for (let key in BUILDINGS) {
      newState.valuation += oldState.buildings[key] * BUILDINGS[key].valuation
    }

    newState.stake = oldState.ownership * newState.valuation
  }

  raiseCapital() {
    let valuation = this.state.valuation
    let amount = calculateRaiseAmount(valuation)
    let newValuation = valuation + (amount * VALUE_OF_MONEY)
    let dilution = valuation / newValuation
    this.setState({
      ownership: this.state.ownership * dilution,
      money: this.state.money + amount,
    })
  }

}

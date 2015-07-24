import React from "react"
import numeral from "numeral"


export default class MoneyDisplay extends React.Component {
  render() {
    return <span>{numeral(this.props.value).format('$0.00a')}</span>
  }
}

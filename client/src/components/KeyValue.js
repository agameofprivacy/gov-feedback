import React, { Component } from "react";

class KeyValue extends Component {
  render() {
    const { k, v, last, hugged } = this.props;

    return (
      <div className={"key-value" + (last ? " key-value--last" : "") + (hugged ? " key-value--hugged" : "")}>
        <h4 className="key-value__key">{k}</h4>
        <span className="key-value__value">{v}</span>
      </div>
    );
  }
}

export default KeyValue;

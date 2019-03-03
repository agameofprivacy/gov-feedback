import React, {Component} from "react";

class KeyValue extends Component {
    render() {
        const {k, v, last} = this.props;

        return (
            <div className={last ? "key-value key-value--last" : "key-value"}>
                <h4 className="key-value__key">{k}</h4>
                <span className="key-value__value">{v}</span>
            </div>
        )
    }
}

export default KeyValue;
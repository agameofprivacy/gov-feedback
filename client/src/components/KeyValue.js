import React, {Component} from "react";

class KeyValue extends Component {
    render() {
        const {k, v} = this.props;

        return (
            <div className="key-value">
                <h4 className="key-value__key">{k}</h4>
                <span className="key-value__value">{v}</span>
            </div>
        )
    }
}

export default KeyValue;
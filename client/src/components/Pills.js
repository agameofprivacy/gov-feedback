import React, {Component} from "react";
import Pill from "./Pill";

class Pills extends Component {

    render() {
        const {pills, actions} = this.props;

        var pillsArray = [];

        pills.forEach(function(pill){
            pillsArray.push(
                <div className="pill-container">
                    <Pill action={actions} label={pill} />
                </div>
            )
        })

        return (
            <div className="pills">
                {pillsArray}
            </div>
        )
    }
}

export default Pills;

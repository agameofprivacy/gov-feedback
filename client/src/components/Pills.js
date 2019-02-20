import React, {Component} from "react";
import Pill from "./Pill";

class Pills extends Component {

    render() {
        const {pills, actions, className} = this.props;

        var pillsArray = [];

        pills.forEach(function(pill, index){
            pillsArray.push(
                <div key={index} className="pill-container">
                    <Pill action={actions} label={pill} />
                </div>
            )
        })

        return (
            <div className={className + " pills pills--wrap"}>
                {pillsArray}
            </div>
        )
    }
}

export default Pills;

import React, {Component} from "react";
import Pill from "./Pill";

class Pills extends Component {

    render() {
        const {values, pills, actions, className, handlePillClick, highlighted} = this.props;

        var pillsArray = [];

        pills.forEach(function(pill, index){
            pillsArray.push(
                <div key={index} className="pill-container">
                    <Pill value={values ? values[index] : ""} highlighted={highlighted ? highlighted.includes(pill) : false} action={actions} label={pill} handlePillClick={handlePillClick} type="toggle"/>
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

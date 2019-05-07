import React, {Component} from "react";

class SegmentedControls extends Component {

    state = {
        selectedIndex: 0
    }

    handleSegmentClick = e => {
        console.log(e);
        console.log(e.target);
        console.log(e.target.getAttribute("value"));
        this.setState({selectedIndex: e.target.getAttribute("value")}, function(){
            console.log(this.state);
        });
        this.props.updateState(e.target.getAttribute("value"));
    }

    render() {

        const { segments, updateState } = this.props;
        var segmentComponents = [];

        segments.forEach((segment, index) => {
            console.log("index", index);
            console.log("this.state.selectedIndex", this.state.selectedIndex);
            console.log(index === parseInt(this.state.selectedIndex));
            segmentComponents.push(
                <div value={index} onClick={this.handleSegmentClick} key={`segment__${index}`} className={"segmented-controls__segment" + (index === parseInt(this.state.selectedIndex) ? " segmented-controls__segment--selected" : "")}>
                    {segment}
                </div>
            );
        })

        return (
            <div className="segmented-controls">
                {segmentComponents}
            </div>
        )
    }
}

export default SegmentedControls;
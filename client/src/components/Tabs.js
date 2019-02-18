import React, {Component} from "react";

class Tabs extends Component {

    render() {
        const {tabs, selectedIndex} = this.props;
        var tabsArray = [];
        tabs.forEach(function(tab, index){
            tabsArray.push(<li key={index} className={"tabs__item" + (index === selectedIndex ? " tabs__item--selected" : "")}>{tab}</li>)
        })
        return (
            <ul className="tabs">
                {tabsArray}
            </ul>
        )
    }
}

export default Tabs;
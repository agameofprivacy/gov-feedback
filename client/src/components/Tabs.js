import React, { Component } from "react";

class Tabs extends Component {
  handleClick = e => {
    this.props.setSelectedTab(e.target.value);
  };

  render() {
    const { tabs, selectedTab } = this.props;
    var tabsArray = [];
    tabs.forEach(
      function(tab, index) {
        tabsArray.push(
          <li
            value={index}
            onClick={this.handleClick}
            key={index}
            className={
              "tabs__item" +
              (index === selectedTab ? " tabs__item--selected" : "")
            }
          >
            {tab}
          </li>
        );
      }.bind(this)
    );

    return <ul className="tabs">{tabsArray}</ul>;
  }
}

export default Tabs;

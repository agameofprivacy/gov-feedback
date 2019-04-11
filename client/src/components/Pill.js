import React, { Component } from "react";

class Pill extends Component {
  handleClick = e => {
    switch (this.props.type) {
      case "toggle":
        if (this.props.handlePillClick) {
          this.props.handlePillClick(
            e.target.getAttribute("value"),
            e.target.innerText
          );
        }
        break;
      case "link":
        if (this.props.handleClick) {
          this.props.handleClick(e);
        }
        break;
      case "action":
        if (this.props.handlePillClick) {
          this.props.handlePillClick(e.target.getAttribute("value"));
        }
        break;
      case "like":
        if (this.props.handlePillClick) {
          this.props.handlePillClick("like");
        }
      default:
        break;
    }
  };

  render() {
    const { value, label, action, like, unset, highlighted, color } = this.props;

    if (like) {
      return (
        <div 
          onClick={this.handleClick} 
          className={"pill pill--like" + (highlighted ? " pill--highlighted" : "")        
          }
        >
          <svg>
            <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
            <path d="M13.12 2.06L7.58 7.6c-.37.37-.58.88-.58 1.41V19c0 1.1.9 2 2 2h9c.8 0 1.52-.48 1.84-1.21l3.26-7.61C23.94 10.2 22.49 8 20.34 8h-5.65l.95-4.58c.1-.5-.05-1.01-.41-1.37-.59-.58-1.53-.58-2.11.01zM3 21c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2s-2 .9-2 2v8c0 1.1.9 2 2 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div
          value={value}
          style={color ? { backgroundColor: color } : {}}
          onClick={this.handleClick}
          className={
            "pill" +
            (highlighted ? " pill--highlighted" : "") +
            (unset ? " pill--unset" : "") +
            (action ? " pill--action" : "") +
            (color ? " pill--filled pill--filled--dark pill--selectable" : "")
          }
        >
          {label}
        </div>
      );
    }
  }
}

export default Pill;

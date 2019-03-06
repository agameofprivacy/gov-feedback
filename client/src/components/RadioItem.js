import React, {Component} from "react";

class RadioItem extends Component {

    state = {
        selected: false
    }

    handleClick = (e) => {
        this.setState({selected: !this.state.selected});
        this.props.radioSelected(this.props.item.value);
        console.log(this.props.item.value);
        this.props.submitForm(this.props.item.value);
    }

    render() {
        const {item, selected} = this.props;

        return (
            <div className="radio-item" onClick={this.handleClick}>
                {
                    selected &&
                    <svg className="radio-item__icon">
                        <path fill="none" d="M0 0h24v24H0V0z" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                        <circle cx={12} cy={12} r={5} />
                    </svg>
                }
                {
                    !selected &&
                    <svg className="radio-item__icon">
                        <path fill="none" d="M0 0h24v24H0V0z" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    </svg>
                }
                <div className="radio-item__titles-container">
                    <h4 className="radio-item__titles-container__title">
                        {item.title}
                    </h4>
                    <span className="radio-item__titles-container__subtitle">
                        {item.subtitle}
                    </span>
                </div>
            </div>
        );
    }
}

export default RadioItem;
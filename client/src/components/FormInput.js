import React, {Component} from "react";

class FormInput extends Component {

    handleChange = (e) => {
        console.log(e.target.value);
        this.props.updateValue(e.target.name, e.target.value);
    }

    render() {
        const {labelText, inputType, placeholder } = this.props;

        var input;

        switch(inputType) {
            case "secure-text":
                input = <input type="password" name={labelText} className={`form-input__input form-input__input--text form-input__input--${inputType}`} placeholder={placeholder} onChange={this.handleChange} />
                break;
            case "email":
                input = <input type="email" name={labelText} className={`form-input__input form-input__input--text form-input__input--${inputType}`} placeholder={placeholder} onChange={this.handleChange} />
                break;
            case "text":
            default:
                input = <input name={labelText} className={`form-input__input form-input__input--${inputType}`} placeholder={placeholder} onChange={this.handleChange} />
                break;
        }

        return (
            <div className="form-input">
                <label className="form-input__label" htmlFor={labelText}>
                    {labelText}
                    {input}
                </label>
            </div>
        )
    }
}

export default FormInput;
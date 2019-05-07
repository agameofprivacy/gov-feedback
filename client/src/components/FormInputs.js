import React, {Component} from "react";

class FormInputs extends Component {
    render() {
        return (
            <div className="form-inputs">
                {this.props.children}
            </div>
        )
    }
}

export default FormInputs;
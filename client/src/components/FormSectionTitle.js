import React, {Component} from "react";

class FormSectionTitle extends Component {

    render(){

        const {title} = this.props;

        return (
            <h3 className="form-section__title">
                {title}
            </h3>
        );
    }
}

export default FormSectionTitle;
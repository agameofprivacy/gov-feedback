import React, { Component } from "react";
import FormSectionTitle from "./FormSectionTitle";
import RadioItem from "./RadioItem";

class RadioSelect extends Component {
  state = {
    value: ""
  };

  radioSelected = value => {
    this.setState({ value: value });
  };

  render = () => {
    const { sections, submitForm } = this.props;
    var sectionsArray = [];

    sections.forEach((section, index) => {
      var radioItemsArray = [];
      section.options.forEach((option, index) => {
        radioItemsArray.push(
          <RadioItem
            submitForm={submitForm}
            key={index}
            selected={option.value === this.state.value}
            item={option}
            radioSelected={this.radioSelected}
            last={index === section.options.length - 1}
          />
        );
      });

      sectionsArray.push(
        <div key={index} className="form-section">
          <FormSectionTitle title={section.title} />
          {radioItemsArray}
        </div>
      );
    });
    return <div className="radio-select">{sectionsArray}</div>;
  };
}

export default RadioSelect;

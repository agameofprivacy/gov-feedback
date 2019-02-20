import React, {Component} from "react";
import KeyValue from "./KeyValue";

class Contact extends Component {

    render() {

        const {contacts} = this.props;

        var keyValues = [];
        contacts.forEach(function(contact, index){
            keyValues.push(<KeyValue key={index} k={contact.label} v={contact.value} />);
        });

        return (
            <div className="section">
                <div className="section__title-container">
                    <h3 className="section__title-container__title">聯絡資訊</h3>
                    <button className="section__title-container__action">修改</button>
                </div>
                {keyValues}
            </div>
        )
    }
}

export default Contact;
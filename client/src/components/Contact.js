import React, {Component} from "react";
import KeyValue from "./KeyValue";

class Contact extends Component {


    render() {
        let labelDict = {
            "voice": "電話",
            "address": "地址"
        }
    
        const {contacts} = this.props;

        var keyValues = [];
        contacts.forEach(function(contact, index){
            keyValues.push(<KeyValue key={index} k={labelDict[contact.kind]} v={contact.value} />);
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
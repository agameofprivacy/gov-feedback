import React, {Component} from "react";

class Composer extends Component {

    handleClick = (e) => {
        var type = "";
        if (e.target.id === "topic-search") type = "topic-search";
        else if (e.target.id === "identity-select") type = "identity-select";
        console.log(e.target.id);
        console.log(type);
        this.props.setFormState({modalType: type, showsModal: true})
    }

    updateContent = (e) => {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight)+"px";    
        this.setState({content: e.target.value});
    }

    state = {
        selectedTag: "",
        publishingIdentity: "",
        content: "",
    }

    labelDict = {
        "custom": "自訂",
        "account": "具名",
        "anonymous": "匿名",
    };

    render() {

        const {defaultTagName, selectedTag, selectedIdentity} = this.props;

        return (
            <div className="composer">
                <textarea onKeyUp={this.updateContent} className="composer__textarea" placeholder="想說什麼？" />
                <button id="topic-search" onClick={this.handleClick} className="pill pill--unset composer__tag">{selectedTag === "" ? "選擇議題標籤" : selectedTag}</button>
                <button className="pill pill--default composer__label">{defaultTagName}</button>
                <button id="identity-select" onClick={this.handleClick} className="pill pill--disabled composer__proceed">{selectedIdentity === "" ? "選擇發佈身份" : `以${this.labelDict[selectedIdentity]}身份發佈`}</button>
            </div>
        )
    }
}

export default Composer;
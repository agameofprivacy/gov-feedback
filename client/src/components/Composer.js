import React, {Component} from "react";

class Composer extends Component {

    handleClick = (e) => {
        var type = "";
        if (e.target.id === "topic-search") type = "topic-search";
        else if (e.target.id === "identity-select") type = "identity-select";
        this.props.setFormState({modalType: type, showsModal: true})
    }

    updateContent = (e) => {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight)+"px";    
        this.setState({content: e.target.value});
        this.props.setFormState({content: e.target.value});
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
                <button id="topic-search" onClick={this.handleClick} className={"pill composer__tag" + (selectedTag === "" ? " pill--unset" : " pill--new")}>{selectedTag === "" ? "選擇議題標籤" : selectedTag}</button>
                <div className="composer__buttons-container">
                    <button className="pill pill--default composer__label">{defaultTagName}</button>
                    <button id="identity-select" onClick={selectedTag !== "" ? this.handleClick : undefined} className={"pill composer__proceed" + (selectedTag === "" ? " pill--disabled" : "")} >{selectedIdentity === "" ? "選擇發佈身份" : `以${this.labelDict[selectedIdentity]}身份發佈`}</button>
                </div>
            </div>
        )
    }
}

export default Composer;
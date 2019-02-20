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

    autoGrow = (e) => {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight)+"px";    
    }

    render() {

        return (
            <div className="composer">
                <textarea onKeyUp={this.autoGrow} className="composer__textarea" placeholder="想說什麼？" />
                <button id="topic-search" onClick={this.handleClick} className="pill pill--unset composer__tag">選擇議題標籤</button>
                <button  onClick={this.handleClick} className="pill pill--default composer__label">政府機關</button>
                <button id="identity-select" onClick={this.handleClick} className="pill pill--disabled composer__proceed">選擇發佈身份</button>
            </div>
        )
    }
}

export default Composer;
import React, {Component} from "react";

class Composer extends Component {

    autoGrow = (e) => {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight)+"px";    
    }

    render() {
        return (
            <div className="composer">
                <textarea onKeyUp={this.autoGrow} className="composer__textarea" placeholder="想說什麼？" />
                <button className="pill pill--unset composer__tag">選擇議題標籤</button>
                <button className="pill pill--default composer__label">政府機關</button>
                <button className="pill pill--disabled composer__proceed">選擇發佈身份</button>
            </div>
        )
    }
}

export default Composer;
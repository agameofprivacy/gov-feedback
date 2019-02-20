import React, {Component} from "react";
import Pills from "./Pills";

class PillSearch extends Component {

    searchForTopic = (query) => {

    }

    render() {
        // const {type} = this.props;
        const sampleTopics = [
            "不當黨產",
            "案管系統",
            "拍賣網站",
            "傳繳通知",
            "牌照稅",
            "憑證電發",
            "作業流程",
            "不當黨產",
            "案管系統",
            "拍賣網站",
            "傳繳通知",
            "牌照稅",
            "憑證電發",
            "作業流程",
            "不當黨產",
            "案管系統",
            "拍賣網站",
            "傳繳通知",
            "牌照稅",
            "憑證電發",
            "作業流程",
        ];

        return (
            <div className="pill-search">
                <input placeholder="搜尋" className="pill-search__searchbox" />
                <Pills pills={sampleTopics} />
            </div>
        );
    }
}

export default PillSearch;
import React, {Component} from "react";
import Pill from "./Pill";
import Pills from "./Pills";
import 'moment/locale/zh-tw';

var moment = require ("moment");
moment.locale('zh-tw');

class Post extends Component {

    handleTagClick = (e) => {
        switch (this.props.tagType) {
            case "org":
                this.props.handleOrgClick([e.target.getAttribute("value"), e.target.innerText]);
                break;
            case "topic":
                this.props.handleTopicClick(e.target.innerText);
                break;
            default:
                break;
        }
    }

    render() {
        const {post, color} = this.props;
        const actions = [
            "回覆",
            "轉發",
            "檢舉",
        ];
        
        var createdMoment = moment(post.created);
        var createdString = createdMoment.fromNow();

        return (
            <div className={"post" + (post.type === "reply" ? " post--indented" : "")}>
                <div className="post__header">
                    {
                        post.topic !== "" &&
                        <Pill handleClick={this.handleTagClick} color={color} label={this.props.tagType === "topic" ? post.topic : post.organization} type="link"/>
                    }
                    {
                        post.type === "reply" &&
                        <div className="post__header__author">{post.author}</div>
                    }
                    <div className="post__header__timestamp">{createdString}</div>
                </div>
                <div className="post__body">
                    <p className="post__body__content">{post.content}</p>
                    { post.type !== "reply" &&
                        <div className="post__body__author">{post.author}</div>
                    }
                </div>
                <div className="post__footer">
                    <Pills actions pills={ post.type === "reply" ? actions.splice(1, 2) : actions} />
                    <Pill like />
                </div>
            </div>
        )
    }
}

export default Post;
import React, {Component} from "react";
import Pill from "./Pill";
import Pills from "./Pills";

class Post extends Component {
    render() {
        const {post} = this.props;
        const actions = [
            "回覆",
            "轉發",
            "檢舉",
        ];
        return (
            <div className={"post" + (post.type === "reply" ? " post--indented" : "")}>
                <div className="post__header">
                    {
                        post.tag !== "" &&
                        <Pill label={post.tag} />
                    }
                    {
                        post.type === "reply" &&
                        <div className="post__header__author">{post.author}</div>
                    }
                    <div className="post__header__timestamp">{post.created}</div>
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
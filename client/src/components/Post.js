import React, {Component} from "react";
import Pill from "./Pill";
import Pills from "./Pills";
import 'moment/locale/zh-tw';

var moment = require ("moment");
moment.locale('zh-tw');

class Post extends Component {

    state = {
        activeAction: "",
        content: ""
    }

    updateContent = (e) => {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight)+"px";    
        this.setState({content: e.target.value});
        this.props.setFormState({content: e.target.value});
    }

    handlePillClick = (action) => {
        this.setState({activeAction: this.state.activeAction === action ? "" : action});
    }

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
        const {post, color, first, last, parallelOrgs, org} = this.props;
        const actions = [
            "回覆",
            "轉發",
            "檢舉",
        ];
        const actionValues = [
            "reply",
            "forward",
            "report"
        ]
        
        var createdMoment = moment(post.created);
        var createdString = createdMoment.fromNow();

        var parallelPills = [];
        var parallelVals = [];

        if (org && org.hasOwnProperty("parent")) {
            parallelPills.push(org.parent.name);
            parallelVals.push(org.parent.identifier);
        }

        parallelOrgs.forEach((paralleOrg) => {
            parallelPills.push(paralleOrg.name);
            parallelVals.push(paralleOrg.identifier);
        })

        return (
            <div className="post-container">
                <div className={"post" + (post.type === "reply" ? " post--indented" : "") + (this.state.activeAction !== "" ? " post--accessory" : "") + (this.activeAction === "" ? " post--bordered" : "") + (first ? " post--first" : "") + (last ? " post--last" : "")}>
                    <div className="post__header">
                        {
                            post.topic !== "" &&
                            <Pill handleClick={this.handleTagClick} color={color} label={this.props.tagType === "topic" ? post.topic : post.organization} value={this.props.tagType === "org" ? post.organization_id : undefined} type="link"/>
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
                        <Pills highlighted={[this.state.activeAction]} actions values={actionValues} pills={ post.type === "reply" ? actions.splice(1, 2) : actions} handlePillClick={this.handlePillClick} />
                        <Pill like />
                    </div>
                </div>
                { this.state.activeAction==="reply" &&
                    <div className="post__reply post__accessory">
                        <textarea ref="content" onKeyUp={this.updateContent} className="post__accessory__textarea" placeholder="想回覆什麼？" />
                        <button className="post__accessory__submit pill pill--action">送出</button>
                    </div>
                }
                { this.state.activeAction==="forward" && parallelOrgs.length > 0 &&
                    <div className="post__forward post__accessory">
                        <Pills pills={parallelPills} values={parallelVals} />
                        <button className="post__accessory__submit pill pill--action">送出</button>
                    </div>
                }
                { this.state.activeAction==="report" &&
                    <div className="post__report post__accessory">
                        <textarea ref="content" onKeyUp={this.updateContent} className="post__accessory__textarea" placeholder="想檢舉什麼？" />
                        <button className="post__accessory__submit pill pill--action">送出</button>
                    </div>
                }
            </div>
        )
    }
}

export default Post;
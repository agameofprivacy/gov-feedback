import React, { Component } from "react";
import Pill from "./Pill";
import Pills from "./Pills";
import "moment/locale/zh-tw";

var moment = require("moment");
moment.locale("zh-tw");

class Post extends Component {
  state = {
    activeAction: "",
    content: "",
    forwardOrgIdSelected: "",
    forwardables: this.props.forwardables,
  };

  updateContent = e => {
    e.target.style.height = "0px";
    e.target.style.height = e.target.scrollHeight + "px";
    this.setState({ content: e.target.value });
    this.props.setFormState({ content: e.target.value });
  };

  handlePillClick = action => {
    this.setState({
      activeAction: this.state.activeAction === action ? "" : action
    }, function(){
        if (this.state.activeAction === "forward") {
            // fetch parallels for orgId this.props.post.organization_id
            
        }
    })
  };

  handleForwardSelect = (identifier, name) => {
    console.log(name, identifier);
    this.setState({forwardOrgIdSelected: identifier});
  }

  handleTagClick = e => {
    switch (this.props.tagType) {
      case "org":
        this.props.handleOrgClick([
          e.target.getAttribute("value"),
          e.target.innerText
        ]);
        break;
      case "topic":
        this.props.handleTopicClick(e.target.innerText);
        break;
      default:
        break;
    }
  };

  render() {
    const { post, color, first, last, forwardables, org } = this.props;
    var actions = ["回覆", "轉發", "檢舉"];
    var actionValues = ["reply", "forward", "report"];

    if (forwardables.length === 0) {
        actions.splice(1, 1);
        actionValues.splice(1, 1);
    }

    var createdMoment = moment(post.created);
    var createdString = createdMoment.fromNow();

    var forwardablePills = [];
    var forwardableVals = [];

    if (org && org.hasOwnProperty("parent") && org.parent !== null) {
      forwardablePills.push(org.parent.name);
      forwardableVals.push(org.parent.identifiers[0].identifier);
    }

    forwardables.forEach(paralleOrg => {
      forwardablePills.push(paralleOrg.name);
      forwardableVals.push(paralleOrg.identifiers[0].identifier);
    });

    return (
      <div className="post-container">
        <div
          className={
            "post" +
            (post.type === "reply" ? " post--indented" : "") +
            (this.state.activeAction !== "" ? " post--accessory" : "") +
            (this.activeAction === "" ? " post--bordered" : "") +
            (first ? " post--first" : "") +
            (last ? " post--last" : "")
          }
        >
          <div className="post__header">
            {post.topic !== "" && (
              <Pill
                handleClick={this.handleTagClick}
                color={color}
                label={
                  this.props.tagType === "topic"
                    ? post.topic
                    : post.organization
                }
                value={
                  this.props.tagType === "org"
                    ? post.organization_id
                    : undefined
                }
                type="link"
              />
            )}
            {post.type === "reply" && (
              <div className="post__header__author">{post.author}</div>
            )}
            <div className="post__header__timestamp">{createdString}</div>
          </div>
          <div className="post__body">
            <p className="post__body__content">{post.content}</p>
            {post.type !== "reply" && (
              <div className="post__body__author"><div className="post__body__author__image" />{post.author}</div>
            )}
          </div>
          <div className="post__footer">
            <Pills
              highlighted={[this.state.activeAction]}
              actions
              values={actionValues}
              pills={post.type === "reply" ? actions.splice(1, 2) : actions}
              handlePillClick={this.handlePillClick}
            />
            <Pill like />
          </div>
        </div>
        {this.state.activeAction === "reply" && (
          <div className="post__reply post__accessory">
            <textarea
              ref="content"
              onKeyUp={this.updateContent}
              className="post__accessory__textarea"
              placeholder="想回覆什麼？"
            />
            <button className="post__accessory__submit pill pill--action">
              送出
            </button>
          </div>
        )}
        {this.state.activeAction === "forward" && forwardables.length > 0 && (
          <div className="post__forward post__accessory">
            <p>將此回饋轉發至下面其中一個機關：</p>
            <Pills unset highlighted={[this.state.forwardOrgIdSelected]} type="toggle" handlePillClick={this.handleForwardSelect} pills={forwardablePills} values={forwardableVals} />
            <button className="post__accessory__submit pill pill--action">
              送出
            </button>
          </div>
        )}
        {this.state.activeAction === "report" && (
          <div className="post__report post__accessory">
            <textarea
              ref="content"
              onKeyUp={this.updateContent}
              className="post__accessory__textarea"
              placeholder="這個回饋怎麼了？"
            />
            <button className="post__accessory__submit pill pill--action">
              送出
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Post;

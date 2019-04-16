import React, { Component } from "react";
import Pill from "./Pill";
import Pills from "./Pills";
import "moment/locale/zh-tw";

var moment = require("moment");
moment.locale("zh-tw");

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class Post extends Component {
  state = {
    likedByUser: this.props.post.hasOwnProperty("likes") ? (this.props.post.likes.find((e) => e.user === this.props.user_id) === undefined ? false : true) : false,
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

  likePost = (input, callback) => {
    console.log("like post");
    console.log("input", input);
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
          mutation($input: LikePostInput){
            likePost(input: $input) {
              _id,
              likes{
                user,
              }
            }
          }
        `,
        variables: { input }
      })
    })
      .then(r => r.json())
      .then(response => {
        callback(response);
      });
  };


  handlePillClick = action => {
    if (action === "like") {
      console.log("perform like action on post");
      this.setState({
        likedByUser: !this.state.likedByUser
      }, () => {
        console.log("user_id: ", this.props.user_id);
        console.log("this.props.post._id", this.props.post._id);
        
        this.likePost({
          "user_id": this.props.user_id,
          "action": this.state.likedByUser ? "like" : "unlike",
          "post_id": this.props.post._id    
        }, (r) => {
          console.log("response: ", r);
        })  
      })

      
    } else {
      this.setState({
        activeAction: this.state.activeAction === action ? "" : action
      }, function(){
          if (this.state.activeAction === "forward") {
              // fetch parallels for orgId this.props.post.organization_id
              
          }
      })
    }
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

  createReply = (input, callback) => {
    console.log("input", input);

    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
        mutation($input: ReplyInput){
          createReply(input: $input) {
            author,
            authorProfile{
              user
              avatarUrl
            },
            content,
            likes{
              user,
            }
          }
        }
        `,
        variables: { input }
      })
    })
    .then(r => r.json())
    .then(response => {
      callback(response);
    })
  }

  handleAccessoryClick = (e) => {
      console.log("action: ", this.state.activeAction);
      console.log("content: ", this.state.content);

      switch(this.state.activeAction) {
        case "reply":
        console.log("this.props.user_id", this.props.user_id);
          this.createReply({
            "authorProfile": this.props.user_id,
            "author": this.props.username,
            "created": Number(new Date()),
            "content": this.state.content,
            "toPost": this.props.post._id
          }, (r) => {
            // append reply to post
            // call parent's update post function
            // clear content and deselect action
            this.props.updatePost(this.props.post._id);
            this.setState({content: "", activeAction: ""})
            console.log(r)
          })
          break;
        default:
          console.log("unknown action");
          break;
      }
  }


  render() {
    console.log("test", this.props.post.likes.find((e) => {return e.user === this.props.user_id}));
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

    var replies = [];
    var sorted = this.props.post.replies.sort((a,b) => {return b.created - a.created});

    console.log("sorted", sorted)

    sorted.forEach((reply, index) => {
      var repliedMoment = moment(reply.created);
      var repliedString = repliedMoment.fromNow();
  
      replies.push(
        <div key={reply._id} className={"post__reply" + (index === 0 ? " post__reply--first" : "") + (index === this.props.post.replies.length - 1 ? " post__reply--last" : "")}>
          <div className="post__reply__header">
            <span className="post__reply__header__author">{reply.author}</span>
            <span className="post__reply__header__created">{repliedString}</span>
          </div>
          <div className="post__reply__body">
            {reply.content}
          </div>
        </div>
      )
    })

    return (
      <div className="post-container">
        <div
          className={
            "post" +
            (post.type === "reply" ? " post--indented" : "") +
            (this.state.activeAction !== "" ? " post--accessory" : "") +
            (this.activeAction === "" ? " post--bordered" : "") +
            (first ? " post--first" : "") +
            (last ? " post--last" : "") +
            (replies.length > 0 ? " post--has-replies" : "")
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
            <p 
              className={
                "post__body__content" + (post.content.length < 12 ? " post__body__content--strong" : "")}>
              {post.content}
            </p>
            {post.type !== "reply" && (
              <div className="post__body__author">
                <div className="post__body__author__image">
                  { post.authorProfile !== null && 
                    <img src={post.authorProfile !== null ? post.authorProfile.avatarUrl : ""} />
                  }
                </div>
                {post.author}
              </div>
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
            <Pill highlighted={this.state.likedByUser} type="like" handlePillClick={this.handlePillClick} like />
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
            <button className="post__accessory__submit pill pill--action" onClick={this.handleAccessoryClick}>
              送出
            </button>
          </div>
        )}
        {this.state.activeAction === "forward" && forwardables.length > 0 && (
          <div className="post__forward post__accessory">
            <p>將此回饋轉發至下面其中一個機關：</p>
            <Pills unset highlighted={[this.state.forwardOrgIdSelected]} type="toggle" handlePillClick={this.handleForwardSelect} pills={forwardablePills} values={forwardableVals} />
            <button className="post__accessory__submit pill pill--action" onClick={this.handleAccessoryClick}>
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
            <button className="post__accessory__submit pill pill--action" onClick={this.handleAccessoryClick}>
              送出
            </button>
          </div>
        )}
        {this.props.post.replies.length > 0 &&
          <div className={"replies" + (
            this.state.activeAction !== "" ? " replies--accessory" : ""
          )}>
            {replies}
          </div>
        }
      </div>
    );
  }
}

export default Post;

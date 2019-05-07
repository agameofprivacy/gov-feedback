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
    likedByUser: this.props.post.isForwardedPostOf === null ? (this.props.post.hasOwnProperty("likes") ? (this.props.post.likes.find((e) => e.user === this.props.user_id) === undefined ? false : true) : false) : (this.props.post.isForwardedPostOf.hasOwnProperty("likes") ? (this.props.post.isForwardedPostOf.likes.find((e) => e.user === this.props.user_id) === undefined ? false : true) : false),
    activeAction: "",
    content: "",
    forwardOrgIdSelected: "",
    forwardOrgSelected: "",
    forwardables: this.props.forwardables,
  };

  updateContent = e => {
    e.target.style.height = "0px";
    e.target.style.height = e.target.scrollHeight + "px";
    this.setState({ content: e.target.value });
    this.props.setFormState({ content: e.target.value });
  };

  createPost = (postInput, callback) => {
    console.log("create post");
    console.log("postInput", postInput);
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
          mutation($postInput: PostInput){
            createPost(input: $postInput) {
              content
              organization
            }
          }
        `,
        variables: { postInput }
      })
    })
      .then(r => r.json())
      .then(response => {
        callback(response);
      });
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


  handleOrgLinkClick = e => {
    this.props.handleOrgClick([
      e.target.getAttribute("value"),
      e.target.innerText
    ]);
  }

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
          "post_id": this.props.post.isForwardedPostOf === null ? this.props.post._id : this.props.post.isForwardedPostOf._id
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

          };
      })
    }
  };

  handleForwardSelect = (identifier, name) => {
    console.log(name, identifier);
    this.setState({forwardOrgIdSelected: identifier, forwardOrgSelected: name});
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

  createReport = (input, callback) => {
    console.log("input", input);

    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
        mutation($input: ReportInput){
          createReport(input: $input) {
            author,
            reason
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
            "toPost": this.props.post.isForwardedPostOf === null ? this.props.post._id : this.props.post.isForwardedPostOf._id
          }, (r) => {
            // append reply to post
            // call parent's update post function
            // clear content and deselect action
            this.props.updatePost(this.props.post._id);
            this.setState({content: "", activeAction: ""})
            console.log(r)
          })
          break;
        case "report":
          this.createReport({
            "author": this.props.user_id,
            "referencedPost": this.props.post._id,
            "reason": this.state.content,
            "status": "pending",
            "created": Number(new Date())
          }, (r) => {
            // append reply to post
            // call parent's update post function
            // clear content and deselect action
            // this.props.updatePost(this.props.post._id);
            this.setState({content: "", activeAction: ""})
            alert("report submitted");
            console.log(r)
          })
          break;
        case "forward":
          console.log(`forwarded: ${this.state.forwardOrgIdSelected}`)
          var forwardInput = {
            authorProfile: this.props.user_id,
            author_type: "account",
            author: this.props.username,
            user_id: this.props.user_id,
            topic:
              this.props.post.isForwardedPostOf === null ? this.props.post.topic : this.props.post.isForwardedPostOf.topic,
            content: " ",
            organization:
              this.state.forwardOrgSelected,
            organization_id:
              this.state.forwardOrgIdSelected,
            isForwardedPostOf:
            this.props.post.isForwardedPostOf === null ?this.props.post._id : this.props.post.isForwardedPostOf._id,
            created: Number(new Date())
          };

          console.log("forward input", forwardInput)
          this.createPost(
            forwardInput,
            function(r) {
              console.log("forwarded create post r: ", r);
              console.log(r.data);
              this.setState({
                content: "", 
                activeAction: "",
                forwardOrgIdSelected: "",
                forwardOrgSelected: ""
              });
            }.bind(this)
          );
          break;
        default:
          console.log("unknown action");
          break;
      }
  }


  render() {
    const { post, color, first, last, forwardables, org } = this.props;
    var actions = ["回覆", "轉發", "檢舉"];
    var actionValues = ["reply", "forward", "report"];

    if (forwardables.length === 0) {
        actions.splice(1, 1);
        actionValues.splice(1, 1);
    }

    var createdMoment = moment(post.isForwardedPostOf === null ?post.created : post.isForwardedPostOf.created);
    var createdString = createdMoment.fromNow();

    var forwardedMoment;
    var forwardedString;
    
    if (post.isForwardedPostOf !== null) {
      forwardedMoment = moment(post.created);
      forwardedString = forwardedMoment.fromNow();
    }

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
    if (this.props.post.isForwardedPostOf !== null) {
      console.log("this.props.post", this.props.post);
    }
    var toSort = this.props.post.isForwardedPostOf === null ? this.props.post.replies : this.props.post.isForwardedPostOf.replies;
    console.log("toSort", toSort);
    var sorted = toSort.sort((a,b) => {
      console.log("a", a);
      return b.created - a.created
    });

    console.log("sorted", sorted)

    sorted.forEach((reply, index) => {
      var repliedMoment = moment(reply.created);
      var repliedString = repliedMoment.fromNow();
  
      replies.push(
        <div key={reply._id} className={"post__reply" + (index === 0 ? " post__reply--first" : "") + (index === sorted.length - 1 ? " post__reply--last" : "")}>
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

    var postToUse = post.isForwardedPostOf === null ? post : post.isForwardedPostOf;

    return (
      <div className="post-container">
        { post.isForwardedPostOf !== null &&
          <div className={"post__strip"}>
            <span>
            {forwardedString} {post.isForwardedPostOf.author} 由<a className="post__strip__link" onClick={this.handleOrgLinkClick} value={post.isForwardedPostOf.organization_id}>{post.isForwardedPostOf.organization}</a>轉發至<a className="post__strip__link" onClick={this.handleOrgLinkClick} value={post.organization_id}>{post.organization}</a>
            </span>
          </div>
        }
        <div
          className={
            "post" +
            (postToUse.type === "reply" ? " post--indented" : "") +
            (this.state.activeAction !== "" ? " post--accessory" : "") +
            (this.activeAction === "" ? " post--bordered" : "") +
            (first ? " post--first" : "") +
            (last ? " post--last" : "") +
            (replies.length > 0 ? " post--has-replies" : "")
          }
        >
          <div className="post__header">
            {postToUse.topic !== "" && (
              <Pill
                handleClick={this.handleTagClick}
                color={color}
                label={
                  this.props.tagType === "topic"
                    ? postToUse.topic
                    : postToUse.organization
                }
                value={
                  this.props.tagType === "org"
                    ? postToUse.organization_id
                    : undefined
                }
                type="link"
              />
            )}
            {postToUse.type === "reply" && (
              <div className="post__header__author">{postToUse.author}</div>
            )}
            <div className="post__header__timestamp">{createdString}</div>
          </div>
          <div className="post__body">
            <p 
              className={
                "post__body__content" + (postToUse.content.length < 12 ? " post__body__content--strong" : "")}>
              {postToUse.content}
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
              pills={postToUse.type === "reply" ? actions.splice(1, 2) : actions}
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
        {postToUse.replies.length > 0 &&
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

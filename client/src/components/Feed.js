import React, { Component } from "react";
import Composer from "./Composer";
import Post from "./Post";
import EmptyState from "./EmptyState";

const chroma = require("chroma-js");

class Feed extends Component {

  getColors = (count) => {
    let MIN_CONTRAST_RATIO = 5,
        MIN_LUMINANCE = 0.05,
        WHITE = chroma('white')
  
    let bg = null,
        text = null;
    var colors = [];

    do {
        bg = chroma.random();
        let contrastWithWhite = chroma.contrast(bg, WHITE)
        if (contrastWithWhite >= MIN_CONTRAST_RATIO && bg.luminance() >= MIN_LUMINANCE) {
            text = WHITE;
            colors.push(bg);
        }
    } while (text === null || colors.length < count);
    return colors;
  }

  handleOrgClick = identifier => {
    console.log(identifier[0], identifier[1]);
    this.props.setSelectedOrg({
      name: identifier[1],
      _id: identifier[0]
    });
  };

  handleTopicClick = name => {
    this.props.setSelectedTopic(name);
  };

  handleLoadMorePostsClick = e => {
    var lastCreated = this.props.posts[this.props.posts.length - 1].created;
    console.log("last post created", this.props.posts[this.props.posts.length - 1].created);
    this.props.getPostsForOrgId(this.props.selectedOrgId, lastCreated, true)
  }

  componentDidUpdate = (prevProps) => {
    if ((
            prevProps.hasOwnProperty("selectedOrgId") && 
            this.props.hasOwnProperty("selectedOrgId") && 
            prevProps.selectedOrgId !== this.props.selectedOrgId
        ) || (
            this.props.hasOwnProperty("selectedTopicName") && 
            prevProps.hasOwnProperty("selectedTopicName") && 
            prevProps.selectedTopicName !== this.props.selectedTopicName
        )) {
        console.log("update");
        this.colors = this.getColors(100);
    }
  }

  colors = this.getColors(10);


  render() {

    console.log("feed user_id: ", this.props.user_id);

    const {
      org,
      parallelOrgs,
      selectedType,
      selectedOrgName,
      selectedOrgId,
      posts,
      setFormState,
      selectedTopicName,
      selectedIdentity,
      reset,
      composerTag,
      showsComposer,
      hasAdditionalPosts,
    } = this.props;

    var postsArray = [];

    if (posts !== undefined && posts.length > 0) {
      var topics = [];
      var orgs = [];
      posts.forEach(post => {
        if (!topics.includes(post.topic)) {
          topics.push(post.topic);
        }
        if (!orgs.includes(post.organization)) {
          orgs.push(post.organization);
        }
      });
      posts.forEach(
        function(post, index) {
          postsArray.push(
            <Post
              parallelOrgs={parallelOrgs}
              org={org}
              first={index === 0}
              forwardables={selectedType === "org" ? parallelOrgs : []}
              last={index === posts.length - 1}
              setFormState={setFormState}
              handleTopicClick={this.handleTopicClick}
              handleOrgClick={this.handleOrgClick}
              tagType={selectedType === "org" ? "topic" : "org"}
              color={
                selectedType === "org"
                  ? this.colors[topics.indexOf(post.topic)].hex()
                  : this.colors[orgs.indexOf(post.organization)].hex()
              }
              key={post._id}
              post={post}
              user_id={this.props.user_id}
              username={this.props.username}
              updatePost={this.props.updatePost}
            />
          );
        }.bind(this)
      );
    }

    return (
      <div className="feed">
        { showsComposer &&
          <Composer
            key={selectedType === "org" ? selectedOrgId : selectedTopicName}
            reset={reset}
            composerTag={composerTag}
            selectedTopicName={selectedTopicName}
            selectedIdentity={selectedIdentity}
            defaultTagName={
              selectedType === "org" ? selectedOrgName : selectedTopicName
            }
            setFormState={setFormState}
            selectedType={selectedType}
          />
        }
        {posts !== undefined && posts.length > 0 && postsArray}
        {hasAdditionalPosts &&
          <div
            className="feed__action"
          >
            <a className="feed__action__button" onClick={this.handleLoadMorePostsClick}>
              顯示更多回饋
            </a>
          </div>
        }
        {posts !== undefined && posts.length === 0 && (
          <EmptyState title={"尚無回饋"} />
        )}
      </div>
    );
  }
}

export default Feed;

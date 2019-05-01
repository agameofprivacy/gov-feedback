// /client/App.js
import React, { Component } from "react";
import axios from "axios";
import Landing from "./components/Landing";
import NavBar from "./components/NavBar";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Loader from "./components/Loader";
import Profile from "./components/Profile";
import ProfileModal from "./components/ProfileModal";

var remote = "https://gov-feedback.appspot.com";
var local= "http://localhost:3001";

const host = local;

class App extends Component {
  // initialize our state
  state = {
    orgResults: null,
    topicResults: null,
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    randomOrgs: [],
    randomIndex: 0,
    selectedType: "org",
    selectedOrgId: undefined,
    selectedOrgDatabaseId: undefined,
    selectedOrgName: undefined,
    selectedTopicName: "",
    selectedIdentity: "",
    composerTag: "",
    composerValue: "",
    modalType: "",
    showsModal: false,
    showsProfileModal: false,
    showsLoginModal: false,
    showsProfilePage: true,
    content: "",
    reset: false,
    parallelOrgs: [],
    isLoading: false,
    username: "",
    user_id: "",
    birthday: "",
    gender: "",
    residence: "",
    email: "",
    hasAdditionalPosts: true,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getRandomOrgs(25);
    // this.createPost({
    //   author: "Eddie Chen",
    //   topic: "四次見面",
    //   content: "測試內容",
    //   organization: "法務部行政執行署",
    //   organization_id: "2.16.886.101.20003.20006.20090",
    //   created: 1550996472856
    // });

    var intervalId = setInterval(this.timer, 1800);
    this.setState({ intervalId: intervalId });
  }
  // if (!this.state.intervalIsSet) {
  //   let interval = setInterval(this.getOrgsFromDb, 1000);
  //   this.setState({ intervalIsSet: interval });
  // }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer = () => {
    // setState method is used to update the state
    if (typeof this.state.randomIndex == "undefined") {
      this.setState({
        randomIndex:
          Math.floor(Math.random() * (this.state.randomOrgs.length - 0)) + 0
      });
    } else {
      this.setState({
        randomIndex:
          this.state.randomIndex < this.state.randomOrgs.length - 1
            ? this.state.randomIndex + 1
            : 0
      });
    }
  };

  setSelectedOrg = org => {
    console.log("selected org", org);
    this.setState({
      selectedOrgId: org.identifiers[0].identifier,
      selectedOrgDatabaseId: org._id,
      selectedOrgName: org.name,
      selectedType: "org",
      selectedTopicName: "",
      composerTag: "",
      composerValue: "",
      showsProfilePage: false,
      isLoading: true,
      hasAdditionalPosts: false,
    }, () => {
      clearInterval(this.state.intervalId);
      console.log("this.state.posts", this.state.posts);
      var dateVal = this.state.posts !== undefined && (this.state.posts.length > 0 && this.state.hasAdditionalPosts) ? this.state.posts[this.state.posts.length - 1].created : Number(new Date());
      console.log("dateVal", dateVal);
      console.log("now", Number(new Date()));
      this.getPostsForOrgId(org.identifiers[0].identifier, dateVal, false)
      this.getOrgWithOrgId(org.identifiers[0].identifier);
    });
  };

  setSelectedTopic = name => {
    this.setState({
      selectedOrgId: "",
      selectedOrgDatabaseId: "",
      selectedOrgName: "",
      selectedType: "topic",
      selectedTopicName: name,
      composerTag: "",
      composerValue: "",
      showsProfilePage: false,
      isLoading: true,
      hasAdditionalPosts: false,
    }, () => {
      clearInterval(this.state.intervalId);
      var dateVal = this.state.posts !== undefined && (this.state.posts.length > 0 && this.state.hasAdditionalPosts) ? this.state.posts[this.state.posts.length - 1].created : Number(new Date());
      this.getPostsForTopic(name, dateVal, false);
      this.topicWithName(name);
    });
  };

  showLoginModal = () => {
    this.setState({
      showsLoginModal: true,
    })
  }

  showProfilePage = () => {
    this.setState({
      showsProfilePage: true,
    })
  }

  showProfileModal = () => {
    this.setState({
      showsProfileModal: true,
    })
  }

  updatePost = post_id => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
          query fetchPostWith($post_id: String) {
            fetchPostWith(post_id: $post_id){
              author,
              authorProfile {
                avatarUrl
              },
              topic,
              organization,
              organization_id,
              created,
              likes{
                user,
              }
              content,
              replies{
                content,
                author,
                _id,
                created
              },
              isForwardedPostOf {
                content,
                author,
                organization,
                organization_id,
                topic,
                created,
                authorProfile {
                  avatarUrl
                },
                replies{
                  content,
                  author,
                  _id,
                  created
                },  
                _id
              },
              _id
            }
          }
        `,
        variables: { post_id }
      })
    })
    .then(r => r.json())
    .then(result => {
      let updatedPost = result.data.fetchPostWith;
      this.state.posts.forEach((post, index) => {
        if (post._id === updatedPost._id) {
          var tempPosts = this.state.posts;
          tempPosts[index] = updatedPost;
          this.setState({posts: tempPosts});
        }
      })
      console.log("update post result: ", updatedPost);
    })
  }

  getPostsForTopic = (topic, date, append) => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query postsForTopic($topic: String, $date: Float){
          postsForTopic(topic: $topic, date: $date) {
            author,
            authorProfile {
              avatarUrl
            },
            topic,
            organization,
            organization_id,
            created,
            likes{
              user,
            }
            content,
            replies{
              content,
              author,
              _id,
              created
            },
            isForwardedPostOf {
              content,
              author,
              organization,
              organization_id,
              topic,
              created,
              authorProfile {
                avatarUrl
              },
              replies{
                content,
                author,
                _id,
                created
              },
              _id
            },
            _id
          }
        }`,
        variables: { topic, date }
      })
    })
      .then(r => r.json())
      .then(posts => {
        console.log(posts);
        if (append) {
          this.setState({ posts: this.state.posts.concat(posts.data.postsForTopic), isLoading: false, hasAdditionalPosts: posts.data.postsForTopic.length === 10 }, () => {
            console.log("posts appended", posts.data.postsForTopic);
          });
        } else {
          this.setState({ posts: posts.data.postsForTopic, isLoading: false, hasAdditionalPosts: posts.data.postsForTopic.length === 10  }, () => {
            window.scrollTo(0, 0)
          });
        }
      });
  };

  topicWithName = name => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query topicWithName($name: String){
          topicWithName(name: $name) {
            name,
            orgsAll {
              name
              identifier
              count
            },
            orgsWeek {
              name
              identifier
              count
            },            
          }
        }`,
        variables: { name }
      })
    })
      .then(r => r.json())
      .then(result => {
        console.log(result);
        this.setState({ selectedTopic: result.data.topicWithName, isLoading: false }, () => {
          window.scrollTo(0, 0)
        });
      });
  };

  getOrgsFromDb = (name, callback) => {
    this.setState({ query: name });
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query organizations($name: String){
          organizations(name: $name){
            _id
            name
            identifiers {
              scheme
              identifier
            }
          }
        }`,
        variables: { name }
      })
    })
      .then(r => r.json())
      .then(orgResults => {
        if (orgResults !== null && this.state.query === name) {
          this.setState({ orgResults: orgResults });
          callback(orgResults);
        }
      });
  };

  getTopicsFromDb = (name, callback) => {
    this.setState({ topics: [] });
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query topics($name: String) {
            topics(name: $name){
              name
            }
          }`,
        variables: { name }
      })
    })
      .then(r => r.json())
      .then(topicResults => {
        if (topicResults !== null && this.state.query === name) {
          this.setState({ topicResults: topicResults });
          callback(topicResults);
        }
      });
  };

  getRandomOrgs = count => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query randomOrganizations($count: Int){
          randomOrganizations(count: $count){
            name
          }
        }`,
        variables: { count }
      })
    })
      .then(r => r.json())
      .then(samples => {
        this.setState({ randomOrgs: samples.data.randomOrganizations });
      });
  };

  getRandomOrgs = count => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query randomOrganizations($count: Int){
          randomOrganizations(count: $count){
            name
          }
        }`,
        variables: { count }
      })
    })
      .then(r => r.json())
      .then(samples => {
        this.setState({ randomOrgs: samples.data.randomOrganizations });
      });
  };

  getPostsForOrgId = (orgId, date, append) => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query postsForOrgId($orgId: String, $date: Float){
          postsForOrgId(orgId: $orgId, date: $date) {
            author,
            authorProfile {
              avatarUrl
            },
            topic,
            organization,
            organization_id,
            created,
            likes{
              user,
            }
            content,
            replies{
              content,
              author,
              _id,
              created
            },
            isForwardedPostOf {
              content,
              author,
              organization,
              organization_id,
              topic,
              created,
              authorProfile {
                avatarUrl
              },
              replies{
                content,
                author,
                _id,
                created
              },
              _id
            },
            _id            
          }
        }`,
        variables: { orgId, date }
      })
    })
      .then(r => r.json())
      .then(posts => {
        console.log(posts);
        if (append) {
          this.setState({ posts: this.state.posts.concat(posts.data.postsForOrgId), isLoading: false, hasAdditionalPosts: posts.data.postsForOrgId.length === 10 }, () => {
            console.log("posts appended", posts.data.postsForOrgId);
          });
        } else {  
          this.setState({ posts: posts.data.postsForOrgId, isLoading: false, hasAdditionalPosts: posts.data.postsForOrgId.length === 10 }, () => {
            window.scrollTo(0, 0)
          });
        }
      });
  };

  getOrgWithOrgId = orgId => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query organizationWithId($orgId: String){
          organizationWithId(orgId: $orgId){
            _id,
            name,
            parent {
              _id,
              name,
              identifiers {
                identifier
              }
            },
            contact_details {
              kind,
              value,
              label
            },
            level,
            hierarchy,
            topicsWeek {
              name,
              count
            },
            topicsAll {
              name,
              count
            }
          }
        }`,
        variables: { orgId }
      })
    })
      .then(r => r.json())
      .then(org => {
        console.log("retrieved org: ", org);
        this.setState({ selectedOrg: org.data.organizationWithId }, () => {
          if (this.state.selectedOrg.parent !== null) {
            this.getOrgsWithParentId(
              this.state.selectedOrg.parent._id,
              function(orgs) {
                orgs = orgs.data.organizationsWithParentId.filter(
                  function(org) {
                    return (
                      org.identifiers[0].identifier !== this.state.selectedOrgId
                    );
                  }.bind(this)
                );
                this.setState({ parallelOrgs: orgs, isLoading: false }, () => {
                  window.scrollTo(0, 0)
                });
              }.bind(this)
            );
          } else {
            this.setState({ parallelOrgs: [], isLoading: false }, () => {
              window.scrollTo(0, 0)
            });
          }
        });
      });
  };

  getOrgsWithParentId = (parentId, callback) => {
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
          query organizationsWithParentId($parentId: String){
            organizationsWithParentId(parentId: $parentId) {
              _id,
              name,
              identifiers {
                identifier
              }       
            }
          }
        `,
        variables: { parentId }
      })
    })
      .then(r => r.json())
      .then(orgs => {
        console.log(orgs);
        callback(orgs);
      });
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

  createTopic = (topicInput, callback) => {
    console.log("create topic");
    console.log("topicInput", topicInput);
    fetch(`${host}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `
          mutation($topicInput: TopicInput){
            createTopic(input: $topicInput) {
              name
              popularityWeek
              popularityAll
            }
          }
        `,
        variables: { topicInput }
      })
    })
      .then(r => r.json())
      .then(response => {
        callback(response);
      });
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  setFormState = form => {
    for (const [key, value] of Object.entries(form)) {
      this.setState({ [key]: value });
    }
  };

  createPostWithComposer = () => {
    console.log("run createPostWithComposer");
    this.createPost(
      {
        authorProfile: this.state.user_id,
        author_type: this.state.selectedIdentity,
        author: this.state.username !== "" ? this.state.username : "匿名",
        user_id: this.state.user_id,
        topic:
          this.state.selectedType === "org"
            ? this.state.composerTag
            : this.state.selectedTopicName,
        content: this.state.content,
        organization:
          this.state.selectedType === "org"
            ? this.state.selectedOrgName
            : this.state.composerTag,
        organization_id:
          this.state.selectedType === "org"
            ? this.state.selectedOrgId
            : this.state.composerValue,
        created: Number(new Date())
      },
      function(r) {
        console.log(r);
        console.log(r.data);
        this.resetComposer();
        if (this.state.selectedType === "org") {
          var dateVal = this.state.posts !== undefined && (this.state.posts.length > 0 || this.state.hasAdditionalPosts) ? this.state.posts[this.state.posts.length - 1].created : Number(new Date());
          console.log("dateVal", dateVal);
          this.getPostsForOrgId(this.state.selectedOrgId, dateVal, false)
        } else {
          this.getPostsForTopic(this.state.selectedTopicName, dateVal, false);
        }
      }.bind(this)
    );
  };

  resetComposer = () => {
    this.setState({
      composerTag: "",
      selectedIdentity: "",
      modalType: "",
      showsModal: false,
      content: "",
      reset: true
    });
  };

  render() {
    // const posts = [
    //   {
    //     "tag": "不當黨產",
    //     "created": "4小時前",
    //     "content": "在蔡總統上任之後，同年七月即完成「不當黨產處理條例」的立法，隨即成立不當黨產處理委員會，大舉清查國民黨的黨產及附隨機構，此法的成立具有極大的爭議性及不平等之處，可見立法的粗糙以及具針對性和不周全，執政者運用政府的公權力強行清算國民黨資產關閉其附隨機構，但對於因政策執行下受牽累國民黨機構任職員工，因此失去賴以維生的工作，對於此情形法條中也未明定附加...",
    //     "author": "蔡忠勇",
    //     "liked": false,
    //     "type": "original"
    //   },
    //   {
    //     "tag": "",
    //     "created": "3小時前",
    //     "content": "依勞動基準法規定，政黨所聘僱之勞工，適用勞動基準法。中國國民黨現職基層勞工之薪資僅符合一般社會水準，退休金計算亦依現行法令規定辦理，且早已無18％優惠存款利息（有關已退職人員或專案聘用人員與主管之優惠退休金或高薪問題，與本會無涉）。本會一方面希望社會各界，持平對待勞工爭取法律保障之權益；另一方面也要求雇主應付起責任，拿出解決方案。",
    //     "author": "中國國民黨工會",
    //     "liked": false,
    //     "type": "reply"
    //   }
    // ];

    const sections = [
      {
        title: "需登入",
        options: [
          {
            title: "自訂",
            subtitle: "要怎麼署名都可以",
            value: "custom"
          },
          {
            title: "具名",
            subtitle: "使用帳戶設定之正式名稱、身份",
            value: "account"
          }
        ]
      },
      {
        title: "不需登入",
        options: [
          {
            title: "匿名",
            subtitle: "要隱姓埋名，請遵守社群規範",
            value: "anonymous"
          }
        ]
      }
    ];

    if (typeof this.state.selectedOrgId === "undefined") {
      return (
        <Landing
          setSelectedOrg={this.setSelectedOrg}
          setSelectedTopic={this.setSelectedTopic}
          queryOrgs={this.getOrgsFromDb}
          queryTopics={this.getTopicsFromDb}
          randomOrgs={this.state.randomOrgs}
          randomIndex={this.state.randomIndex}
          orgResults={this.state.orgResults}
          topicResults={this.state.topicResults}
        />
      );
    } else {
      return (
        <div>
          {this.state.showsModal && (
            <Modal
              selectedTopic={this.state.selectedTopic}
              selectedOrg={this.state.selectedOrg}
              content={this.state.content}
              setFormState={this.setFormState}
              type={this.state.modalType}
              data={sections}
              selectedOrgName={this.state.selectedOrgName}
              selectedTopicName={this.state.selectedTopicName}
              selectedIdentity={this.state.selectedIdentity}
              createPostWithComposer={this.createPostWithComposer}
              composerTag={this.state.composerTag}
              selectedType={this.state.selectedType}
            />
          )}

          {this.state.showsLoginModal && (
            <LoginModal setFormState={this.setFormState} />
          )}

          {this.state.showsProfileModal && (
            <ProfileModal 
              user_id={this.state.user_id} 
              birthday={this.state.birthday}
              gender={this.state.gender}
              residence={this.state.residence}
              email={this.state.email}
              setFormState={this.setFormState} 
            />
          )}

          <NavBar
            {...this.props}
            setSelectedOrg={this.setSelectedOrg}
            setSelectedTopic={this.setSelectedTopic}
            showLoginModal={this.showLoginModal}
            showProfilePage={this.showProfilePage}
            showsProfilePage={this.state.showsProfilePage}
            queryOrgs={this.getOrgsFromDb}
            queryTopics={this.getTopicsFromDb}
            orgResults={this.state.orgResults}
            topicResults={this.state.topicResults}
            setFormState={this.setFormState}
            title={
              this.state.selectedType === "org"
                ? this.state.selectedOrgName
                : this.state.selectedTopicName
            }
            username={this.state.username}
            dark
          />
          {
            this.state.isLoading &&
            <Loader />
          }
          {
            !this.state.isLoading && !this.state.showsProfilePage &&
            <div className="container">
              <Feed
                showsComposer={true}
                key={this.state.selectedType === "org" ? this.state.selectedOrgId : this.state.selectedTopicName}
                parallelOrgs={this.state.parallelOrgs}
                composerTag={this.state.composerTag}
                org={this.state.selectedOrg}
                setSelectedOrg={this.setSelectedOrg}
                setSelectedTopic={this.setSelectedTopic}
                selectedType={this.state.selectedType}
                reset={this.state.reset}
                selectedOrgName={this.state.selectedOrgName}
                selectedOrgId={this.state.selectedOrgId}
                selectedTopicName={this.state.selectedTopicName}
                selectedIdentity={this.state.selectedIdentity}
                setFormState={this.setFormState}
                posts={this.state.posts}
                user_id={this.state.user_id}
                username={this.state.username}
                updatePost={this.updatePost}
                hasAdditionalPosts={this.state.hasAdditionalPosts}
                getPostsForOrgId={this.getPostsForOrgId}
              />
              <Sidebar
                key={this.state.selectedType === "org" ? `key${this.state.selectedOrgId}` : `key${this.state.selectedTopicName}`}
                selectedIdentifier={this.state.selectedType === "org" ? this.state.selectedOrgId : this.state.selectedTopicName}
                selectedOrgDatabaseId={this.state.selectedOrg !== undefined ? this.state.selectedOrg._id : ""}
                selectedType={this.state.selectedType}
                setSelectedOrg={this.setSelectedOrg}
                org={this.state.selectedOrg}
                topic={this.state.selectedTopic}
                parallelOrgs={this.state.parallelOrgs}
                user_id={this.state.user_id}
              />
            </div>
        }
        { !this.state.isLoading && this.state.showsProfilePage &&
            <Profile 
              user_id={this.state.user_id}
              username={this.state.username} 
              birthday={this.state.birthday}
              gender={this.state.gender}
              residence={this.state.residence}
              email={this.state.email}
              setSelectedOrg={this.setSelectedOrg}
              setSelectedTopic={this.setSelectedTopic}
              showProfileModal={this.showProfileModal}
              setFormState={this.setFormState}
            />
        }
            <Footer />
          </div>
      );
    }
  }
}

export default App;

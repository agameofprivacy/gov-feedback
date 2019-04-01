import React, {Component} from "react"
import SegmentedControls from "./SegmentedControls";
import PersonalInfo from "./PersonalInfo";
import PostsFromUser from "./PostsFromUser";

const remote = "https://gov-feedback.appspot.com";
const local = "http://localhost:3001";

const host = local;

class Profile extends Component {

    state = {
        selected: "0",
    }

    setSelectedState = (state) => {
        this.setState({selected: state});
    }

    fetchPersonalInfo = user_id => {
        fetch(`${host}/graphql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              query: `query profileForUserWith($user_id: String){
                profileForUserWith(ID: $user_id) {
                  birthday,            
                  gender,
                  residence,
                  email
                }
              }`,
              variables: { user_id }
            })
          })
            .then(r => r.json())
            .then(result => {
              console.log(result);
              var profile = result.data.profileForUserWith !== null ? result.data.profileForUserWith : {};
              this.props.setFormState({ 
                  birthday: profile.hasOwnProperty("birthday") ? profile.birthday : "", 
                  gender: profile.hasOwnProperty("gender") ? profile.gender : "",
                  residence: profile.hasOwnProperty("residence") ? profile.residence : "",
                  email: profile.hasOwnProperty("email") ? profile.email : ""
              }, () => {
                window.scrollTo(0, 0)
              });
            });
    }

    componentDidMount = () => {
        this.fetchPersonalInfo(this.props.user_id);
    }

    render(){

        const statKVs = {
            "回饋": 4,
            "機關": 3,
            "回覆": 17,
        }

        const detailKVs = {
            "生日": this.props.birthday,
            "性別": this.props.gender,
            "居住地": this.props.residence,
            "Email": this.props.email,
        }

        return (
            <div className="container">
                <div className="feed">
                    <SegmentedControls updateState={this.setSelectedState} segments={["回饋", "關注", "訊息"]} />
                    { this.state.selected === "0" &&
                        <PostsFromUser
                            username={this.props.username} 
                            setSelectedOrg={this.props.setSelectedOrg}
                            setSelectedTopic={this.props.setSelectedTopic}
                        />
                    }
                </div>
                <div className="sidebar">
                    <PersonalInfo username={this.props.username} showProfileModal={this.props.showProfileModal} statKVs={statKVs} detailKVs={detailKVs} />
                </div>
            </div>
        )
    }
}

export default Profile
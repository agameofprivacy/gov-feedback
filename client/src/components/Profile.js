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
        birthday: "",
        gender: "",
        residence: "",
        email: "",
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
              this.setState({ 
                  birthday: result.data.profileForUserWith.birthday, 
                  gender: result.data.profileForUserWith.gender,
                  residence: result.data.profileForUserWith.residence,
                  email: result.data.profileForUserWith.email
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
            "生日": this.state.birthday,
            "性別": this.state.gender,
            "居住地": this.state.residence,
            "Email": this.state.email,
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
                    <PersonalInfo showProfileModal={this.props.showProfileModal} statKVs={statKVs} detailKVs={detailKVs} />
                </div>
            </div>
        )
    }
}

export default Profile
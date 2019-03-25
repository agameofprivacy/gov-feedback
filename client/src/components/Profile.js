import React, {Component} from "react"
import SegmentedControls from "./SegmentedControls";
import PersonalInfo from "./PersonalInfo";
import PostsFromUser from "./PostsFromUser";

class Profile extends Component {

    state = {
        selected: "0",
    }

    setSelectedState = (state) => {
        this.setState({selected: state});
    }

    fetchPersonalInfo = () => {
        
    }

    render(){

        const statKVs = {
            "回饋": 4,
            "機關": 3,
            "回覆": 17,
        }

        const detailKVs = {
            "生日": "12/31/1988",
            "性別": "男",
            "居住地": "台北市中山區",
            "Email": "agameofprivacy@gmail.com",
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
// /client/App.js
import React, { Component } from "react";
import axios from "axios";
import Landing from "./components/Landing";
import NavBar from "./components/NavBar";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";

class App extends Component {
  // initialize our state 
  state = {
    searchResults: null,
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    randomOrgs: [],
    randomIndex: 0,
    selectedOrgId: undefined,
    selectedOrgName: undefined,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getRandomOrgs(25);
    var intervalId = setInterval(this.timer, 1800);
    this.setState({intervalId: intervalId});
  }
    // if (!this.state.intervalIsSet) {
    //   let interval = setInterval(this.getDataFromDb, 1000);
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
      this.setState({ randomIndex: Math.floor(Math.random() * (this.state.randomOrgs.length - 0) ) + 0 });  
    } else {
      this.setState({ randomIndex: this.state.randomIndex < this.state.randomOrgs.length - 1 ? this.state.randomIndex + 1 : 0 });
    }    
  } 

  setSelectedOrg = (org) => {
    console.log("selected org", org);
    this.setState({
      selectedOrgId: org.identifiers[0].identifier,
      selectedOrgName: org.name,
    })
  }
    
  getDataFromDb = (name) => {
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `query organizations($name: String){
          organizations(name: $name){
            name
            identifiers {
              scheme
              identifier
            }
          }
        }`,
        variables: { name },
      })
    })
      .then(r => r.json())
      .then(searchResults => this.setState({searchResults: searchResults}));
  };

  getRandomOrgs = (count) => {
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `query randomOrganizations($count: Int){
          randomOrganizations(count: $count){
            name
          }
        }`,
        variables: { count },
      })
    })
    .then(r => r.json())
    .then(samples => {
      this.setState({randomOrgs: samples.data.randomOrganizations})
    });
  }

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
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

    axios.delete("http://localhost:3001/api/deleteData", {
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

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const posts = [
      {
        "tag": "不當黨產",
        "created": "4小時前",
        "content": "在蔡總統上任之後，同年七月即完成「不當黨產處理條例」的立法，隨即成立不當黨產處理委員會，大舉清查國民黨的黨產及附隨機構，此法的成立具有極大的爭議性及不平等之處，可見立法的粗糙以及具針對性和不周全，執政者運用政府的公權力強行清算國民黨資產關閉其附隨機構，但對於因政策執行下受牽累國民黨機構任職員工，因此失去賴以維生的工作，對於此情形法條中也未明定附加...",
        "author": "蔡忠勇",
        "liked": false,
        "type": "original"
      },
      {
        "tag": "",
        "created": "3小時前",
        "content": "依勞動基準法規定，政黨所聘僱之勞工，適用勞動基準法。中國國民黨現職基層勞工之薪資僅符合一般社會水準，退休金計算亦依現行法令規定辦理，且早已無18％優惠存款利息（有關已退職人員或專案聘用人員與主管之優惠退休金或高薪問題，與本會無涉）。本會一方面希望社會各界，持平對待勞工爭取法律保障之權益；另一方面也要求雇主應付起責任，拿出解決方案。",
        "author": "中國國民黨工會",
        "liked": false,
        "type": "reply"
      }
    ];

    if (typeof this.state.selectedOrgId === "undefined") {
      return (
        <Landing setSelectedOrg={this.setSelectedOrg} queryDB={this.getDataFromDb} randomOrgs={this.state.randomOrgs} randomIndex={this.state.randomIndex} searchResults={this.state.searchResults} />
      );
    } else {
      return (
        <div>
          <NavBar setSelectedOrg={this.setSelectedOrg} queryDB={this.getDataFromDb} searchResults={this.state.searchResults} title={this.state.selectedOrgName} dark />
          <div className="container">
            <Feed posts={posts} />
            <Sidebar selectedIndex={0} />
          </div>
        </div>
      )
    }
  }
}

export default App;

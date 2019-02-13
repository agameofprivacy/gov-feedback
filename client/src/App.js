// /client/App.js
import React, { Component } from "react";
import axios from "axios";
import Landing from "./components/Landing";

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
    randomOrgs: ["政府機關"],
    randomIndex: 0,
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
  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
    
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
    return (
      <div>
        <Landing queryDB={this.getDataFromDb} randomOrgs={this.state.randomOrgs} randomIndex={this.state.randomIndex} searchResults={this.state.searchResults} />
      </div>
    );
  }
}

export default App;

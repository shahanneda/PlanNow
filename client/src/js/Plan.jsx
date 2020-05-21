import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import PlanList from "./PlanList.jsx";
import NewList from "./NewList.jsx";
import ListViewer from "./ListViewer.jsx";

const cookies = new Cookies();

class Plan extends Component{
  constructor(props){
    super(props);
    this.state = {
      userId:"",
      auth:"",
      shouldUpdateLists: false,
      currentListIdSelected: "",
      listIds:{},
    };

  }
  componentDidMount(){
    this.setState({userId: cookies.get("userId"), auth: "authToken"});
    this.updateData();
  }

  onNewListAdded = (newListIdAndName) => {
    //temperarily add it so we can see it in the board instantly

    let listIds = this.state.listIds; 
    listIds[newListIdAndName.id] = newListIdAndName[newListIdAndName.name];

    setTimeout(this.updateData, 100); // get connected to the data base again
    this.forceUpdate();
  }
  setCurrentListIdSelected = (id) => {
    this.setState({currentListIdSelected: id});
  }

  updateData = () => {
    fetch(this.props.url + "/get/all-user-list-id/", {
      method:'get',
      headers: new Headers({
        Authorization: this.props.auth,
        'Accept': 'application/json'
      }),

    }).then( res => res.json()).then( res => {
      this.setState({listIds:res.listIds});

      if(this.state.currentListIdSelected === "" ){ // if the user hasent selected soemthing pick the first one for them
        this.setCurrentListIdSelected(Object.keys(this.state.listIds)[0]);
      }
    });

    console.log("updated data");
  }

  deleteList = (id) => {
    let listIds = this.state.listIds;

    fetch(this.props.url +"/post/remove/list/" + id + "/", {
      method:'post',
      headers: new Headers({
        Authorization: this.props.auth,
        "Content-Type": "application/json",
      }),

      body:JSON.stringify( {
      })

    }).then(res => res.json()).then( res => {
      console.log(res);
    });

    // Manually remove the list from the interface since it will take time for the backend to update
    /*let listIds = this.state.listIds;*/

    this.setCurrentListIdSelected(Object.keys(listIds)[ Object.keys(listIds).indexOf(id) - 1 ]);// set it to the one above
    delete listIds[id];

    this.setState({ listIds: listIds, shouldUpdateLists: true} );
    setTimeout(this.updateData, 1000); // add a 0.1 second delay so the data base has updated befroe we update
    //this.forceUpdate();
  }

  render(){
    if(cookies.get("loggedIn") !== "true"){
      return(<Redirect to="/login" /> );
    }

    return (
      <div className="row">
        <ListViewer 
          shouldUpdate={this.state.shouldUpdateLists} 
          onListUpdated={ () => this.setState( {shouldUpdateLists: false} ) } 
          url={this.props.url} 
          userId={this.state.userId} 
          auth={this.state.auth}
          currentListIdSelected={this.state.currentListIdSelected}
          setCurrentListIdSelected={this.setCurrentListIdSelected}
          onNewListAdded={this.onNewListAdded}
          listIds={this.state.listIds}
        />


        <PlanList 
          url={this.props.url} 
          listId={this.state.currentListIdSelected} 
          userId={this.props.userId} 
          auth={this.props.auth} 
          key={this.state.currentListIdSelected}
          deleteList={this.deleteList}
        />



      </div>


    );
  }
}

export default Plan;


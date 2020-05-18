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
    };

  }
  componentDidMount(){
    this.setState({userId: cookies.get("userId"), auth: "authToken"});
  }

  onNewListAdded = () => {
    this.setState({shouldUpdateLists: true});
    this.forceUpdate();
  }
  setCurrentListIdSelected = (id) => {
    this.setState({currentListIdSelected: id});
  }

  deleteList = (id) => {
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
    /*let listIds = this.state.listIds;
    delete listIds[id];*/

    this.setState({ shouldUpdateLists: true } );
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
        />

        <PlanList 
          url={this.props.url} 
          listId={this.state.currentListIdSelected} 
          userId={this.props.userId} 
          auth={this.props.auth} 
          key={this.state.currentListIdSelected}
          deleteList={this.deleteList}
        />


        <NewList url={this.props.url} userId={this.state.userId} auth={this.state.auth} onNew={ this.onNewListAdded }/>

        <Button onClick={ () => {
          cookies.set('loggedIn', 'false', { path: '/' });
          this.forceUpdate();
        }}> Log Out </Button>
      </div>


    );
  }
}

export default Plan;


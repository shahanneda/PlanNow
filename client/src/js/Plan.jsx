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
    };

  }
  componentDidMount(){
    this.setState({userId: cookies.get("userId"), auth: "authToken"});
  }

  onNewListAdded = () => {
    this.setState({shouldUpdateLists: true});
    this.forceUpdate();
  }

  render(){
    if(cookies.get("loggedIn") !== "true"){
      return(<Redirect to="/login" /> );
    }

    return (
      <div>
        Plan Page
        <ListViewer 
          shouldUpdate={this.state.shouldUpdateLists} 
          onListUpdated={ () => this.setState( {shouldUpdateLists: false} ) } 
          url={this.props.url} 
          userId={this.state.userId} 
          auth={this.state.auth}
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


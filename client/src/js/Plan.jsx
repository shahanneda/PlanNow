import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import PlanList from "./PlanList.jsx";

const cookies = new Cookies();

class Plan extends Component{
  constructor(props){
    super(props);


  }

  render(){

    if(cookies.get("loggedIn") !== "true"){
      return(<Redirect to="/create-account" /> );
    }
    return (
      <div>
        Plan Page
        <PlanList />
        <Button onClick={ () => {
          cookies.set('loggedIn', 'false', { path: '/' });
          this.forceUpdate();
        }}> Log Out </Button>
      </div>


    );
  }
}

export default Plan;


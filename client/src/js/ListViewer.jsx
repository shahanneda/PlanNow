import React, {Component} from 'react'
import {Button, ListGroup} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import PlanList from "./PlanList.jsx";
import NewList from "./NewList.jsx";

const cookies = new Cookies();

class ListViewer extends Component{
  constructor(props){
    super(props);
    this.state = {
      listIds: {},
    }
    this.updateData();
  }

  componentDidMount () {
    this.updateData();
  }

  updateData= () => {
    fetch(this.props.url + "/get/all-user-list-id/", {
      method:'get',
      headers: new Headers({
        Authorization: this.props.auth,
        'Accept': 'application/json'
      }),

    }).then( res => res.json()).then( res => {
      this.setState({listIds:res.listIds});
      this.props.onListUpdated();

      if(this.props.currentListIdSelected === ""){ // if the user hasent selected soemthing pick the first one for them
        this.props.setCurrentListIdSelected(Object.keys(this.state.listIds)[0]);
      }
    });

    console.log("updated data");
  }

  listItemOnChange = (id, textValue) => {
  }

  setData = () => {
  }

  addNewListItem = () => {
  }


  render(){

    if(this.props.shouldUpdate){
      this.updateData();
    }

    return (
      <ListGroup className="side-menu-list col-3 list-viewer ">

        <ListGroup.Item>
          <NewList url={this.props.url} userId={this.state.userId} auth={this.state.auth} onNew={ this.props.onNewListAdded }/>
        </ListGroup.Item>

        {
          Object.keys(this.state.listIds).map( (id) =>  
            <ListGroup.Item 
              onClick={ () => this.props.setCurrentListIdSelected(id) } 
              key={id}
              active={this.props.currentListIdSelected === id}
            > {this.state.listIds[id]} </ListGroup.Item>
          )
        }
      </ListGroup>
    );
  }

}

export default ListViewer;


import React, {Component} from 'react'
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import PlanList from "./PlanList.jsx";

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
      }),

    }).then( res => res.json()).then( res => {
      this.setState({listIds:res.listIds});
      this.props.onListUpdated();
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
    return (
      <div>
        {
          Object.keys(this.state.listIds).map( (id) =>  
            <PlanList 
              url={this.props.url} 
              listId={id} 
              userId={this.props.userId} 
              auth={this.props.auth} 
              key={id}
            />
          )
        }
      </div>
    );
  }

}

export default ListViewer;


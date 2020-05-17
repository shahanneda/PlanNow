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
    let listIds = this.state.listIds;
    delete listIds[id];
    this.setState({ listIds: listIds } );
    setTimeout(this.updateData, 1000); // add a 0.1 second delay so the data base has updated befroe we update
    //this.forceUpdate();
  }

  render(){

    if(this.props.shouldUpdate){
      this.updateData();
    }
    
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
              deleteList={this.deleteList}
            />
          )
        }
      </div>
    );
  }

}

export default ListViewer;


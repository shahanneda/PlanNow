import React, {Component} from 'react'
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import ListItem from "./ListItem.jsx";

const cookies = new Cookies();

class PlanList extends Component{
  constructor(props){
    super(props);
    this.state = {
      listItems: { "one": {
        id:"one",
        value:"walk the dogs",
      }},

    };
  }


  listItemOnChange = (id, textValue) => {

    let newList = this.state.listItems;
    if(!(id in  newList)){
        newList[id] = {id: id};
    }

    newList[id].value = textValue; // instead of this have it put to database
    this.setState({listItems: newList});
  }

  addNewListItem = () => {
    let newList = this.state.listItems;
    let id = Date.now();
    newList[Date.now()] = {id:id, value:""}; // instead of this have it add to database and refresh
    this.setState({listItems:newList});
  }
  render(){
    return (
      <div>
        {Object.keys(this.state.listItems).map( (item) =>  
        <ListItem item={this.state.listItems[item]}  onChange={this.listItemOnChange}/> ) }

        <ListItem item={{id: Date.now(), value:""}}  onChange={this.listItemOnChange}/>

        <Button className="add-new-button" onClick={this.addNewListItem} > New </Button>
      </div>
    );
  }
}

export default PlanList;


import React, {Component} from 'react'
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";

const cookies = new Cookies();

class NewList extends Component{

  constructor(props){
    super(props);
    this.state = {
      currNewListName: "",
    };
  }

  newList = () => {
    console.log("this was called");
    let listName = this.state.currNewListName;
    let listId = listName + "--" + cookies.get("userId") + "--" + Date.now();
    if(listName === ""){
      return;
    }


    fetch(this.props.url +"/post/list/" + listId + "/", {
      method:'post',
      headers: new Headers({
        Authorization: this.props.auth,
        "Content-Type": "application/json",
      }),
      body:JSON.stringify( {
        list: 
        {
          id:listId,
          _id:listId,
          name: listName,
          items: {},
        }
      })

    }).then( res => res.json()).then( result => {
      console.log(result);
      this.setState({listItems: result.listItems});
      this.props.onNew();
      console.log(result);
    });
  }

  render(){
    return (
      <div>
        <input 
          className="new-list-name-field" 
          type="text" 
          placeholder="Enter new list name." 
          onChange={ (e) => this.setState({currNewListName: e.target.value})} 
        />  

        <Button onClick={this.newList}> Create new list </Button>
      </div>
    );
  }
}

export default NewList;

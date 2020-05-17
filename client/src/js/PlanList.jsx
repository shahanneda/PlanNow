import React, {Component} from 'react'
import {Button, Card} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import ListItem from "./ListItem.jsx";

const cookies = new Cookies();

class PlanList extends Component{
  constructor(props){
    super(props);
    this.state = {
      listData:{},

    };
  }

  componentDidMount () {
    this.updateData();
  }

  updateData= () => {
    fetch(this.props.url +"/get/list/" + this.props.listId + "/", {
      method:'get',
      headers: new Headers({
        Authorization: this.props.auth,
      }),

    }).then( res => res.json()).then( result => {
      this.setState({listData: result.list});
      console.log("get list")
      console.log(result);
    });
  }

  listItemOnChange = (id, textValue) => {
    let newList = this.state.listData;
    if(!(id in newList.items)){
      newList.items[id] = {id: id};
    }
    newList.items[id].value = textValue; // instead of this have it put to database
    this.setData();
    this.setState({listData: newList, currentIdSelected: id},);
  }

  setData = () => {
    fetch(this.props.url +"/post/list/" + this.props.listId + "/", {
      method:'post',
      headers: new Headers({
        Authorization: this.props.auth,
        "Content-Type": "application/json",
      }),
      body:JSON.stringify( {
        list: this.state.listData
      })
    }).then(res => res.json()).then( res => {
      console.log(res);
    });
  }

  
  addNewListItem = () => {
    let list = this.state.listData;
    let id = list.id + Date.now();
    list.items[Date.now()] = {id:id, value:""}; // instead of this have it add to database and refresh

    this.setState({listData:list});
  }

  render(){
    if(Object.keys(this.state.listData).length === 0){
      return (<div> No data loaded yet! </div> );
    }

    return (
      <div>
        <Card>
          <Card.Header>
            <Card.Title>
              {this.state.listData.name}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {Object.keys(this.state.listData.items).map( (id) =>  
            <ListItem 
              item={this.state.listData.items[id]}  
              onChange={this.listItemOnChange} 
              key={id} 
              isFocused={id == this.state.currentIdSelected} 
            />)}
            <ListItem item={{id: Date.now(), value:""}}  onChange={this.listItemOnChange}/>
          </Card.Body>
          {/*<Button className="add-new-button" onClick={this.addNewListItem} > New </Button>*/}
        </Card>
      </div>
    );
  }
}

export default PlanList;


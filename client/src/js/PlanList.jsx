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
    this.keyboardUpdateTimeOut = null;
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
    newList.items[id].value = textValue; 

    // this is so we dont constantly update it every time we type and instead we wait
    this.updateDataInFutureIfNoMore();
    this.setState({listData: newList, currentIdSelected: id},);
  }

  listItemCheckBoxOnChange = (id, value) => {
    let newList = this.state.listData;
    newList.items[id].isComplete = value; 

    this.updateDataInFutureIfNoMore();

    this.setState( { listData: newList } );
  }

  updateDataInFutureIfNoMore = () => {
    if(this.keyboardUpdateTimeOut != null){
      clearTimeout(this.keyboardUpdateTimeOut);
    }
    this.keyboardUpdateTimeOut = setTimeout(this.setData, 500);
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
    console.log(id);
    list.items[Date.now()] = {id:id, value:""}; // instead of this have it add to database and refresh

    this.setState({listData:list});
  }

  render(){
    if(Object.keys(this.state.listData).length === 0){
      return (<div> No data loaded yet! </div> );
    }

    return (
      <div className="plan-list col-9">
        <Card>
          <Card.Header>
            <Card.Title>
              {this.state.listData.name}
              <Button className="float-right" variant="danger" onClick={ () => this.props.deleteList(this.state.listData.id) } > X </Button>
            </Card.Title>
          </Card.Header>
          <Card.Body>

            {Object.keys(this.state.listData.items).map( (id) =>  

            <ListItem 
              item={this.state.listData.items[id]}  
              onChange={this.listItemOnChange} 
              key={id} 
              isFocused={id == this.state.currentIdSelected} 
              checkBoxChange={this.listItemCheckBoxOnChange}
            />)}

            <ListItem item={{id: Date.now() + "--" + this.state.listData.id, value:""}}  onChange={this.listItemOnChange}/>
          </Card.Body>
          {/*<Button className="add-new-button" onClick={this.addNewListItem} > New </Button>*/}
        </Card>
      </div>
    );
  }
}

export default PlanList;


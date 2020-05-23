import React, {Component} from 'react'
import {Button, Card} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import ListItem from "./ListItem.jsx";
import EditableText from "./EditableText.jsx";

const cookies = new Cookies();

class PlanList extends Component{
  constructor(props){
    super(props);
    this.state = {
      listData:{
        id: this.props.listId,
        name: this.props.listName,
        items:{},
      },
      currentIdSelected: "",
    };
    this.keyboardUpdateTimeOut = null;
  }

  componentDidMount () {
    this.updateData();

    window.addEventListener('unload', event => {this.setData()});
  }

  updateData = () => {
    let url = this.props.url +"/get/list/" + encodeURIComponent(this.props.listId) + "/";

    fetch(url).then( res => res.json()).then( result => {
      this.setState({listData: result.list});
    });
  }

  listItemOnChange = (id, textValue) => {
    let newList = this.state.listData;
    if(!(id in newList.items)){
      newList.items[id] = {
        id: id,
        isComplete: false,
        order:Object.keys(newList.items).length,
      };
    }
    newList.items[id].value = textValue; 

    // this is so we dont constantly update it every tim we type and instead we wait
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
    fetch(this.props.url +"/post/list/" + encodeURIComponent(this.props.listId) + "/", {
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

  titleOnChange = (e) => {
    let list = this.state.listData;
    list.name = e.target.value;
    this.updateDataInFutureIfNoMore();
    this.props.listNameChange({id: list.id, name:list.name});

    this.setState({listData: list});
  }

  onRemoveListItem = (id) => {
    let list = this.state.listData;
    delete list.items[id];
    this.setState({listData: list});
    this.updateDataInFutureIfNoMore();
  }

  render(){
    if(Object.keys(this.state.listData).length === 0 || !this.props.listId){
      setTimeout(this.updateData, 100);
      return (<div> No data loaded yet! </div> );
    }

    return (
      <div className="plan-list col-9">
        <Card>
          <Card.Header>
            <Card.Title>
              <EditableText 
                label={<div>{this.state.listData.name}</div> }
                value={this.state.listData.name}
                onChange={this.titleOnChange}
                className={" list-title "}
              />

              <Button className="float-right" variant="danger" onClick={ () => this.props.deleteList(this.state.listData.id) } > X </Button>
            </Card.Title>
          </Card.Header>
          <Card.Body className="list-body">

            {Object.keys(this.state.listData.items).map( (id) =>  

            <ListItem 
              item={this.state.listData.items[id]}  
              onChange={this.listItemOnChange} 
              key={id} 
              isFocused={id == this.state.currentIdSelected} 
              checkBoxChange={this.listItemCheckBoxOnChange}
              onRemoveButton={this.onRemoveListItem}
            />)}

            <ListItem 
              item={{id: Date.now() + "--" + this.state.listData.id, value:""}}  
              onChange={this.listItemOnChange}
              isAddNewItem={true}
              isFocused={false}
              placeholder={"Type here to make a new item"}
            />
          </Card.Body>
          {/*<Button className="add-new-button" onClick={this.addNewListItem} > New </Button>*/}
        </Card>
      </div>
    );
  }
}

export default PlanList;


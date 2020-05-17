import React, {Component, CreateRef} from 'react'
import {Button} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";

const cookies = new Cookies();

class ListItem extends Component{
  constructor(props){
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount(){
    if(this.props.isFocused){
      this.inputRef.current.focus();
    }
  }

  render(){

    return (
      <div className="form-group">

        <input 
          key={this.props.item.id} 
          type="text" 
          onChange={(event) => this.props.onChange(this.props.item.id, event.target.value )}
          value={this.props.item.value}
          ref={this.inputRef}
          className="form-control"
        /> 

      </div>
    );
  }
}

export default ListItem;


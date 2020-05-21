import React, {Component, CreateRef} from 'react'
import {Button, Form} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Redirect, Link} from "react-router-dom";
import EditableText from './EditableText.jsx';

const cookies = new Cookies();

class ListItem extends Component{
  static defaultProps = {
    onlyEdit: false,
    placeholder: "",
  }

  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(this.props.isFocused){
      //this.inputRef.current.focus();
    }
  }

  render(){

    return (
      <div className="" >
        <div className=" plan-list-item" > {/* from-group */}
          <Form.Check 
            checked={this.props.item.isComplete ? true : false} 
            className="plan-list-completed-checkbox" 
            type="checkbox" 
            onChange={ (e) => this.props.checkBoxChange(this.props.item.id, e.target.checked) } 
            tabindex="-1" // so it cant be selected with tab
          />

          <EditableText 
            onChange={(event) => this.props.onChange(this.props.item.id, event.target.value)}
            value={this.props.item.value}
            className=" plan-list-item-name" 
            label={ <div> {this.props.item.value} </div> }
            value={this.props.item.value}
            isEditing={ this.props.isFocused  || this.props.onlyEdit } // if we are focused or if we are only edit we should be editing
            isOnlyEdit={this.props.onlyEdit}
            isFocused={this.props.isFocused}
            otherProps={ {} }
            placeholder={this.props.placeholder}
          />

          {/* form-control */ }
          {/* <input  */}
          {/*   key={this.props.item.id}  */}
          {/*   type="text"  */}
          {/*   onChange={(event) => this.props.onChange(this.props.item.id, event.target.value)} */}
          {/*   value={this.props.item.value} */}
          {/*   ref={this.inputRef} */}
          {/*   className="form-control plan-list-item-name" */}
          {/* />  */}

        </div>
      </div>
    );
  }
}

export default ListItem;


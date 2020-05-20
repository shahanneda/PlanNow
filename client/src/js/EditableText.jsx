import React, {Component} from 'react'
import {Button} from 'react-bootstrap';
class EditableText extends Component{

  constructor(props){
    super(props);
    this.state = {
      isEditing: false,
    };
    this.ref = React.createRef();

  }

  onKeyDown = (e) => {
    if(e.key == "Enter" || e.key == "Escape"){
      this.setState({isEditing: false});
    }
  }

  componentDidUpdate(){
    if(this.ref.current != null){
      this.ref.current.focus();
    }
  }

  render(){

    if(!this.state.isEditing){
      return (
        <div className={"editable-text-normal " + this.props.className} onClick={() => this.setState({isEditing: true}) } > 
          {this.props.label}
        </div>
      );
    }

    return(
      <input 
        ref={this.ref} 
        onKeyDown={this.onKeyDown} 
        className={"editable-text-edit " + this.props.className} 
        value={this.props.value} 
        onChange={this.props.onChange} 
        onBlur={() => this.setState({isEditing: false})}
      />
    )
  }
}

export default EditableText;


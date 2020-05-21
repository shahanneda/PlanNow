import React, {Component} from 'react'
import {Button} from 'react-bootstrap';
class EditableText extends Component{

  static defaultProps = {
    isEditing: false,
    isOnlyEdit: false, // have to do lowercase only name since props being spread down 
    placeholder: "",
  }

  constructor(props){
    super(props);
    this.state = {
      isEditing: this.props.isEditing,
    };
    this.ref = React.createRef();

  }

  onKeyDown = (e) => {
    if(e.key == "Enter" || e.key == "Escape"){
      this.setState({isEditing: false});
    }
  }

  componentDidUpdate(){
    if( (this.state.isEditing && !this.props.isOnlyEdit) || this.props.isFocused){
      if(this.ref.current != null){
        this.ref.current.focus();
      }
    }
  }
  componentDidMount(){

    if(this.props.isFocused && this.ref.current != null){
      this.ref.current.focus();
    }
  }

  render(){


    if(!this.state.isEditing && !this.props.isOnlyEdit){
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
        placeholder={this.props.placeholder}
        {...this.props.otherProps}
      />
    )
  }
}

export default EditableText;


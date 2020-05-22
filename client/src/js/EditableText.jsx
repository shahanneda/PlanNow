import React, {Component} from 'react'
import {Button} from 'react-bootstrap';
class EditableText extends Component{

  static defaultProps = {
    isEditing: false,
    isOnlyEdit: false, // have to do lowercase only name since props being spread down 
    placeholder: "",
    shouldFocus: true,
    clicked: true,
  }

  constructor(props){
    super(props);
    this.state = {
      isEditing: this.props.isEditing,
      clicked: true,
    };
    console.log("whenc reating the state is edtiing: " +this.props.isEditing);
    this.ref = React.createRef();

  }

  onKeyDown = (e) => {
    if(e.key == "Enter" || e.key == "Escape"){
      this.setState({isEditing: false});
    }
  }

  componentDidUpdate(){
    this.handleFocusUpdate();
  }
  componentDidMount(){
    this.handleFocusUpdate();
  }

  // this is for focusing on the input field at the right time
  handleFocusUpdate = () => {
    if((this.state.isEditing) && this.props.shouldFocus && this.ref.current != null){
      this.ref.current.focus();
    }

    // handle special case where we clicked but we dont want defualt focus 
    if(this.state.clicked && this.ref.current != null){
      this.ref.current.focus();
      this.setState({clicked: false});
    }
  }

  render(){
    if(!this.state.isEditing && !this.props.isOnlyEdit){
      return (
        <div className={"editable-text-normal " + this.props.className} onClick={() => this.setState({isEditing: true, clicked:  true}) } > 
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
        onBlur={() => { this.setState({isEditing: false})} }
        placeholder={this.props.placeholder}
        {...this.props.otherProps}
      />
    )
  }
}

export default EditableText;


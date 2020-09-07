import React, { Component } from "react";
import ReactDOM from "react-dom";

class Log extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        display: false,
        message: this.props.message
    }
  }

  removeMessage() {
    this.props.setMessage('');
  }
  render() {
    return(
    <div onClick={this.removeMessage.bind(this)} className={`log-container show-hand opacity-hover ${this.props.message !== "" ? 'show': 'hide'}`}>{this.props.message}</div>
    )
  }

}


export default Log;
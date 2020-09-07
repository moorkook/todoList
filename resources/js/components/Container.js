import React, { Component } from "react";
import ReactDOM from "react-dom";

import Login from "./Login";
import Log from "./Log";
import Todo from "./Todo";

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_connected: false,
      message: ""
    }
    // Needed to allow child dropping of method
    this.checkConnected = this.checkConnected.bind(this);
    this.setMessage = this.setMessage.bind(this);
  }

  setMessage(newMessage) {
    this.setState({
      message: newMessage,
    })
  }
  // Check the user connection and update state if needed
  // Can be triggered by child
  checkConnected() {
    console.log('Connection checking')
    let token = localStorage.getItem('token')
    if(token !== null) {
      console.log('token is here');
      var config = {
        method: 'get',
        url: 'http://138.68.111.211/api/isConnected',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      };
      axios(config)
      .then((response) => {
        this.setState({
          is_connected: true,
        })
        console.log('Connection OK')
      })
      .catch((error) => {
        console.log('Connection failed')
        this.setState({
          is_connected: false,
        })
      });
    } else {
      this.setState({
        is_connected: false,
      })
    }
  }

  // Called after the component is mounted
  // Allow for a first check of connectivity
  componentDidMount() {
    this.checkConnected();
  }

  // Called when update happens
  componentDidUpdate() {
  }

  render() {
    return(
      <div className="flex-container center full-width viewport-full-height horizontal-align-center background-neutral">
        <Log is_connected={this.state.is_connected} checkConnected={this.checkConnected} message={this.state.message} setMessage={this.setMessage} />
        <Login is_connected={this.state.is_connected} checkConnected={this.checkConnected } setMessage={this.setMessage}/>
        <Todo is_connected={this.state.is_connected} checkConnected={this.checkConnected} setMessage={this.setMessage}/>

      </div>
    )
  }

}


export default Container;

const rootElement = document.querySelector("main");
ReactDOM.render(<Container />, rootElement);

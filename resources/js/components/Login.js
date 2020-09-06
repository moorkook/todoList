import React, { Component } from "react";
import ReactDOM from "react-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        email: "",
        password: "",
    }
  }

  // Executed when the login form is submitted
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    // Check that both state are not empty
    //@TODO make a common method to allow Ajax
    if(this.state.email !== null && this.state.password !== null) {
        console.log('Connection send');
        let config = {
        method: 'post',
        url: 'http://138.68.111.211/api/login',
        data : {
            email: this.state.email,
            password: this.state.password,
        }
        };
        axios(config)
        .then((response) => {
            if(response.data.token !== undefined) {
                // If the server send back a token, we add it to the localStorage
                localStorage.setItem('token', response.data.token);
                this.props.checkConnected();
                console.log("Connection OK");
            } else {
                //@TODO Add error
                console.log("Connection KO");
            }
        })
        .catch(function (error) {
            //@TODO Add error
            console.log(error);
        });
    } else {
        //@TODO Add error
        console.log('Fill your inputs first');
    }
  }

  // Allow for update of state when input is updated
  handleChange(e) {
      this.setState({
          [e.target.name]: e.target.value
      })
  }

  render() {
    return(
        //Allow to display div only when the user is not connected
      <div className={`login-mod ${this.props.is_connected ? 'hide' : 'show'}`}>
        <form onSubmit={this.handleSubmit.bind(this)} className="pure-form pure-form-stacked">
            <h1 className="title-text">TODO</h1>
            <input className="full-width" name="email" type="email" onChange={this.handleChange.bind(this)} ></input>
            <input className="full-width" name="password" type="password" onChange={this.handleChange.bind(this)} ></input>
            <button className="full-width" type="submit">Connect</button>
        </form>
      </div>
    )
  }

}


export default Login;
import React, { Component } from "react";
import ReactDOM from "react-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        email: "",
        password: "",
        registerName: "",
        registerEmail: "",
        registerPassword: "",
        register: false,
    }
  }

  handleSubmitCreate(e) {
    e.preventDefault();
    if(this.state.registerEmail !== null && this.state.registerPassword !== null && this.state.registerName !== null) {
      let config = {
        method: 'post',
        url: 'http://138.68.111.211/api/createAccount',
        data : {
          email: this.state.registerEmail,
          password: this.state.registerPassword,
          name: this.state.registerName,
        }
      };
      axios(config)
      .then((response) => {
        this.toggleRegister();
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
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
                this.props.setMessage("Error : login failed");
            }
        })
        .catch(function (error) {
            this.props.setMessage("Error : login failed");
        });
    } else {
        this.props.setMessage("Warning : fill all inputs before connecting");
    }
  }

  // Allow for update of state when input is updated
  handleChange(e) {
      this.setState({
          [e.target.name]: e.target.value
      })
  }
  toggleRegister() {
    this.setState({
        register: !this.state.register,
    })
  }
  render() {
    return(
        //Allow to display div only when the user is not connected
      <div className={`flex-container flex-column login-mod ${this.props.is_connected ? 'hide' : 'show'}`}>
        <h1 className="title-text">TODO</h1>
        <form className={`flex-container flex-column ${this.state.register ? "hide" : "show"}`} onSubmit={this.handleSubmit.bind(this)}>
            <input className="full-width" name="email" type="email" onChange={this.handleChange.bind(this)} placeholder="email@email.fr" ></input>
            <input className="full-width" name="password" type="password" onChange={this.handleChange.bind(this)} placeholder="password"></input>
            <button className="full-width" type="submit">Login</button>
            <p className="show-hand" onClick={this.toggleRegister.bind(this)}>Go to Register</p>
        </form>
        <form className={`flex-container flex-column ${this.state.register ? "show" : "hide"}`} onSubmit={this.handleSubmitCreate.bind(this)}>
            <input className="full-width" name="registerName" type="text" onChange={this.handleChange.bind(this)} placeholder="Name" ></input>
            <input className="full-width" name="registerEmail" type="email" onChange={this.handleChange.bind(this)} placeholder="Email"></input>
            <input className="full-width" name="registerPassword" type="password" onChange={this.handleChange.bind(this)} placeholder="Password"></input>
            <button className="full-width" type="submit">Register</button>
            <p className="show-hand" onClick={this.toggleRegister.bind(this)}>Go to Login</p>
        </form>
      </div>
    )
  }

}


export default Login;
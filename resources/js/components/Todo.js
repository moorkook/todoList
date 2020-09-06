import React, { Component } from "react";
import ReactDOM from "react-dom";

class Todo extends React.Component {
    constructor(props) {
        super(props);
        //@TODO allow for cleaner state list
        this.state = {
            todos: "",
            newTodoName: "",
            newTodoDetail: "",
            todoDetailName: "",
            todoDetailDetail: "",
            todoDetailStatus: "",
            todoDetailId: "",
            detailUpdateName: "",
            detailUpdateDetail: "",
            detailUpdateStatus: "",
        };
    }
  /* API methods*/
    getTodos(call) {
        let token = localStorage.getItem('token');
        if(token !== undefined) {
            let config = {
                method: 'get',
                url: 'http://138.68.111.211/api/task/getAll',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                },
            };
            axios(config)
            .then((response) => {
                call(response);
            })
            .catch(function (error) {
                //@TODO add error
                console.log(error);
            });
        } else {
            // Check connection
            this.props.checkConnected();
        }
    }
    insertTodo(e) {
        e.preventDefault();
        let token = localStorage.getItem('token');
        if(this.state.newTodoDetail !== "" && this.state.newTodoName !== "") {
            if(token !== null) {
                var config = {
                    method: 'post',
                    url: 'http://138.68.111.211/api/task/create',
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                    },
                    data : {
                        name: this.state.newTodoName,
                        detail: this.state.newTodoDetail,
                    }
                };

                axios(config)
                .then((response) => {
                    if(response.data.success) {
                        if(this.props.is_connected) {
                            this.getTodos((response)=> {
                                debugger;
                                this.setState({
                                    todos: response.data,
                                    newTodoDetail: "",
                                    newTodoName: "",
                                })
                            });
                        }
                    } else {
                        //@TODO add error
                        console.log(response.data.error)
                    }
                })
                .catch(function (error) {
                    //@TODO add error
                    console.log(error);
                });
            } else {
                this.props.checkConnected();
            }
        }
    }
    deleteTodo(e) {
        let id = e.target.dataset.id;
        let token = localStorage.getItem('token');
        if(token !== null) {
            var config = {
                method: 'get',
                url: `http://138.68.111.211/api/task/delete?id=${id}`,
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                }
            };

            axios(config)
            .then((response) => {
                if(response.data.success) {
                    if(this.props.is_connected) {
                        this.getTodos((response)=> {
                            this.setState({
                                todos: response.data,
                            })
                        });
                    }
                } else {
                    //@TODO add error
                    console.log(response.data.error)
                }
            })
            .catch(function (error) {
                //@TODO add error
                console.log(error);
            });
        } else {
            this.props.checkConnected();
        }
    }
    updateTodoCompleted(e) {
        let status = e.target.checked;
        let id = e.target.dataset.id;
        let token = localStorage.getItem('token');
        if(token !== null) {
            var config = {
                method: 'post',
                url: 'http://138.68.111.211/api/task/update',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                },
                data : {
                    id: id,
                    status: status
                }
            };
            axios(config)
            .then((response) => {
                if(response.data.success) {
                    if(this.props.is_connected) {
                        this.getTodos((response)=> {
                            this.setState({
                                todos: response.data,
                            })
                        });
                    }
                } else {
                    //@TODO add error
                    console.log(response.data.error)
                }
            })
            .catch(function (error) {
                //@TODO add error
                console.log(error);
            });
        } else {
            this.props.checkConnected();
        }
    }
    handleUpdateSubmit(e) {
        e.preventDefault();
        let id = e.target.dataset.id;
        let token = localStorage.getItem('token');
        if(token !== null) {
            var config = {
                method: 'post',
                url: 'http://138.68.111.211/api/task/update',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                },
                data : {
                    id: id,
                    name: this.state.todoDetailName,
                    detail: this.state.todoDetailDetail ,
                }
                };
                axios(config)
                .then((response) => {
                if(response.data.success) {
                    if(this.props.is_connected) {
                        this.getTodos((response)=> {
                            this.setState({
                                todos: response.data,
                            })
                            this.closeDetail();
                        });
                    }
                    } else {
                        //@TODO add error
                        console.log(response.data.error)
                    }
                })
                .catch(function (error) {
                    //@TODO add error
                    console.log(error);
                });
        } else {
            this.props.checkConnected();
        }
    }
  displayDetail(e) {
    let id = e.target.dataset.id;
    let token = localStorage.getItem('token');
    if(token !== null) {
        var config = {
            method: 'get',
            url: `http://138.68.111.211/api/task/getOne?id=${id}`,
            headers: { 
              'Authorization': `Bearer ${token}`, 
            },
          };
          
          axios(config)
          .then((response) => {
              if(response.data[0]) {
                this.setState({
                    todoDetailId: response.data[0].id,
                    todoDetailName: response.data[0].name,
                    todoDetailDetail: response.data[0].detail,
                    todoDetailStatus: response.data[0].status,
                })
              } else {
                //@TODO add error
                console.log(response.data);
              }
          })
          .catch(function (error) {
            //@TODO add error
            console.log(error);
          });
    } else {
        this.props.checkConnected();
    }
  }
  
  disconnect(e) {
    let token = localStorage.getItem('token')
    localStorage.removeItem('token');
    if(token !== null) {
        var config = {
            method: 'get',
            url: 'http://138.68.111.211/api/logout',
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          };
          axios(config)
          .then((response) => {
            this.setState({
                todos: "",
                newTodoName: "",
                newTodoDetail: "",
                todoDetailName: "",
                todoDetailDetail: "",
                todoDetailStatus: "",
                todoDetailId: "",
                detailUpdateName: "",
                detailUpdateDetail: "",
                detailUpdateStatus: "",
            })
            this.props.checkConnected();
          })
          .catch(function (error) {
            //@TODO add error
            console.log(error);
          });
    } else {
        this.props.checkConnected();
    }
    
  }

  /** Logic methods */
    closeDetail() {
        this.setState({
            todoDetailId: ""
        })
    }
  componentDidMount() {
      if(this.props.is_connected) {
        this.getTodos(()=> {
            this.setState({
                todos: response.data,
            })
        });
      }
  }
  componentDidUpdate() {
    console.log('updating');
    if(this.props.is_connected && this.state.todos === "") {
        this.getTodos((response)=> {
            this.setState({
                todos: response.data,
            })
        });
    }
  }

  handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      })
  }
  render() {
    const todos = this.state.todos;
    let TodosList = [];
    if(todos !== "") {
        todos.forEach((todo) => {
            if(todo.is_deleted === 0) {
                TodosList.push(
                    <tr key={todo.id}>
                        <td>
                            <span data-id={todo.id} onClick={this.displayDetail.bind(this)}>{todo.name}</span>
                        </td>
                        <td><input data-id={todo.id} type="checkbox" defaultChecked={todo.status} onChange={this.updateTodoCompleted.bind(this)}></input></td>
                        <td><button data-id={todo.id} onClick={this.deleteTodo.bind(this)}>Delete</button></td>
                    </tr>
                ); 
            }
        })
    }
    return(
      <div className={`flex-container flex-column ${this.props.is_connected ? 'show' : 'hide'}`}>
        <button id="disconnect" onClick={this.disconnect.bind(this)}>Disconnect</button>
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {TodosList}
            </tbody>
        </table>

        <form onSubmit={this.insertTodo.bind(this)}>
            <input name="newTodoName" type="text" placeholder="title" value={this.state.newTodoName} onChange={this.handleChange.bind(this)}></input>
            <input name="newTodoDetail" type="text" placeholder="content" value={this.state.newTodoDetail} onChange={this.handleChange.bind(this)}></input>
            <button type="submit">Insert</button>
        </form>
        <div className={`modal-container ${this.state.todoDetailId !== "" ? 'show' : 'hide'}`}>
            <button onClick={this.closeDetail.bind(this)}>Close</button>
            <table>
                <tbody>
                    <tr>
                        <td>{this.state.todoDetailName}</td>
                        <td>{this.state.todoDetailDetail}</td>
                    </tr>
                </tbody>
            </table>
            <form data-id={this.state.todoDetailId} onSubmit={this.handleUpdateSubmit.bind(this)}>
                <input name="todoDetailName" defaultValue={this.state.todoDetailName} onChange={this.handleChange.bind(this)}></input>
                <input name="todoDetailDetail" defaultValue={this.state.todoDetailDetail} onChange={this.handleChange.bind(this)}></input>
                <button type="submit">Update</button>
            </form>
        </div>
      </div>
    )
  }

}


export default Todo;
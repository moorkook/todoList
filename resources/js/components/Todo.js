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
            detailEdit: false,
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
            .catch((error) => {
                this.props.setMessage('Error : getTodos has failed');
            });
        } else {
            // Check connection
            this.props.checkConnected();
        }
    }
    insertTodo(e) {
        e.preventDefault();
        let token = localStorage.getItem('token');
        if(this.state.newTodoName !== "") {
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
                                this.setState({
                                    todos: response.data,
                                    newTodoDetail: "",
                                    newTodoName: "",
                                })
                            });
                        }
                    } else {
                        this.props.setMessage('Error : insert has failed');
                    }
                })
                .catch(function (error) {
                    this.props.setMessage('Error : insert has failed');
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
                            this.props.setMessage('Success : task deleted');
                        });
                    }
                } else {
                    this.props.setMessage('Error : failed to delete');
                }
            })
            .catch(function (error) {
                this.props.setMessage('Error : failed to delete');
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
                    this.props.setMessage('Error : update failed');
                }
            })
            .catch(function (error) {
                this.props.setMessage('Error : update failed');
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
                                detailEdit: !this.state.detailEdit,  
                            })
                            //MicroModal.hide('modal-detail');
                            //this.closeDetail();
                        });
                    }
                    } else {
                        this.props.setMessage('Error : update failed');
                    }
                })
                .catch(function (error) {
                    this.props.setMessage('Error : update failed');
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
                MicroModal.show('modal-detail');
              } else {
                this.props.setMessage('Error : cannot display task detail');
              }
          })
          .catch(function (error) {
            this.props.setMessage('Error : cannot display task detail');
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
          .catch((error) => {
            this.props.setMessage("Error : cannot disconnect (it's a bad one)");
          });
    } else {
        this.props.checkConnected();
    }
    
  }

  /** Logic methods */
    toggleEdit() {
        this.setState({
            detailEdit: !this.state.detailEdit,
        })
    }
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
                    <tr key={todo.id} className="todo-line">
                        <td><input className="show-hand" data-id={todo.id} type="checkbox" defaultChecked={todo.status} onChange={this.updateTodoCompleted.bind(this)}></input></td>
                        <td>
                            <span className="show-hand" data-id={todo.id} onClick={this.displayDetail.bind(this)}>{todo.name}</span>
                        </td>
                        <td><button data-id={todo.id} onClick={this.deleteTodo.bind(this)}>X</button></td>
                    </tr>
                ); 
            }
        })
    }
    return(
      <div className={`flex-container flex-column half-width ${this.props.is_connected ? 'show' : 'hide'}`}>
        <button id="disconnect" onClick={this.disconnect.bind(this)}>disconnect</button>
        <h1>Tasks</h1>
        <table className="full-width">
            <tbody>
                {TodosList}
            </tbody>
        </table>

        <form onSubmit={this.insertTodo.bind(this)} className="flex-container flex-column">
            <input name="newTodoName" type="text" placeholder="Task" maxLength="100" value={this.state.newTodoName} onChange={this.handleChange.bind(this)}></input>
            <textarea name="newTodoDetail" type="text" placeholder="Description" maxLength="200" value={this.state.newTodoDetail} onChange={this.handleChange.bind(this)}></textarea>
            <button type="submit">Insert</button>
        </form>
        <div className="modal micromodal-slide" id="modal-detail" aria-hidden="true">
            <div className="modal__overlay" tabIndex="-1" data-micromodal-close>
            <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                <header className="modal__header">
                    <h2 className="modal__title" id="">
                    </h2>
                    <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                </header>
                <main className="modal__content" id="modal-1-content">
                    <div onClick={this.toggleEdit.bind(this)} className={`${this.state.detailEdit ? "hide" : "show"} show-hand`}>
                        <h2>{this.state.todoDetailName}</h2>
                        <p>{this.state.todoDetailDetail}</p>
                    </div>
                    <form className={`${this.state.detailEdit ? "show" : "hide"} flex-container flex-column`} data-id={this.state.todoDetailId} onSubmit={this.handleUpdateSubmit.bind(this)}>
                        <input name="todoDetailName" maxLength="100" defaultValue={this.state.todoDetailName} onChange={this.handleChange.bind(this)}></input>
                        <textarea name="todoDetailDetail" maxLength="200" defaultValue={this.state.todoDetailDetail} onChange={this.handleChange.bind(this)}></textarea>
                        <button type="submit">Update</button>
                    </form>
                </main>
            </div>
            </div>
        </div>
      </div>
    )
  }

}


export default Todo;
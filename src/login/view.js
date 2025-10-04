import React from 'react';
import server from './tunnel';
import cookie from 'react-cookies'


export default class View extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }


  onLogin = () => {
    let user = {
      username: this.state.username,
      password: this.state.password
    }
    this.props.setLoading(true)
    server.login(user, res => {
      if(res.status){
        cookie.save('t3U', user.username, { path: '/' })
        cookie.save('t3P', user.password, { path: '/' })
        this.props.setUser(res.data)
      }else{
        this.props.setLoading(false)
        alert(res.msg)
      }
    })
  }

  onValueChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState(() => ({
      [name]: value
    }))
  }

  render(){
    return <div className="login-frame">
      <br />
          <div className="row">
            <div className="col-12">
              <h3>Welcome to Triple T Manager</h3>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-12">
              <label>Username: </label>
              <input onChange={this.onValueChange} name="username" type="text"/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-12">
              <label>Password: </label>
              <input onChange={this.onValueChange} name="password" type="password"/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-12">
              <button onClick={this.onLogin} className="btn btn-success">Login</button>
            </div>
          </div>
          <br />
    </div>
  }
}

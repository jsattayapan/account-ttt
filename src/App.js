import React from 'react';
import Login from './login/view'
import ViewProps from './main/view-props'
import Loading from 'react-fullscreen-loading';
import cookie from 'react-cookies'
import server from './login/tunnel'
import './App.css';
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

import HandyManUploadJobImages from './main/engineer/handy_man_upload_job_images'
import { CreateNewJob } from './main/dept-manager/eng-jobs-management'
import UserProfile from './user-profile/index'
import JepDailyReport from './web-tablet/page/jepDailyReport'


const App = () => (
  <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <MainRoute />
          </Route>
          <Route exact path="/thamd">
            <div className="reset"><JepDailyReport /></div>

          </Route>
          <Route path="/eng-job-post-image/:jobId/:employeeId" >
            <EngJobPostImageChild />
          </Route>
          <Route path="/hk-job-post/:employeeId" >
            <HKJobPostChild />
          </Route>
          <Route path="/user-profile/:id">
            <UserProfileHook />
          </Route>
          <Route path="/" >
            <ErrorPage />
          </Route>
        </Switch>
    </Router>
)

const UserProfileHook = props => {
  let params = useParams();
  return <UserProfile id={params.id} />
}

const EngJobPostImageChild = () => {
  let { jobId, employeeId } = useParams()
  return (
    <HandyManUploadJobImages jobId={jobId} employeeId={employeeId} />
  );
}
const HKJobPostChild = () => {
  let { employeeId } = useParams()
  return (
    <CreateNewJob user={{username: employeeId}} reloadJobList={() => {}} />
  );
}

const ErrorPage = () => {
  return (
    <div>
      <h1>No page found</h1>
    </div>
  );
}

class MainRoute extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user : {
      },
      currentPage: 'login',
      loading: false
    }
  }

  componentDidMount() {
    let username = cookie.load('t3U')
    let password = cookie.load('t3P')
    if(username !== undefined && password !== undefined){
      this.setState(() => ({
        loading: true
      }))
      server.login({username, password}, res => {
        if(res.status){
          this.setUser(res.data)
        }
      })
    }
  }

  setUser = (user) => {
    this.setState(() => ({
      user,
      currentPage: 'main',
      loading: false
    }))
  }

  setLoading = (loading) => {
    this.setState(() => ({
      loading
    }))
  }

  logout = () => {
    cookie.remove('t3U', { path: '/' })
    cookie.remove('t3P', { path: '/' })
    this.setState(() => ({
      currentPage: 'login',
      user: {}
    }))
  }

  render(){
    return (
      <div className="App">
        {
          this.state.loading &&
          <Loading loading background="rgba(80,80,80,0.1)" loaderColor="#3498db" />
        }
        <div className="container-fluid">
          {this.state.currentPage === 'login' && <Login setUser={this.setUser} setLoading={this.setLoading} />}
          {this.state.currentPage === 'main' && <ViewProps logout={this.logout} user={this.state.user} />}

        </div>
      </div>
    );
  }
}

export default App;

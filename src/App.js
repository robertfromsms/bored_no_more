import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'

import './App.css'
import NavBar from './components/navBar'
import Landing from './components/Landing'
import LoginForm from './components/LoginForm'
import NewUserForm from './components/NewUserForm'
import UserProfile from './components/UserProfile'
import ChangePassword from './components/ChangePassword'
import Activity from './components/Activity'

function App() {

  return (
    <div className="App">
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui container">
          <NavBar/>
        </div>
      </div>
      { localStorage.jwt ?
      <Switch>
        <Route exact path='/' render={() =>  <Landing />} />
        <Route exact path='/profile' render={() => <UserProfile/>} />
        <Route exact path='/account' render={() => <ChangePassword />} />
        <Route exact path='/activity' render={() => <Activity />} />
        <Route path='/' render={() => <Redirect to='/profile' />} />
      </Switch>
      :
      <Switch>
        <Route exact path='/' render={() =>  <Landing />} />
        <Route exact path='/signup' render={() => <NewUserForm />} />
        <Route exact path='/login' render={() => <LoginForm />} />
        <Route path='/' render={() => <Redirect to='/' />} />
      </Switch>
      }
    </div>
  ); 
}

export default App;

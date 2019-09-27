import React from 'react'
import {connect} from 'react-redux'
import { Button, Card, Form, Grid, Header, Image, Segment, Tab } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'

// local state for submitting forms
class ChangePassword extends React.Component {
  constructor() {
    super()
    this.state = {
      user: {
        password: null,
        password_confirmation: null
      }
    }
  }

  userUpdate = (event) => {
    const user = this.state.user
    const jwt = localStorage.jwt

    const userUpdateConfigObj = {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json',
        'Authorization': `"Bearer ${jwt}"`
      },
      body: JSON.stringify({
        "user": {
         "password": user.password
        }
      })
    }

    if (!user.password || !user.password_confirmation) {
      alert("You must input new password and password confirmation to change your password")
      window.location.href = '/account'
    }
    else if ( user.password === user.password_confirmation) {
      fetchFun.genericNonGetFetch("profile", userUpdateConfigObj)
      .then(data => {
        console.log(data)
        if (data.jwt) {
          alert("Update successfully. Logging you out")
          localStorage.removeItem("jwt")
          window.location.href = "/"
        }
        else {
          alert(data.error)
          window.location.href = "/account"
        }
      })
    }
    else {
      alert("Your second password entry must match the first.")
      window.location.href = "/account"
    }
  }

  render() {
    // we check whether if the update fields are empty strings, if they are, they are set to null
    const editUserPasswordFormComp = (
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='blue' textAlign='center' block>
            <Image src='/logo.png' /> Change Your Password
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input onChange={(event) => {
                let password = event.target.value === "" ? null : event.target.value
                this.setState({user: {...this.state.user, password: password}})
              }} 
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='New Password'
                type='password'
                name='password'
              />
              <Form.Input onChange={(event) => {
                let password_con = event.target.value === "" ? null : event.target.value
                this.setState({user: {...this.state.user, password_confirmation: password_con}})
              }} 
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Enter your new password again'
                type='password'
                name='password_confirmation'
              />
              <Button onClick={this.userUpdate}color='blue' fluid size='large'>
                Change Password
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
    )
    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' id="website">
            {editUserPasswordFormComp}
        </Grid>
    )
  }
}

export default ChangePassword
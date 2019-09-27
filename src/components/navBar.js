import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export default class NavBar extends Component {
  constructor() {
    super()
    this.state = {activeItem: null}
  }

  handleItemClick = (event, { name }) => 
    this.setState({ activeItem: name })


  logout = (event) => {
    localStorage.removeItem("jwt")
    window.location.href = "/"
  }

  render() {
    const { activeItem } = this.state
    let loggedInNavBarItems = [
      <Menu.Item
            name="Profile"
            key="profile"
            active={activeItem === "Profile"}
            as={Link}
            to='/profile'
            onClick={
              this.handleItemClick
            }
          >
            Profile
      </Menu.Item>,
      <Menu.Item
            position='right'
            name="Logout"
            key="logout"
            active={activeItem === "Logout"}
            onClick={
                this.logout
            }
          >
            Logout
      </Menu.Item>,
      <Menu.Item
            name="Change Password"
            key="change password"
            active={activeItem === "Change Password"}
            as={Link}
            to='/account'
            onClick={
              this.handleItemClick
            }
          >
            Change Password
      </Menu.Item>
    ]
    let notLoggedInNavBarItems = [
      <Menu.Item
            position='right'
            name="Login"
            key="login"
            as={Link}
            to='/login'
            active={activeItem === "Login"}
            onClick={
              this.handleItemClick
            }
          >
            Login
      </Menu.Item>,
      <Menu.Item
            name="Signup"
            key="signup"
            as={Link}
            to='/signup'
            active={activeItem === "Signup"}
            onClick={
              this.handleItemClick
            }
          >
            Sign Up
      </Menu.Item>
    ]

    return (
      <Menu>
        {localStorage.jwt ? loggedInNavBarItems : notLoggedInNavBarItems}
      </Menu>
    )
  }
}
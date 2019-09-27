import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import NewUserForm from './NewUserForm'
import image from '../what.jpg'
import image2 from '../what2.png'
import ActivityInstanceCard from './ActivityInstanceCard'

class UserProfile extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null,
      activity: null,
      activity_instances: []
    }
  }

  componentDidMount() {
    const jwt = localStorage.jwt
    fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + `${jwt}`
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      this.setState({
        user: data.user,
        activity_instances: data.user.activity_instances_with_activity
      })
    })
  }

  handleFind = (event) => {
    const configObj = {
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      }
    }

    fetch("https://www.boredapi.com/api/activity", configObj)
    .then(response => response.json())
    .then(activity => this.setState({activity: activity}))
  }

  handleUpdate = (event, activityinstance) => {
    const jwt = localStorage.jwt
    if (event.target.textContent === "Complete") {
      var body = {
        body: JSON.stringify({
              activity_instance: {
                completed: true,
                rating: parseFloat(activityinstance.rating)
                
              }
            })
      } 
    }
    else {
      var body = {
        body: JSON.stringify({
                activity_instance: {
                  completed: activityinstance.completed,
                  rating: parseFloat(event.target.value)
                  
                }
              })
      }
    }
    let configObj = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + `${jwt}`
      },
      ...body
    }
    fetch(`http://localhost:3000/activity_instances/${activityinstance.id}`, configObj)
    .then(response => response.json())
    .then(updatedData => {
      let activityInstanceIndex = this.state.activity_instances.findIndex((activityinstance) => {
        return activityinstance.id === updatedData.activity_instance.id
      })
      let newActivityInstances = this.state.activity_instances
      newActivityInstances.splice(activityInstanceIndex, 1, updatedData.activity_instance)
      console.log(updatedData.activity_instance)
      console.log(newActivityInstances)
      console.log(updatedData)

      this.setState({activity_instances: newActivityInstances})
    })
  }

  handleDoActivity = (event) => {
    let state = this.state
    const jwt = localStorage.jwt
    let body = {
      body: JSON.stringify({
            activity:{
              description: this.state.activity.activity,
              accessibility: this.state.activity.accessibility,
              category: this.state.activity.type,
              participants: this.state.activity.participants,
              price: this.state.activity.price,
              apiKey: parseInt(this.state.activity.key)
            }
      })
    } 
    let configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + `${jwt}`
      },
      ...body
    }
    fetch("http://localhost:3000/activity_instances", configObj)
    .then(response => response.json())
    .then(newData => {
      let newActivityInstances = this.state.activity_instances
      newActivityInstances.splice(0, 0, newData.activity_instance)

      this.setState({activity_instances: newActivityInstances})
    })
  }

  render() {

    let allActCardComponents = this.state.activity_instances.map((activityInstance) => 
      <ActivityInstanceCard activityinstance={activityInstance} handleUpdate={this.handleUpdate}/>
      )
    
    return (
      <div>
        <div className="ui centered cards">  
          <div className="card">
            <div className="image">
              <img src={image} />
            </div>
            <div className="content">
              <p className="header">{this.state.user ? this.state.user.user_name : null}</p>
              <div className="description">
                <button type="button" onClick={this.handleFind} >Find Something to Do!</button>
              </div>
            </div>
            <div className="extra content">
              <p>
                {this.state.user ? this.state.activity_instances.length + " Completed Activities" : null}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="image">
              <img src={image2} />
            </div>
            <div className="content">
              <a className="header">{this.state.activity ? this.state.activity.activity : null}</a>
              <div className="description">
                Type: {this.state.activity ? this.state.activity.type : "NA"}<br/>
                {this.state.activity ? <button type="button" onClick={this.handleDoActivity} >Let's Do This Activity!</button> : null}
              </div>
            </div>
            <div className="extra content">
              <p>
                # Participants: {this.state.activity ? this.state.activity.participants : "NA"} <br/>
                Accessibility Level: {this.state.activity ? this.state.activity.accessibility*10 : "NA"} <br/>
                Price Level: {this.state.activity ? this.state.activity.price*10 : "NA"}
              </p>
            </div>
          </div>
        </div>
        <div class="ui cards">
          {allActCardComponents}
        </div>
      </div>
    )
  }
}



export default UserProfile
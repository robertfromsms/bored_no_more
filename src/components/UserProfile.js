import React from 'react'
import {connect} from 'react-redux'
import { Button, Card, Form, Grid, Header, Icon, Image, Message, Segment } from 'semantic-ui-react'

import NewUserForm from './NewUserForm'
import image from '../what.jpg'
import ActivityInstanceCard from './ActivityInstanceCard'
import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: null
    }
  }

  componentDidMount() {
    this.props.dispatch({type: 'STOP_LOADING'})

    const jwt = localStorage.jwt
    const profileConfigObj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + `${jwt}`
      }
    }

    fetchFun.genericNonGetFetch("profile", profileConfigObj)
    .then(data => {
      this.props.dispatch({
          type: 'FETCH_PROFILE_DATA',
          profileData: data
        })
      this.props.dispatch({type: 'STOP_LOADING'})
    })
    this.props.dispatch({type: 'LOADING'})
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
    let updateActivityInstanceConfigObj = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + `${jwt}`
      },
      ...body
    }
    
    fetchFun.genericNonGetFetch(`activity_instances/${activityinstance.id}`, updateActivityInstanceConfigObj)
    .then(updatedData => {
      let activityInstanceIndex = this.props.fetchedInfo.profileData.user.activity_instances_with_activity.findIndex((activityinstance) => {
        return activityinstance.id === updatedData.activity_instance.id
      })
    
      let newActivityInstances = [...this.props.fetchedInfo.profileData.user.activity_instances_with_activity]
      newActivityInstances.splice(activityInstanceIndex, 1, updatedData.activity_instance)

      this.props.dispatch({
        type: 'UPDATE_ACTIVITY_INSTANCES',
        newActivityInstances: newActivityInstances
      })
      this.props.dispatch({type: 'STOP_LOADING'})
    })
    this.props.dispatch({type: 'LOADING'})
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

  handleDoActivity = (event) => {
    let activity = this.state.activity
    const jwt = localStorage.jwt
    let body = {
      body: JSON.stringify({
        activity:{
          description: activity.activity,
          accessibility: activity.accessibility,
          category: activity.type,
          participants: activity.participants,
          price: activity.price,
          apiKey: parseInt(activity.key)
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
    fetchFun.genericNonGetFetch("activity_instances", configObj)
    .then(newData => {
      let newActivityInstances = [...this.props.fetchedInfo.profileData.user.activity_instances_with_activity]
      newActivityInstances.splice(0, 0, newData.activity_instance)

      this.props.dispatch({
        type: 'UPDATE_ACTIVITY_INSTANCES',
        newActivityInstances: newActivityInstances
      })
      this.props.dispatch({type: 'STOP_LOADING'})
    })
    this.props.dispatch({type: 'LOADING'})
  }

  render() {

    let allActCardComponents = this.props.fetchedInfo.profileData ? this.props.fetchedInfo.profileData.user.activity_instances_with_activity.map((activityInstance) => 
      <ActivityInstanceCard activityinstance={activityInstance} handleUpdate={this.handleUpdate} />
    ) : []
    
    return (
      this.props.appcentricState.loading ?
        <ResponsiveContainer verticalAlign='middle' centered>
          <Loading />
        </ResponsiveContainer>
      :
        <Grid verticalAlign='middle' id="website">
          <Grid.Row centered>
            <Card>
              <Image src={image} wrapped ui={false} />
              <Card.Content>
                <Card.Header>{this.props.fetchedInfo.profileData ? this.props.fetchedInfo.profileData.user.user_name : null}</Card.Header>
                <Card.Meta>
                  <span>{this.props.fetchedInfo.profileData ? this.props.fetchedInfo.profileData.user.activity_instances_with_activity.length + " Activities" : null}</span>
                </Card.Meta>
                <Card.Description>
                  <Button type="button" onClick={this.handleFind} >Find Something to Do!</Button><br/><br/><br/>
                  <h2>{this.state.activity ? this.state.activity.activity : ""}</h2>
                  Type: {this.state.activity ? this.state.activity.type : ""}<br/>
                  # Participants: {this.state.activity ? this.state.activity.participants : ""} <br/>
                  {this.state.activity ? <Button type="button" onClick={this.handleDoActivity} >Let's Do This Activity!</Button> : null}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Row>
          <Header as='h1' color='violet' textAlign='center' block >
            <Image src='/logo.png' />  List of Your Activities  
          </Header>
          <Grid.Row>
            <Card.Group>
              {allActCardComponents}
            </Card.Group>
          </Grid.Row>
        </Grid>
    )
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedUserProfile = connector(UserProfile)

export default connectedUserProfile
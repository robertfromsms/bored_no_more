import React from 'react'
import {connect} from 'react-redux'
import { Button, Card, Dropdown, Form, Grid, Header, Icon, Image, Message, Segment } from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'

class Activity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: null
    }
  }

  componentDidMount() {
    const jwt = localStorage.jwt
    const activitiesConfigObj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + `${jwt}`
      }
    }

    fetchFun.genericNonGetFetch("activities", activitiesConfigObj)
    .then(data => {
      this.props.dispatch({
          type: 'FETCH_ACTIVITIES_DATA',
          activitiesData: data
        })
      this.props.dispatch({type: 'STOP_LOADING'})
    })
    this.props.dispatch({type: 'LOADING'})
  }

  handleShowDetails = (event) => {
    const jwt = localStorage.jwt
    const activitiesConfigObj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + `${jwt}`
      }
    }

    if (this.state.activity) {
      fetchFun.genericNonGetFetch(`activities/${this.state.activity}`, activitiesConfigObj)
      .then(data => {
        this.props.dispatch({
            type: 'FETCH_ACTIVITY_DETAIL_DATA',
            activityDetailData: data
          })
        this.props.dispatch({type: 'STOP_LOADING'})
      })
      this.props.dispatch({type: 'LOADING'})
    }
    else {
      alert("You must select an activity first.")
    }
  }

  // handleUpdate = (event, activityinstance) => {
  //   const jwt = localStorage.jwt
  //   if (event.target.textContent === "Complete") {
  //     var body = {
  //       body: JSON.stringify({
  //         activity_instance: {
  //           completed: true,
  //           rating: parseFloat(activityinstance.rating)
  //         }
  //       })
  //     } 
  //   }
  //   else {
  //     var body = {
  //       body: JSON.stringify({
  //         activity_instance: {
  //           completed: activityinstance.completed,
  //           rating: parseFloat(event.target.value)    
  //         }
  //       })
  //     }
  //   }
  //   let updateActivityInstanceConfigObj = {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': "Bearer " + `${jwt}`
  //     },
  //     ...body
  //   }
    
  //   fetchFun.genericNonGetFetch(`activity_instances/${activityinstance.id}`, updateActivityInstanceConfigObj)
  //   .then(updatedData => {
  //     let activityInstanceIndex = this.props.fetchedInfo.profileData.user.activity_instances_with_activity.findIndex((activityinstance) => {
  //       return activityinstance.id === updatedData.activity_instance.id
  //     })
    
  //     let newActivityInstances = [...this.props.fetchedInfo.profileData.user.activity_instances_with_activity]
  //     newActivityInstances.splice(activityInstanceIndex, 1, updatedData.activity_instance)

  //     this.props.dispatch({
  //       type: 'UPDATE_ACTIVITY_INSTANCES',
  //       newActivityInstances: newActivityInstances
  //     })
  //     this.props.dispatch({type: 'STOP_LOADING'})
  //   })
  //   this.props.dispatch({type: 'LOADING'})
  // }

  // handleFind = (event) => {
  //   const configObj = {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   }

  //   fetch("https://www.boredapi.com/api/activity", configObj)
  //   .then(response => response.json())
  //   .then(activity => this.setState({activity: activity}))
  // }

  // handleDoActivity = (event) => {
  //   let activity = this.state.activity
  //   const jwt = localStorage.jwt
  //   let body = {
  //     body: JSON.stringify({
  //       activity:{
  //         description: activity.activity,
  //         accessibility: activity.accessibility,
  //         category: activity.type,
  //         participants: activity.participants,
  //         price: activity.price,
  //         apiKey: parseInt(activity.key)
  //       }
  //     })
  //   } 
  //   let configObj = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': "Bearer " + `${jwt}`
  //     },
  //     ...body
  //   }
  //   fetchFun.genericNonGetFetch("activity_instances", configObj)
  //   .then(newData => {
  //     let newActivityInstances = [...this.props.fetchedInfo.profileData.user.activity_instances_with_activity]
  //     newActivityInstances.splice(0, 0, newData.activity_instance)

  //     this.props.dispatch({
  //       type: 'UPDATE_ACTIVITY_INSTANCES',
  //       newActivityInstances: newActivityInstances
  //     })
  //     this.props.dispatch({type: 'STOP_LOADING'})
  //   })
  //   this.props.dispatch({type: 'LOADING'})
  // }

  render() {
    let activityOptions = this.props.fetchedInfo.activitiesData ? this.props.fetchedInfo.activitiesData.map((activity) => {return {key: activity.id, text: activity.description, value: activity.id}}) : []
    let details = this.props.fetchedInfo.activityDetailData ? null : null

    return (
      this.props.appcentricState.loading ?
        <ResponsiveContainer verticalAlign='middle' centered>
          <Loading />
        </ResponsiveContainer>
      :
        <Grid verticalAlign='middle' id="website" centered>
          <Header as='h1' color='violet' textAlign='center' block >
            <Image src='/logo.png' />  Select an activity to see details  
          </Header>
          <Grid.Row centered>
            <Dropdown
              placeholder='Select Activity'
              selection
              options={activityOptions}
              onChange={(event, selection) => this.setState({activity: selection.value})}
            />
            <Button type="button" onClick={this.handleShowDetails} >Show Activity Details!</Button>
          </Grid.Row>
          <Grid.Row style={{ minHeight: '80vh' }}>
            {details}
          </Grid.Row>
        </Grid>
    )
  }
}

const iNeedtheFetchedInfo = (state) => {
  return state
}

const connector = connect(iNeedtheFetchedInfo)
const connectedActivity = connector(Activity)

export default connectedActivity
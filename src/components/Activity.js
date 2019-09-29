import React from 'react'
import {connect} from 'react-redux'
import { Button, Card, Comment, Dropdown, Form, Grid, Header, Image} from 'semantic-ui-react'

import fetchFun from '../services/ourBackend'
import ResponsiveContainer from './ResponsiveContainer'
import Loading from './Loading'

class Activity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: null,
      comment: ""
    }
  }

  componentDidMount() {
    const jwt = localStorage.jwt
    const activitiesConfigObj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + jwt
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
        'Authorization': "Bearer " + jwt
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

  handleNewComment = (event) => {
    const jwt = localStorage.jwt
    let body = {
      body: JSON.stringify({
        comment:{
          activity_id: this.state.activity,
          content: this.state.comment
        }
      })
    } 
    let newCommentConfigObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + jwt
      },
      ...body
    }
    fetchFun.genericNonGetFetch("comments", newCommentConfigObj)
    .then(newData => {
      let new_comments_with_users = [...this.props.fetchedInfo.activityDetailData.activity.comments_with_users]
      new_comments_with_users.splice(0, 0, newData.comment)

      this.props.dispatch({
        type: 'UPDATE_COMMENTS_WITH_USERS',
        new_comments_with_users: new_comments_with_users
      })
      this.props.dispatch({type: 'STOP_LOADING'})
    })
    this.props.dispatch({type: 'LOADING'})
  }

  render() {
    let activityOptions = this.props.fetchedInfo.activitiesData ? this.props.fetchedInfo.activitiesData.map((activity) => {return {key: activity.id, text: activity.description, value: activity.id}}) : []
    let detailData = this.props.fetchedInfo.activityDetailData
    let comments = detailData ? detailData.activity.comments_with_users.map((comment) => {
        return (
          <Comment key={comment.written_at + comment.author}>
            <Comment.Content>
              <Comment.Author as='a' >{comment.user} said:</Comment.Author>
              <br/>
              <Comment.Metadata>
                <div>{comment.written_at.substring(0, comment.written_at.length -5)}</div>
              </Comment.Metadata>
              <br/>
              <Comment.Text>{comment.content}</Comment.Text>
            </Comment.Content>
            <br/>
          </Comment>
        )
      })
    :
    ([])

    let details = detailData ? (
      <Card style={{ minWidth: 500 }}>
        <Card.Content>
          <Card.Header>{detailData.activity.description}</Card.Header>
          <Card.Meta>
            <span>
              {`Average Rating: ${detailData.activity.average_rating ? detailData.activity.average_rating.substring(0, 4) : ""}`} <br/>
              {`Number of Times Completed: ${detailData.activity.total_completed}`}
            </span>
          </Card.Meta>
          <Card.Description>
            {`Type: ${detailData.activity.category}`}<br/>
            {`Number of Participants: ${detailData.activity.participants}`}<br/>
            <Comment.Group>
              <Header as='h3' dividing>
                Comments
              </Header>
                {comments}
              <Form reply>
                <Form.TextArea onChange={(event, obj) => {
                    this.setState({comment: obj.value})
                  }}
                />
                <Button content='Add Reply' onClick={this.handleNewComment} labelPosition='left' icon='edit' primary />
              </Form>
            </Comment.Group>            
          </Card.Description>
        </Card.Content>
      </Card>
    ) 
    : (
      null
    )

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
          <Grid.Row style={{ minHeight: '100vh' }}>
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
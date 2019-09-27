import React from "react";

const ActivityInstanceCard = props => {
  return (
    <div className="card">
      <div className="content">
        <div className="header">
          {props.activityinstance.description}
        </div>
        <div className="description">
          <h5>Activity Started At</h5> {props.activityinstance ? props.activityinstance.activity_started_at.slice(0,19) : null} <br/>
          <h5>Completed?</h5> {props.activityinstance ? props.activityinstance.completed.toString() : null}<br/>
          {(props.activityinstance && !props.activityinstance.completed) ? <div className="ui basic button" data-id={props.activityinstance.id} onClick={(event) => {props.handleUpdate(event,props.activityinstance)}}>Complete</div> : null}
          <h5>Rating</h5> {props.activityinstance.rating}<br/>
          <select name="rating" data-id={props.activityinstance.id} onChange={(event) => {props.handleUpdate(event,props.activityinstance)}}>
            <option value="0">0</option>
            <option value="0.5">0.5</option>
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
            <option value="2.5">2.5</option>
            <option value="3">3</option>
            <option value="3.5">3.5</option>
            <option value="4">4</option>
            <option value="4.5">4.5</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div className="extra content">
      </div>
    </div>
  );

};

export default ActivityInstanceCard;
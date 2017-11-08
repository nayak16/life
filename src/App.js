import { Map } from 'immutable';

import React, { Component } from 'react';
import './App.css';
import { 
  Button, ButtonGroup, Col, FormGroup, 
  ControlLabel, Panel, FormControl, HelpBlock, 
  Grid, Row, Glyphicon, PageHeader 
} from 'react-bootstrap';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}


class TimerDisplay extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    var seconds = this.props.seconds;
    var minutes = Math.floor(seconds / 60);
    var truncSeconds = seconds - (60 * minutes)
    return (
      <h5>{minutes}:{truncSeconds}</h5>
    )
  }
}


class Timer extends Component {
  constructor() {
    super()
    this.state = {
      started: false,
      seconds: 0
    }
    this.setIntervalId = 0
    this.handleDelete = this.handleDelete.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  handleDelete(e) {
    e.preventDefault();
    this.stopTimer()
    this.props.delete(this.props.id);
  }

  tick() {
    this.setState({
        seconds: this.state.seconds + 1
    })
  }

  startTimer() {
    this.stopTimer()
    this.setIntervalId = setInterval(this.tick.bind(this), 100)
    this.setState({
      started: true
    })
  }

  stopTimer() {
    clearInterval(this.setIntervalId)
    this.setState({
      started: false
    })
  }

  render() {
    var started = this.state.started;
    const header = (<div><h3>{this.props.title}<small style={{float: "right"}} className='float-md-right'><a href="#" onClick={this.handleDelete}>x</a></small></h3></div>);
    return (
      <Panel header={header}>
        <Grid>
          <Row className="">
            <Col md={4}><TimerDisplay seconds={this.state.seconds}></TimerDisplay></Col>
          </Row>
          <Row className="">
            <Col md={12}>
              <ButtonGroup>
                {started ? 
                  <Button onClick={this.stopTimer} bsStyle="danger">Stop</Button> :               
                  <Button onClick={this.startTimer} bsStyle="success">Start</Button>
                }
              </ButtonGroup>
            </Col>
          </Row>
        </Grid>
      </Panel>
    )
  }

}

class AddTimerForm extends Component {
  constructor() {
    super()
    this.state = {
      onForm: false,
      titleText: ""
    }
    this.toggleForm = this.toggleForm.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  toggleForm() {
    this.setState({
      onForm: !this.state.onForm
    })
  }

  handleTitleChange(event){
    this.setState({
      titleText: event.target.value
    })
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.toggleForm();
    this.props.formSubmit(this.state.titleText);
  }

  render() {
    return (
      <Grid>
        <Row className="">
          <Col md={4}>
            {
              this.state.onForm ? 
              (
                <form>
                  <FieldGroup
                    id="titleInput"
                    type="text"
                    label="Timer Title"
                    placeholder="Enter timer title"
                    onChange={this.handleTitleChange}
                  />
                  <Button type="submit" onClick={this.handleFormSubmit}>
                    Submit
                  </Button>
                  <Button onClick={this.toggleForm}>
                    Cancel
                  </Button>
                </form>
                ) : (
                <Button onClick={this.toggleForm}>+</Button>
              )
            }
          </Col>
        </Row>
      </Grid>
    )
  }

}


class App extends Component {
  constructor() {
    super()
    this.state = {
      timers: Map({}),
      timerId: 0
    }

    this.createTimer = this.createTimer.bind(this);
    this.deleteTimer = this.deleteTimer.bind(this);
  }

  componentDidMount() {
    this.createTimer("Default Timer");
  }

  createTimer(title) {
    console.log(title);
    var timers = this.state.timers;
    var timerId = this.state.timerId;
    var updatedTimers = timers.set(timerId, <Timer title={title} id={timerId} delete={this.deleteTimer}/>)
    this.setState({
      timers: updatedTimers,
      timerId: timerId + 1,
    })
  }

  deleteTimer(id) {
    var deleted = this.state.timers.delete(id);
    this.setState({
      timers: deleted
    })
  }

  render() {
    var timers = this.state.timers;

    var displayTimers = timers.toArray()
    console.log(displayTimers);
    return (
      <div>
        <PageHeader>Timers List<small> by Aatish Nayak</small></PageHeader>
        <Grid>
          {displayTimers.map(timer =>
              <Row>
                <Col md={4}>{timer}</Col>
              </Row>
          )}
           <Row>
            <Col md={4}>
              <AddTimerForm formSubmit={this.createTimer}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';

import './shop-list-item.css';

// For detailed page
// import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { fullWeekDay, weekDayMap } from '../../helpers/date-helpers';
import { Link } from 'react-router-dom';

export default class App extends Component {
  state = {
    curDay: fullWeekDay, // date-helpers
    curDayIndex: weekDayMap[fullWeekDay], // date-helpers
    curTime: this.getCurTime(),
    shopIsWorking: false,
  };

  // For detailed page
  // onTimeRangeChange = (time, index) => {
  //   const times = [...this.state.times]; // Shallow копия
  //   times[index].time = time; // Обновление единственного времени
  //   return this.setState({ times });
  // };

  componentDidMount = () => {
    this.updateShop();
    
    this.updateSetInterval = setInterval(() => {
      this.updateShop();
    }, 1000 * 1);
  };

  componentWillUnmount = () => {
    clearInterval(this.updateSetInterval);
  };

  updateShop = () => {
    this.setState({ curTime: this.getCurTime() });
    this.checkIsWorking();
  };

  getCurTime() {
    // Собирает строку вида HHmm
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getSeconds();
    let time = '';
    [hours, minutes].forEach((el) => {
      if (el < 10) time += '0'
      if (el === null) time += '00'
      time += el
    });
    return time;
  };

  checkIsWorking = () => {
    const { schedule } = this.props;
    if (!schedule) return null; // state isn't ready
    const todaySchedule = schedule[this.state.curDayIndex];

    // Is today closed
    if (todaySchedule.closed) {
      this.setState({ shopIsWorking: false });
      return;
    }

    // Is during work time
    const time = todaySchedule.workTime.map(el => el || '00:00');
    const from = time[0].replace(':', '');
    const to = time[1].replace(':', '');
    // if ((from <= this.state.curTime) && (to >= this.state.curTime)) {
    if (from > this.state.curTime || to < this.state.curTime) {
      this.setState({ shopIsWorking: false });
      return;
    }

    // Has time offs
    if (!todaySchedule.timeOffs) {
      this.setState({ shopIsWorking: true });
      return;
    }

    // Is during time offs
    for (let i = 0; i < todaySchedule.timeOffs.length; i++) {
      // If time == null, change it to '00:00'
      const time = todaySchedule.timeOffs[i].time.map(el => el || '00:00');
      const from = time[0].replace(':', '');
      const to = time[1].replace(':', '');
      
      if ((from <= this.state.curTime) && (to >= this.state.curTime)) {
        this.setState({ shopIsWorking: false });
        return;
      }
    }

    this.setState({ shopIsWorking: true });
  };

  // For detailed page
  // При сохранении, если from > to (то поменять их местами)
  // saveShop = () => {};

  handleDelete = () => {
    this.props.handleDelete(this.props._id);
  };

  render() {
    const descriptionElem = this.props.description ? <p>{ this.props.description }</p> : null;
    const addressElem = this.props.address ? <p>Address: { this.props.address }</p> : null;

    if (!this.props.schedule) return null; // state isn't ready
    const days = this.props.schedule.map((day, dayIndex) => {
      const workTime = day.workTime;
      let timeElem = ''
      if (day.closed) {
        timeElem = <span className="text-danger pr-3">Closed</span>
      } else {
        timeElem = <span className="text-success pr-3">Open {workTime[0]}-{workTime[1]};</span>
      }

      let timeOffsElems = null;
      if (day.timeOffs) {
        timeOffsElems = day.timeOffs.map((time, timeIndex) => {
          return (
            <span
              className="text-danger pr-3"
              key={timeIndex}
            >{time.time[0]}-{time.time[1]} {time.label};</span>
          )
        })
      }

      return (
        <li className="day-list__item mb-3" key={day.day}>
          <div>
            <span className="pr-2">{day.day}:</span>
            { timeElem }
            { timeOffsElems }
          </div>
        </li>
      )
    })

    // For detailed page
    // const timers = this.state.times.map((el, index) => {
    //   const { label, time } = el;
    //   return (
    //     <div key={index}>
    //       <p>{time[0]} - {time[1]} {label}</p>
    //       {/* <TimeRangePicker
    //         onChange={(time) => this.onTimeRangeChange(time, index)}
    //         value={time}
    //         format={"HH:mm"}
    //         clearIcon={null}
    //         disableClock
    //         required
    //       /> */}
    //   </div>
    //   )
    // });

    return (
      <div className="shop-list-item">
        <p className="shop-list-item__name">
          <b>{ this.props.name }</b>
          <span className="float-right">
            <Link
              type="button"
              className="shop-list-item__btn btn btn-outline-warning btn-sm"
              aria-label="Edit shop"
              to={`/shop/${this.props._id}`}
            >
              <i className="fa fa-edit"></i>
            </Link>
            <button
              type="button"
              className="shop-list-item__btn btn btn-outline-danger btn-sm"
              aria-label="Delete shop"
              onClick={this.handleDelete}
            >
              <i className="fa fa-trash-o"></i>
            </button>
          </span>
          </p>
        { descriptionElem }
        { addressElem }
        <p>{ this.state.shopIsWorking ? 'Shop is working' : 'Closed' }</p>
        <p>Current time: { this.state.curTime }</p> {/* Для дебага */}
        <p>Schedule:</p>
        <ul className="day-list">
          { days }
        </ul>
      </div>
    );
  };
}
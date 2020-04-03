import React, { Component } from 'react';

import './shop-list-item.css';

import { fullWeekDay, weekDayMap } from '../../helpers/date-helpers';
import { Link } from 'react-router-dom';
import DayList from '../day-list';
import ShopInput from '../general/shop-input';

const cloneDeep = require('lodash.clonedeep');

export default class App extends Component {
  state = {
    curDay: fullWeekDay, // date-helpers
    curDayIndex: weekDayMap[fullWeekDay], // date-helpers
    curTime: this.getCurTime(), // state.curTime is for debug only
    shopIsWorking: false,
    shop: cloneDeep(this.props.shop), // Deep shallow copy
  };

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
    this.setState({ 
      curTime: this.getCurTime(), // state.curTime is for debug only
      shopIsWorking: this.checkIsWorking(),
    });
  };

  getCurTime() {
    // Builds a string formatted HHmm
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

  getFromToTimes(arr) {
    // If time[] element == null, change it to '0000'
    const time = arr.map(el => el || '0000');
    return {
      from: time[0].replace(':', ''),
      to: time[1].replace(':', ''),
    };
  };

  checkIsWorking = () => {
    const { schedule, isClosed } = this.state.shop;
    if (!schedule) return false; // state isn't ready
    const todaySchedule = schedule[this.state.curDayIndex];

    // Store is closed in general or today
    if (isClosed || todaySchedule.closed) return false;

    const curTime = this.getCurTime();

    // Is during work time
    const { from , to } = this.getFromToTimes(todaySchedule.workTime);
    if (from > curTime || to < curTime) return false;

    // Has time offs
    if (!todaySchedule.timeOffs) return true;

    // Is during time offs
    for (let i = 0; i < todaySchedule.timeOffs.length; i++) {
      const { from , to } = this.getFromToTimes(todaySchedule.timeOffs[i].time);
      if ((from <= curTime) && (to >= curTime)) return false;
    }

    return true;
  };

  saveShop = async () => {
    const newShop = { ...this.state.shop }; // Shallow copy
    const redirect = await this.props.handleSaveBtn(newShop);
    if (redirect) this.props.history.push('/');
  };

  handleDelete = () => {
    this.props.handleDelete(this.state.shop._id);
  };

  onTimeRangeChange = (time, dayIndex, timeOffIndex, main = false) => {
    const newShop = { ...this.state.shop }; // Shallow copy
    if (main) {
      newShop.schedule[dayIndex].workTime = time;
      this.setState({ shop: newShop });
      return;
    }

    const { from: goalFrom, to: goalTo } = this.getFromToTimes(time);
    const timeOffs = newShop.schedule[dayIndex].timeOffs;

    for (let i = 0; i < timeOffs.length; i++) {
      if (i === timeOffIndex) continue;

      const { from, to } = this.getFromToTimes(timeOffs[i].time);
      // Assuming that the first time is always <= than the second time
      // Need to do a lot of changes to force this behavior and remain user-friendly
      // Which I'm not interested in at the moment
      if ((goalFrom >= from && goalFrom <= to) || (goalTo >= from && goalTo <= to)) {
        console.log('Time offs intertwine');
        break;
      }
    }
    timeOffs[timeOffIndex].time = time;
    this.setState({ shop: newShop });
  };

  handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newShop = { ...this.state.shop }; // Shallow copy
    newShop[name] = value;
    this.setState({ shop: newShop });
  };

  handleIsClosedCheckbox = (e, dayIndex) => {
    const value = e.target.checked;
    const newShop = { ...this.state.shop }; // Shallow copy

    // If it's general shop status
    if (dayIndex === undefined) {
      newShop.isClosed = value;
      this.setState({ shop: newShop });
      return;
    }
    newShop.schedule[dayIndex].closed = value;
    this.setState({ shop: newShop });
  };

  handleAddTimeOff = (dayIndex) => {
    const newShop = { ...this.state.shop }; // Shallow copy
    if (!newShop.schedule[dayIndex].timeOffs) {
      Object.assign(newShop.schedule[dayIndex], { timeOffs: [] });
    }
    const timeOffsTemplate = {
      label: '',
      time: ['13:00', '14:00'],
    };
    newShop.schedule[dayIndex].timeOffs.push(timeOffsTemplate);
    this.setState({ shop: newShop });
  };

  handleDeleteTimeOff = (dayIndex, timeOffIndex) => {
    const newShop = { ...this.state.shop }; // Shallow copy
    newShop.schedule[dayIndex].timeOffs.splice(timeOffIndex, 1);
    this.setState({ shop: newShop });
  };

  handleTimeOffLabelChange = (e, dayIndex, timeOffIndex) => {
    const value = e.target.value;
    const newShop = { ...this.state.shop }; // Shallow copy
    newShop.schedule[dayIndex].timeOffs[timeOffIndex].label = value;
    this.setState({ shop: newShop });
  };

  render() {
    const { isEditMode, user } = this.props;
    const { _id, name, description, address, schedule, isClosed } = this.state.shop;

    let nameEl, descriptionEl, addressEl, isClosedEl, controlsEl, saveShopBtn = null;
    if (isEditMode) {
      nameEl = (
        <ShopInput
          label="Name"
          name="name"
          placeholder="Enter your shop name"
          value={this.state.shop.name}
          inputHandler={this.handleInputChange}
          required />
      )
      descriptionEl = (
        <ShopInput
          label="Description"
          name="description"
          placeholder="Describe this shop"
          value={this.state.shop.description}
          inputHandler={this.handleInputChange} />
      )
      addressEl = (
        <ShopInput
          label="Address"
          name="address"
          placeholder="Shop address"
          value={this.state.shop.address}
          inputHandler={this.handleInputChange} />
      )
      isClosedEl = (
        <label className="shop-list-item__checkbox-label input-group-text mb-3">
          Shop is closed
          <input
            className="ml-2"
            type="checkbox"
            name="isClosed"
            checked={isClosed}
            onChange={this.handleIsClosedCheckbox} />
        </label>
      )
      saveShopBtn = (
        <button
          className="btn btn-warning"
          type="button"
          onClick={this.saveShop}
          disabled={!this.state.shop.name.length}
        >
          { this.props.createNew ? 'Create shop' : 'Save changes' }
        </button>
      )
    } else {
      nameEl = <b>{ name }</b>
      descriptionEl = <p>{ description }</p>
      addressEl = <p>Address: { address }</p>
      
      if (user && user.id && user.id === this.state.shop.user) {
        controlsEl = (
          <span className="float-right">
            <Link
              className="shop-list-item__btn btn btn-outline-warning btn-sm"
              aria-label="Edit shop"
              to={`/shop/${_id}`}
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
        )
      }
    }

    return (
      <div className="shop-list-item">
        <p className={isEditMode ? 'mb-0' : 'shop-list-item__name'}>
          { nameEl }
          { controlsEl }
        </p>
        { descriptionEl }
        { addressEl }
        <p>{
          this.state.shopIsWorking
            ? <span className="text-success">Shop is working</span>
            : <span className="text-danger">Closed</span>
        }</p>
        { isClosedEl }
        <p>Current time (for debug): { this.state.curTime }</p>
        <p>Schedule:</p>
        <DayList
          schedule={schedule}
          isEditMode={isEditMode}
          onTimeRangeChange={this.onTimeRangeChange}
          handleIsClosedCheckbox={this.handleIsClosedCheckbox}
          handleAddTimeOff={this.handleAddTimeOff}
          handleDeleteTimeOff={this.handleDeleteTimeOff}
          handleTimeOffLabelChange={this.handleTimeOffLabelChange}
        />
        { saveShopBtn }
      </div>
    );
  };
}
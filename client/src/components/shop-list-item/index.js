import React, { Component } from 'react';

import './shop-list-item.css';

import { fullWeekDay, weekDayMap } from '../../helpers/date-helpers';
import { Link } from 'react-router-dom';
import DayList from '../day-list';
import ShopInput from '../general/shop-input';

export default class App extends Component {
  state = {
    curDay: fullWeekDay, // date-helpers
    curDayIndex: weekDayMap[fullWeekDay], // date-helpers
    curTime: this.getCurTime(),
    shopIsWorking: false,
    shop: { ...this.props.shop },
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
      curTime: this.getCurTime(),
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

  checkIsWorking = () => {
    const { schedule, isClosed } = this.state.shop;
    if (!schedule) return false; // state isn't ready
    const todaySchedule = schedule[this.state.curDayIndex];

    // Store is closed in general or today
    if (isClosed || todaySchedule.closed) return false;

    // Is during work time
    const time = todaySchedule.workTime.map(el => el || '0000'); // If time == null, change it to '0000'
    const from = time[0].replace(':', '');
    const to = time[1].replace(':', '');
    if (from > this.state.curTime || to < this.state.curTime) return false;

    // Has time offs
    if (!todaySchedule.timeOffs) return true;

    // Is during time offs
    for (let i = 0; i < todaySchedule.timeOffs.length; i++) {
      const time = todaySchedule.timeOffs[i].time.map(el => el || '0000'); // If time == null, change it to '0000'
      const from = time[0].replace(':', '');
      const to = time[1].replace(':', '');
      
      if ((from <= this.state.curTime) && (to >= this.state.curTime)) return false;
    }

    return true;
  };

  // For detailed page
  saveShop = async () => {
    const newShop = { ...this.state.shop }; // Shallow copy
    const redirect = await this.props.handleSaveBtn(newShop);
    if (redirect) this.props.history.push('/');
  };

  handleDelete = () => {
    this.props.handleDelete(this.state.shop._id);
  };

  // For detailed page
  onTimeRangeChange = (time, dayIndex, timeOffIndex, main = false) => {
    const newShop = { ...this.state.shop }; // Shallow copy
    if (main) {
      newShop.schedule[dayIndex].workTime = time;
      this.setState({ shop: newShop });
      return;
    }
    newShop.schedule[dayIndex].timeOffs[timeOffIndex].time = time;
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
    const { isDetail, user } = this.props;
    const { _id, name, description, address, schedule, isClosed } = this.state.shop;

    let showControls = false;
    if (user && user.id) {
      showControls = (user.id === this.state.shop.user && !isDetail);
    }

    let nameElem = null;
    if (isDetail) {
      nameElem = (
        <ShopInput
          label="Name"
          name="name"
          placeholder="Enter your shop name"
          value={this.state.shop.name}
          inputHandler={this.handleInputChange}
          required />
      )
    } else {
      nameElem = <b>{ name }</b>
    }
    
    let descriptionElem = null;
    if (isDetail) {
      descriptionElem = (
        <ShopInput
          label="Description"
          name="description"
          placeholder="Describe this shop"
          value={this.state.shop.description}
          inputHandler={this.handleInputChange} />
      )
    } else {
      descriptionElem = <p>{ description }</p>
    }

    let addressElem = null;
    if (isDetail) {
      addressElem = (
        <ShopInput
          label="Address"
          name="address"
          placeholder="Shop address"
          value={this.state.shop.address}
          inputHandler={this.handleInputChange} />
      )
    } else {
      addressElem = <p>Address: { address }</p>
    }

    const controls = (
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

    const saveShopBtn = (
      <button
        className="btn btn-warning"
        type="button"
        onClick={this.saveShop}
        disabled={!this.state.shop.name.length}
      >
        { this.props.createNew ? 'Create shop' : 'Save changes' }
      </button>
    )

    const isClosedElem = (
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

    return (
      <div className="shop-list-item">
        <p className={isDetail ? 'mb-0' : 'shop-list-item__name'}>
          { nameElem }
          { showControls ? controls : null }
        </p>
        { descriptionElem }
        { addressElem }
        <p>{
          this.state.shopIsWorking
            ? <span className="text-success">Shop is working</span>
            : <span className="text-danger">Closed</span>
        }</p>
        { isDetail ? isClosedElem : null }
        <p>Current time (for debug): { this.state.curTime }</p> {/* Для дебага */}
        <p>Schedule:</p>
        <DayList
          schedule={schedule}
          isDetail={isDetail}
          onTimeRangeChange={this.onTimeRangeChange}
          handleIsClosedCheckbox={this.handleIsClosedCheckbox}
          handleAddTimeOff={this.handleAddTimeOff}
          handleDeleteTimeOff={this.handleDeleteTimeOff}
          handleTimeOffLabelChange={this.handleTimeOffLabelChange}
        />
        { isDetail ? saveShopBtn : null }
      </div>
    );
  };
}
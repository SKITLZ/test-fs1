import React from 'react';

import './day-list.css';

// For detailed page
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import ShopInput from '../general/shop-input';

const DayList = ({
  schedule,
  isDetail,
  onTimeRangeChange,
  handleIsClosedCheckbox,
  handleAddTimeOff,
  handleDeleteTimeOff,
  handleTimeOffLabelChange,
}) => {
  if (!schedule) return null; // state isn't ready yet

  const days = schedule.map((day, dayIndex) => {
    const workTime = day.workTime;
    const openTimesElem = <span className="text-success pr-3">Open {workTime[0]}-{workTime[1]};</span>

    let closedElem = null;
    if (isDetail) closedElem = <span className="text-danger w-100 mt-2">Closed</span>;
    else closedElem = <span className="text-danger pr-3">Closed</span>;

    let addTimeOffElem = null;
    if (isDetail) {
      addTimeOffElem = (
        <button
          className="btn btn-outline-primary btn-sm"
          type="button"
          onClick={() => handleAddTimeOff(dayIndex)}
        >Add time off</button>
      )
    }
    
    let timeElem = null;
    if (day.closed) {
      timeElem = closedElem;
    } else {
      if (isDetail) {
        timeElem = (
          <div className="w-100 mt-2">
            <TimeRangePicker
              className="pr-1"
              onChange={(time) => onTimeRangeChange(time, dayIndex, 0, true)}
              value={workTime}
              format={"HH:mm"}
              clearIcon={null}
              disableClock
              required
            />
            <span className="d-inline-block">{ openTimesElem }</span>{ addTimeOffElem }
          </div>
        );
      } else {
        timeElem = (
          <div>
            { openTimesElem }
          </div>
        )
      }
    }
    let timeOffsElems = null;
    if (day.timeOffs) {
      timeOffsElems = day.timeOffs.map((timeOff, timeOffIndex) => {
        let timeOffElem = (
          <span className="text-danger pr-3">
            {timeOff.time[0]}-{timeOff.time[1]} {timeOff.label};
          </span>
        );

        if (isDetail) {
          timeOffElem = (
            <ShopInput
              name="label"
              value={timeOff.label}
              inputHandler={(e) => handleTimeOffLabelChange(e, dayIndex, timeOffIndex)}
            />
          )

          return (
            <div className="day-list__time-off" key={timeOffIndex}>
              <TimeRangePicker
                className="mr-1"
                onChange={(time) => onTimeRangeChange(time, dayIndex, timeOffIndex)}
                value={timeOff.time}
                format={"HH:mm"}
                clearIcon={null}
                disableClock
                required
              />
              { timeOffElem }
              <button
                type="button"
                className="day-list__del-time-off btn btn-outline-danger btn-sm ml-1"
                aria-label="Delete time off"
                onClick={() => handleDeleteTimeOff(dayIndex, timeOffIndex)}
              >
                <i className="fa fa-trash-o"></i>
              </button>
            </div>
          )
        }

        return (
          <div key={timeOffIndex}>
            { timeOffElem }
          </div>
        )
      })
    }

    const isClosedCheckbox = (
      <label className="day-list__checkbox-label input-group-text">
        Closed this day
        <input
          className="ml-2"
          type="checkbox"
          name="isClosed"
          checked={day.closed || false}
          onChange={(e) => handleIsClosedCheckbox(e, dayIndex)} />
      </label>
    );
    
    return (
      <li className={isDetail ? 'mb-5' : 'mb-3'} key={day.day}>
        <div className="day-list__item">
          <span className="day-list__name pr-2">{day.day}: { isDetail ? isClosedCheckbox : null}</span>
          { timeElem }
          { timeOffsElems }
        </div>
      </li>
    )
  })

  return <ul className="day-list">{ days }</ul>;
};

export default DayList;
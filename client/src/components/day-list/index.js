import React from 'react';

import './day-list.css';

// For detailed page
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

const DayList = ({ schedule, isClosed, onTimeRangeChange, isDetail}) => {
  if (!schedule) return null; // state isn't ready yet

  const days = schedule.map((day, dayIndex) => {
    const workTime = day.workTime;
    const openTimesElem = <span className="text-success pr-3">Open {workTime[0]}-{workTime[1]};</span>
    const closedElem = <span className="text-danger pr-3">Closed</span>
    let timeElem = '';
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
            { openTimesElem }
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
        if (isDetail) {
          return (
            <div className="w-100 mt-2" key={timeOffIndex}>
              <TimeRangePicker
                className="pr-1"
                onChange={(time) => onTimeRangeChange(time, dayIndex, timeOffIndex)}
                value={timeOff.time}
                format={"HH:mm"}
                clearIcon={null}
                disableClock
                required
              />
              <span className="text-danger pr-3">
                {timeOff.time[0]}-{timeOff.time[1]} {timeOff.label};
              </span>
            </div>
          )
        }
        return (
          <div key={timeOffIndex}>
            <span className="text-danger pr-3">
              {timeOff.time[0]}-{timeOff.time[1]} {timeOff.label};
            </span>
          </div>
        )
      })
    }

    return (
      <li className="mb-3" key={day.day}>
        <div className="day-list__item">
          <span className="pr-2">{day.day}:</span>
          { timeElem }
          { timeOffsElems }
        </div>
      </li>
    )
  })

  return <ul className="day-list">{ days }</ul>;
};

export default DayList;
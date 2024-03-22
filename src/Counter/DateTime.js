import React, { useState, useEffect, useCallback } from 'react';
import ShowTimer from './ShowTimer';
import "../Style/DateTime.css";

const DateTime = () => {
  const [targetDateTime, setTargetDateTime] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [countdownOver, setCountdownOver] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    // Initialize targetDateTime state with current date and time when component mounts
    setTargetDateTime(getCurrentDateTime());
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  // Function to start the timer
  const startTimer = useCallback(() => {
    const targetTime = new Date(targetDateTime).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference > 0) {
      setRemainingTime(difference);
      if (countdownOver) {
        setCountdownOver(false);
      }

      const id = setInterval(() => {
        const currentTime = new Date().getTime();
        const newDifference = targetTime - currentTime;

        if (newDifference <= 0) {
          clearInterval(id);
          setRemainingTime(0);
          setCountdownOver(true);
        } else {
          setRemainingTime(newDifference);
        }
      }, 1000);

      setTimerId(id);
      setTimerStarted(true);
    } else {
      setCountdownOver(true);
    }
  }, [targetDateTime, countdownOver]);

  const stopTimer = () => {
    clearInterval(timerId);
    setTimerId(null);
  };

  const handleDateTimeChange = (event) => {
    const { value } = event.target;

    const maxDaysFromNow = 99;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDaysFromNow);

    const selectedDate = new Date(value);
    if (selectedDate > maxDate) {
      alert(`Please select a date within ${maxDaysFromNow} days from now.`);
      return;
    }
    setTargetDateTime(value);
    setTimerStarted(false);
  };

  const resetTimer = () => {
    clearInterval(timerId);
    setTimerId(null);
    setTargetDateTime("");
    setRemainingTime(0);
    setCountdownOver(false);
    setTimerStarted(false);
  };

  useEffect(() => {
    if (timerId !== null && timerStarted) {
      clearInterval(timerId);
      startTimer();
    }
  }, [targetDateTime, timerStarted, startTimer, timerId]);
  
  useEffect(() => {
    return () => {
      if (timerId !== null) {
        clearInterval(timerId);
      }
    };
  }, [timerId]); // Dependency for useEffect hook

  return (
    <div className="container">
      <h1 className="heading">Countdown Timer</h1>
      <div className="input">
        <input
          type="datetime-local"
          value={targetDateTime}
          onChange={handleDateTimeChange}
        />
        <div>
          <button onClick={startTimer}>Start Timer</button>
          <button onClick={stopTimer}>Stop Timer</button>
          <button onClick={resetTimer}>Reset Timer</button>
        </div>
      </div>
      <div className="wrap">
        {countdownOver ? (
          <p>The countdown is over. What's next on your adventure?</p>
        ) : (
            <>
              <ShowTimer time={Math.floor(remainingTime / (1000 * 60 * 60 * 24))} date={"Days"} />
              <ShowTimer time={Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} date={"Hours"} />
              <ShowTimer time={Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))} date={"Minutes"} />
              <ShowTimer time={Math.floor((remainingTime % (1000 * 60)) / 1000)} date={"Seconds"} />
            </>
          )}
      </div>
    </div>
  );
};

export default DateTime;

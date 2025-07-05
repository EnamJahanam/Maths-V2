/**
 * @fileoverview A visual countdown timer component for quizzes.
 */
import React, { useState, useEffect } from 'react';

/**
 * Props for the Timer component.
 */
interface TimerProps {
  /** The initial time in seconds for the countdown. */
  initialTime: number;
  /** A callback function to execute when the timer reaches zero. */
  onTimeUp: () => void;
  /** A key to reset the timer. When this key changes, the timer restarts. */
  timerKey: string | number;
}

/**
 * A linear progress bar timer that counts down from an initial time.
 * It resets whenever its `timerKey` prop changes.
 * @param {TimerProps} props The properties for the timer.
 * @returns {React.ReactElement} A styled div representing the progress bar.
 */
const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, timerKey }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // The main effect for handling the countdown logic.
  useEffect(() => {
    // Reset the timeLeft state whenever the timer is reset via the key.
    setTimeLeft(initialTime);
    
    // Do not start the interval if the time is zero or less.
    if (initialTime <= 0) return;

    // Set up a `setInterval` to decrement the time every second.
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        // When the timer is about to hit zero, clear the interval and call onTimeUp.
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        // Otherwise, just decrement the time.
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function: clear the interval when the component unmounts or the effect re-runs.
    return () => clearInterval(interval);
  // The effect re-runs when initialTime, onTimeUp, or timerKey changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTime, onTimeUp, timerKey]);

  // Calculate the width of the progress bar as a percentage of the remaining time.
  const percentage = (timeLeft / initialTime) * 100;

  return (
    <div className="w-full bg-slate-200 rounded-full h-4 my-4">
      {/* The inner div's width is animated via a CSS transition. */}
      <div
        className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 linear"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default Timer;
